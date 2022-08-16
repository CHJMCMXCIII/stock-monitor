<template>
    <nav>
        <ul @click="scrollNav()">
            <!-- <li @click="setData('삼성전자')" :class="{ 'active': name === '삼성전자' }">삼성전자</li>
            <li @click="setData('기아')" :class="{ 'active': name === '기아' }">기아</li>
            <li @click="setData('포스코케미칼')" :class="{ 'active': name === '포스코케미칼' }">포스코케미칼</li>
            <li @click="setData('CJ CGV')" :class="{ 'active': name === 'CJ CGV' }">CJ CGV</li>
            <li @click="setData('SK이노베이션')" :class="{ 'active': name === 'SK이노베이션' }">SK이노베이션</li> -->
            <li v-for="(company, idx) in companyList" :key="idx" :class="{ active: companyName === company.name }" @click="setData(company.name)">{{ company.name }}</li>
        </ul>
    </nav>
</template>

<script>
const data = require('../../../data/CompanyList.json')
import { ref } from 'vue'

export default {
    name: 'StockList',
    setup() {
        const companyList = data.stocks
        let companyName = ref(companyList[0].name)

        const scrollNav = () => {
            let ul = document.querySelector("nav > ul")
            let activeLi = ul.querySelector(".active")
            activeLi.scrollIntoView({ inline: 'center', block: 'end', behavior: 'smooth' })
        }

        let setData = (name) => {
            companyName.value = name
        }

        return {
            companyName,
            companyList,
            scrollNav,
            setData
        }
    }
}


</script>