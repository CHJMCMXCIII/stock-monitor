<template>
    <section>
        <h1 class="app-title">주식 매수 목표가격 모니터</h1>
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

            <h2 class="stock-name">
                {{ currentStockName || '종목명' }}
                <button class="reload-button" @click="reloadData()" :disabled="isReloading">
                    <span>새로고침</span>
                    <svg :class="{ rotate: isReloading }" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M23 12c0 1.042-.154 2.045-.425 3h-2.101c.335-.94.526-1.947.526-3 0-4.962-4.037-9-9-9-1.706 0-3.296.484-4.655 1.314l1.858 2.686h-6.994l2.152-7 1.849 2.673c1.684-1.049 3.659-1.673 5.79-1.673 6.074 0 11 4.925 11 11zm-6.354 7.692c-1.357.826-2.944 1.308-4.646 1.308-4.962 0-9-4.038-9-9 0-1.053.191-2.06.525-3h-2.1c-.271.955-.425 1.958-.425 3 0 6.075 4.925 11 11 11 2.127 0 4.099-.621 5.78-1.667l1.853 2.667 2.152-6.989h-6.994l1.855 2.681z" />
                    </svg>
                </button>
            </h2>
            <h3 class="stock-price-today">{{ commaAddedStockPrice || 0 }}<span>원</span></h3>

            <div class="button-wrapper">

            </div>

            <TargetPriceAndChart></TargetPriceAndChart>

            <StockPriceTable></StockPriceTable>
        </div>
    </section>
</template>
<script>
import StockList from './components/StockList'
import StockPriceTable from './components/StockPriceTable'
import TargetPriceAndChart from './components/TargetPriceAndChart.vue'
// import * as d3 from 'd3'
import { ref, onMounted, computed } from 'vue'
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
        let isReloading = ref(false)


        onMounted(() => {
            store.dispatch("LOAD_DATA")
        })

        const reloadData = () => {
            store.dispatch("RELOAD_DATA", currentStockName)
            isReloading.value = true

            setTimeout(() => {
                isReloading.value = false
            }, 1000)
        }

        const commaAddedStockPrice = computed(() => {
            return stockPrice.value.toLocaleString('ko-KR');
        })

        return {
            isLoading,
            isReloading,
            currentStockName,
            stockPrice,
            commaAddedStockPrice,
            reloadData
        }
    },
}
</script>

<style lang="scss">
@import "@/assets/scss/style.scss";
</style>