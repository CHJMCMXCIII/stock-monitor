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
            <ButtonGroup></ButtonGroup>
            <h2 class="stock-name">{{ currentStockName || '종목명' }}</h2>
            <h3 class="stock-price-today">{{ commaAddedStockPrice || 0 }}<span>원</span></h3>
            <TargetPriceAndChart></TargetPriceAndChart>

            <StockPriceTable></StockPriceTable>
        </div>
    </section>
</template>
<script>
import StockList from './components/StockList'
import StockPriceTable from './components/StockPriceTable'
import TargetPriceAndChart from './components/TargetPriceAndChart.vue'
import ButtonGroup from "./components/ButtonGroup.vue";

import { onMounted, computed } from 'vue'
import { useStore } from "vuex";


export default {
    name: 'stock-monitor',
    components: {
    StockList,
    StockPriceTable,
    TargetPriceAndChart,
    ButtonGroup
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

        const commaAddedStockPrice = computed(() => {
            return stockPrice.value.toLocaleString('ko-KR');
        })

        return {
            isLoading,
            currentStockName,
            stockPrice,
            commaAddedStockPrice,
        }
    },
}
</script>

<style lang="scss">
@import "@/assets/scss/style.scss";
</style>