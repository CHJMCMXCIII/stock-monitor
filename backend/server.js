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

const companyList = [
    {
        name: '삼성전자',
        code: '0005930'
    },
    {
        name: '기아',
        code: '000270'
    },
    {
        name: '포스코케미칼',
        code: '003670'
    },
    {
        name: '두산에너빌리티',
        code: '034020'
    },
    {
        name: 'CJ CGV',
        code: '079160'
    },
    {
        name: 'SK이노베이션',
        code: '096770'
    },
]

// https://poiemaweb.com/es6-generator
function* reqDaysPrice(url, name) {
    const resource = yield nightmare
        .goto(url)
        // 페이지 정보 읽어오기
        .evaluate(() => document.body.innerHTML)

    const $ = cheerio.load(resourse)
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
    })

    return returningArray
}

const run = function* () {
    let returningObject = {}
    for (let company of companyList) {
        const name = company.name
        const code = company.code

        const reqPrice = yield* reqDaysPrice(DAY_PRICE_URL + code, name)
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
    const urlList = companyList.map(i => requestTodayPrice(COMPANY_MAIN_URL + i.code, i.name))
    const returningUrlList = await Promise.all(urlList)

    let returningObject = {}

    returningUrlList.forEach(i => {
        obj = {
            ...i,
            ...obj
        }
    })

    res.send(obj)
})

app.get('/stocks/days', (req, res) => {
    vo(run)(function (err, data) {
        if(err) console.log(`error : ${err}`)
        res.send(data)
    })
})

app.listen(PORT, () => {
    console.log(`서버가 http://127.0.0.1:${PORT} 에서 구동되고 있어요!`)
})