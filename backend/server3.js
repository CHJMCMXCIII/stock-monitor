const fs = require('fs');
const path = require('path');

const getJson = () => {
    let jsonFilePath = path.join(__dirname, './data/CompanyList.json')
    let data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

    return data
}

let companyList = getJson()

const newStock = {
    name: "asd",
    code: "123213"
}

companyList.unshift(newStock)
companyList.unshift(newStock)
companyList.unshift(newStock)

const set = new Set(companyList)

companyList = [...set]

console.log(companyList)