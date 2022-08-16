<template>
    <div class="price-table">
        <table>
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>종가</th>
                    <th>증감</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(stock, index) in tableData" :key="index">
                    <td>{{ stock.date }}</td>
                    <td>&#8361; {{ stock.endPrice }}</td>
                    <td :class="{ 'increase': stock.isIncrease, 'decrease': !stock.isIncrease }">
                        <span v-if="stock.isIncrease">▲</span>
                        <span v-else>▼</span>
                        {{ stock.variance }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from "vuex";

export default {
    name: 'StockPriceTable',
    setup() {
        const store = useStore()
        // state는 computed 로 접근해야함.
        const tableValue = computed(() => store.state.tableValue)

        let tableData = ref(tableValue)

        return {
            tableData
        }
    }
}
</script>