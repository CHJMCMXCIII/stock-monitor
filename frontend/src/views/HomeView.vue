<template>
    <StockList></StockList>
    <ButtonGroup></ButtonGroup>
    <h2 class="stock-name">{{ currentStockName || '종목명' }}</h2>
    <h3 class="stock-price-today">{{ commaAddedStockPrice || 0 }}<span>원</span></h3>
    <TargetPriceAndChart></TargetPriceAndChart>

    <StockPriceTable></StockPriceTable>
</template>
<script>
import StockList from '../components/StockList'
import StockPriceTable from '../components/StockPriceTable'
import TargetPriceAndChart from '../components/TargetPriceAndChart.vue'
import ButtonGroup from "../components/ButtonGroup.vue"

import { onBeforeMount, computed } from 'vue'
import { useStore } from "vuex";

export default {
    name: 'stock-monitor-home',
    components: {
        StockList,
        StockPriceTable,
        TargetPriceAndChart,
        ButtonGroup
    },
    setup() {
        const store = useStore()
        let currentStockName = computed(() => store.state.currentStockName)
        let stockPrice = computed(() => store.state.stockPrice)
        
        onBeforeMount(() => {
            store.commit("SET_LOADING_STATE", true)
            store.dispatch("LOAD_DATA")
        })

        const commaAddedStockPrice = computed(() => {
            return stockPrice.value.toLocaleString('ko-KR');
        })

        return {
            currentStockName,
            stockPrice,
            commaAddedStockPrice,
        }
    },
}
</script>