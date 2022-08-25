const express = require('express')
const app = express()
const axios = require('axios')
//  jQuery를 서버사이드에 맞게 수정한 라이브러리
const cheerio = require('cheerio')
const PORT = 12010
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })
const cors = require('cors')
// frontend 8080 포트에서 요청을 허용하기 위해 사용
app.use(cors())
// 비동기적인 파이프라인을 구성할 때 쓰는 모듈
const vo = require('vo')
const COMPANY_MAIN_URL = 'https://finance.naver.com/item/main.nhn?code='
const DAY_PRICE_URL = 'https://finance.naver.com/item/sise_day.nhn?code='

const fs = require('fs')
const path = require('path')
const _ = require('lodash')


const getJson = () => {
    let jsonFilePath = path.join(__dirname, './data/CompanyList.json')
    let data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

    return data
}

//let companyList = getJson()

const writeJson = (data) => {
    let jsonFilePath = path.join(__dirname, './data/CompanyList.json')
    fs.writeFileSync(jsonFilePath, data)
}

// https://poiemaweb.com/es6-generator
function * reqDaysPrice(url, name) {
    const resource = yield nightmare
        .goto(url)
        // 페이지 정보 읽어오기
        .evaluate(() =>document.body.innerHTML)
    
    const $ = cheerio.load(resource)
    const returningArray = []

    $('tr').each((index, element) => {
        const tds = $(element).find('td')
        const date = $(tds[0]).find('span').eq(0).text().trim()
        if (date.length === 0 || index === 16) return
        const endPrice = $(tds[1]).find('span').eq(0).text().trim()
        const variance = $(tds[2]).find('span').eq(0).text().trim()
        const isIncrease = $(tds[2]).find('span').eq(0).attr('class').includes("red02")
        returningArray.push({
            date, endPrice, variance, isIncrease
        })
    });

    return returningArray
}

const run = function* () {
    let returningObject = {}
    let companyList = getJson()
    // 제너레이터 활용하여 기업별 정보 가져올때 비동기 로직 처리
    for (let company of companyList) {
        const name = company.name
        const code = company.code
        const reqPrice = yield * reqDaysPrice(DAY_PRICE_URL + code, name)
        const obj = {
            [name]: reqPrice
        }

        returningObject = {
            ...returningObject,
            ...obj
        }

    }
    return returningObject
}

// 기업 주식페이지에서 현재 주가 가져오기
const requestTodayPrice = (url, name) => {
    return new Promise((resolve, reject) => {
        axios.get(url)  
            .then((res) => {
                const $ = cheerio.load(res.data)
                const data = $('.no_today').eq(0).text().trim().split('\n')[0]
                // ~~ : undefined 또는 null을 0으로 변환
                const numData = ~~data.split(',')[0] * 1000 + ~~data.split(',')[1]

                resolve({
                    [name]: numData
                })
            })
            .catch(e => resolve(null))
    })
}

app.get('/stocks/today', async (req,res) => {
    
    let companyList = getJson()
    // console.log('현재가격')
    // console.log(companyList)
    const urlList = companyList.map(i => requestTodayPrice(COMPANY_MAIN_URL + i.code, i.name))
    // requestTodayPrice를 promise로 함수를 감쌌기 때문에 await 사용 가능
    const returningUrlList = await Promise.all(urlList)

    let returningObject = {}

    returningUrlList.forEach(i => {
        returningObject = {
            ...i,
            ...returningObject
        }
    })
    res.send(returningObject)
})

app.get('/stocks/days', (req, res) => {
    let companyList = getJson()
    // console.log('테이블')
    // console.log(companyList)
    vo(run)(function (err, data) {
        if(err)console.log(`error : ${err}`)
        res.send(data)
    })
})

app.get('/stocks/list', (req, res) => {
    let companyList = getJson()
    res.send(companyList)
})

app.put('/stocks/list/:name&:code', (req, res) => {
    //console.log(req.params)

    const newStock = {
        name: req.params.name,
        code: req.params.code
    }

    let companyList = getJson()

    companyList.unshift(newStock)

    // lodash 중복 제거
    companyList = _.uniqBy(companyList, "code")

    // console.log('수정: ')
    // console.log(companyList)

    writeJson(JSON.stringify(companyList))
    res.send(companyList)
})

app.delete('/stocks/list/:name', (req, res) => {
    let companyList = getJson()
    const findStock = companyList.find(n => n.name === req.params.name)
    
    if(!findStock) return res.status(404).send('올바르지 않은 요청입니다!')

    const index = companyList.indexOf(findStock)
    companyList.splice(index, 1)

    writeJson(JSON.stringify(companyList))
    res.send(companyList)
})

app.listen(PORT, () => {
    console.log(`서버가 http://127.0.0.1:${PORT} 에서 구동되고 있어요!`)
})

// curl http://127.0.0.1:12010/stock/days 로 백엔드 테스팅
// cmd 한글 깨질시 UTF-8로 변경 = chcp 65001