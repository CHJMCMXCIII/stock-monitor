<template>
    <section>
        <h1 class="app-title">주가 모니터</h1>
        <nav>
            <ul>
                <li @click="setData('삼성전자')" :class="{ 'active': name === '삼성전자' }">삼성전자</li>
                <li @click="setData('기아')" :class="{ 'active': name === '기아' }">기아</li>
                <li @click="setData('포스코케미칼')" :class="{ 'active': name === '포스코케미칼' }">포스코케미칼</li>
                <li @click="setData('CJ CGV')" :class="{ 'active': name === 'CJ CGV' }">CJ CGV</li>
                <li @click="setData('SK이노베이션')" :class="{ 'active': name === 'SK이노베이션' }">SK이노베이션</li>
            </ul>
        </nav>
        <div class="back" v-if="isLoading">
            <div class="background"></div>
            <div class="vs-loading">
                <div class="effect-1 effects"></div>
                <div class="effect-2 effects"></div>
                <div class="effect-3 effects"></div>
                <div class="message">
                    <p>정보를 불러오고 있어요!</p>
                </div>
            </div>
        </div>

        <h2 class="stock-name">{{ name }}</h2>
        <h3 class="stock-price-today">{{ displayingStockPrice }}</h3>
    </section>
</template>
<script>
import { onMounted, ref } from 'vue'
import axios from 'axios'

export default {
    name: 'stock-monitor',
    compnents: {},
    //setup 함수는, Vue 3 에서 새로 나온 Composition API 이다.
    // 기존에 data, methods 등으로 흩어져있던것을, 하나의 장소로 모으게 해준다.
    // template 에서 사용하고자하는 변수, 함수등을 정의한뒤,
    // 객체에 하나씩 골라담아, return 해주면
    // template 에서 해당 변수와 함수를 접근할수있다.
    setup() {
        let name = ref("삼성전자")
        let isLoading = ref(true)
        let displayingStockPrice = ref({})
        let stockPriceToday = {}
        let stockPriceList = {}

        let setData = (data) => {
            name.value = data
            displayingStockPrice.value = stockPriceToday[data]
        }


        onMounted(() => {
            Promise.all([
                axios.get("http://127.0.0.1:12010/stocks/today"),
                axios.get("http://127.0.0.1:12010/stocks/days")
            ])
                .then(res => {
                    isLoading.value = false
                    stockPriceToday = res[0].data
                    stockPriceList = res[1].data
                    setData("삼성전자")
                })
        })

        setInterval(() => {
            axios.get('http://127.0.0.1:12010/stocks/today')
                .then(res => {
                    stockPriceToday = res.data
                    displayingStockPrice.value = stockPriceToday[name.value]
                })
        }, 1000 * 60)

        return {
            isLoading,
            stockPriceToday,
            stockPriceList,
            displayingStockPrice,
            name,
            setData
        }



    }
}
</script>
<style lang="scss">
nav {
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 1.6rem;
    margin-bottom: 7.2rem;

    ul {
        display: flex;
        max-width: 320px;
        overflow-x: scroll;
        gap: 2.4rem;
        justify-content: space-between;
        width: 100%;
    }

    li {
        cursor: pointer;
        text-align: center;
        word-break: keep-all;
        white-space: nowrap;
        margin-bottom: 1.6rem;
        padding-top: .8rem;

        &:first-of-type {
            margin-left: 1.6rem;
        }

        &:last-of-type {
            margin-right: 3.2rem;
        }

        &.active {
            border-top: 2px solid red;
            font-weight: bold;
        }

    }


}
</style>