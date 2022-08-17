<template>
    <section>
        <h1 class="app-title">주식 목표가격 모니터</h1>
        <div class="wrapper">



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

            <StockList></StockList>

            <h2 class="stock-name">{{ currentStockName }}</h2>
            <h3 class="stock-price-today">{{ commaAddedStockPrice }}<span>원</span></h3>

            <TargetPriceAndChart></TargetPriceAndChart>

            <!-- <div class="button-wrapper">
                <button class="reload-button" onClick="window.location.reload()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z"/></svg>
                    <span>새로고침</span>
                </button>
            </div> -->

            <StockPriceTable></StockPriceTable>
        </div>
    </section>
</template>
<script>
import StockList from './components/StockList'
import StockPriceTable from './components/StockPriceTable'
import TargetPriceAndChart from './components/TargetPriceAndChart.vue'
// import * as d3 from 'd3'
import { onMounted, computed } from 'vue'
import { useStore } from "vuex";

export default {
    name: 'stock-monitor',
    components: {
        StockList,
        StockPriceTable,
        TargetPriceAndChart
    },
    //setup 함수는, Vue 3 에서 새로 나온 Composition API 이다.
    // 기존에 data, methods 등으로 흩어져있던것을, 하나의 장소로 모으게 해준다.
    // template 에서 사용하고자하는 변수, 함수등을 정의한뒤,
    // 객체에 하나씩 골라담아, return 해주면
    // template 에서 해당 변수와 함수를 접근할수있다.
    setup() {
        const store = useStore()
        let currentStockName = computed(() => store.state.currentStockName)
        let stockPrice = computed(() => store.state.stockPrice)
        let isLoading = computed(() => store.state.isLoading)


        onMounted(() => {
            store.dispatch("LOAD_DATA")
        })

        // setInterval(() => {
        //     axios.get('http://127.0.0.1:12010/stocks/today')
        //         .then(res => {
        //             stockPriceToday = res.data
        //             displayingStockPrice.value = stockPriceToday[name.value]
        //             //draw(targetPrice.value, displayingStockPrice.value)
        //         })
        // }, 1000 * 600)

        const commaAddedStockPrice = computed(() => {
            return stockPrice.value.toLocaleString('ko-KR');
        })

        return {
            isLoading,
            currentStockName,
            stockPrice,
            commaAddedStockPrice
        }
    },
}
</script>

<style lang="scss">
@import "@/assets/scss/style.scss";
</style>