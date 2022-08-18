const fs = require('fs');
const path = require('path');

const log = console.log
// https://velog.io/@thyoondev/Path.join%EC%99%80-Path.resolve-%EC%B0%A8%EC%9D%B4

let jsonFilePath = path.join(__dirname, './data/CompanyList.json')

let ogData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

const data = {
    "name": "LG화학",
    "code": "051910"
}

let newData = ogData

newData.push(data)


fs.writeFileSync(jsonFilePath, JSON.stringify(newData))

log(newData)