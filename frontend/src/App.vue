<template>
    <section>
        <h1 class="app-title">주가 모니터</h1>
        <div class="wrapper">
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
            <div class="target-price">
                <label for="target" v-if="parseInt(targetPrice) === 0">목표 매수금액을 설정하세요!</label>
                <label for="target" v-else-if="parseInt(targetPrice) !== 0">아래 버튼을 눌러 저장해주세요!</label>
                <label for="target" v-else>저장되었습니다.</label>
                <input id="target" v-model.number="targetPrice" type="number" step="500">
                <button @click="setTargetPrice()">
                    저장
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M15.563 22.282l-3.563.718.72-3.562 2.843 2.844zm-2.137-3.552l2.845 2.845 7.729-7.73-2.845-2.845-7.729 7.73zm-3.062 2.27h-7.364v-7h12.327l6.673-6.688v-2.312l-4-4h-18v22h9.953l.411-2zm-5.364-18h12v7h-12v-7zm8.004 6h2.996v-5h-2.996v5z" />
                    </svg></button>
            </div>
        </div>
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
        let targetPrice = ref(0)
        let displayingStockPrice = ref({})
        let displayingStockPriceList = ref({})
        let stockPriceToday = {}
        let stockPriceList = {}

        const setTargetPrice = () => {
            setLocalStorage(name.value, targetPrice.value)
        }

        const getLocalStorage = name => {
            return localStorage.getItem(name) || 0
        }

        const setLocalStorage = (name, value) => {
            localStorage.setItem(name, value)
        }

        let setData = (data) => {
            name.value = data
            displayingStockPrice.value = stockPriceToday[data]
            displayingStockPriceList.value = stockPriceList[data]
            targetPrice.value = getLocalStorage(data)
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
            targetPrice,
            stockPriceToday,
            stockPriceList,
            displayingStockPrice,
            name,
            setTargetPrice,
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
        padding-top: 1.6rem;
        margin-bottom: 1.6rem;
        color: #dedede;

        &:first-of-type {
            margin-left: 1.6rem;
        }

        &:last-of-type {
            margin-right: 3.2rem;
        }

        &.active {
            color: #fff;
            font-weight: bold;
        }

    }
}

.target-price {

    label {
        display: inline-block;
        margin-left: .8rem;
        color: #ddd;
        font-size: 1.4rem;
    }

    input {
        position: relative;
        z-index: 1;
        margin: .8rem auto 0;
        padding: .8rem;
        width: 100%;
        background: #fff;
        color: #333;
        font-size: 2.4rem;
    }

    button {
        width: 100%;
        padding: 1.8rem;
        background-color: #7f00ff;
        text-align: center;
        font-size: 1.8rem;
        font-weight: 500;
        transition: background-color .2s ease-out, color .2s ease-out;

        svg {
            margin-left: .4rem;
            fill: #fff;
            transition: fill .2s ease-out;
        }

        &:hover {
            color: #1f2023;
            background-color: #7ff000;

            svg {
                fill: #1f2023;
            }
        }
    }
}
</style>