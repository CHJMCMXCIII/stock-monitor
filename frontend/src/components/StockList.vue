<template>
    <nav>
        <ul>
            <li v-for="(company, idx) in companyList" :key="idx" :class="{ active: companyName === company.name }"
                @click="setData(company.name)">{{ company.name }}</li>
        </ul>
    </nav>
</template>

<script>
import { computed, onUpdated } from 'vue'
import { useStore } from "vuex";


export default {
    name: 'StockList',
    setup() {
        const store = useStore()
        // state는 computed 로 접근해야함.
        // 값 변동시 set
        const companyList = computed(() => store.state.stocks)


        let companyName = computed({
            get: () => store.state.currentStockName,
            set: (newVal) => store.commit("SET_NAME", newVal)
        })

        const navFocus = () => {
            const ul = document.querySelector("nav > ul")
            const activeLi = ul.querySelector(".active")
            activeLi.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
        }

        let setData = (name) => {
            companyName.value = name
            store.dispatch("CHANGE_DATA", name)
        }

        onUpdated(() => {
            store.dispatch("CHANGE_DATA", companyName.value)
            navFocus()
        })

        return {
            companyList,
            companyName,
            setData
        }
    }
}
</script>