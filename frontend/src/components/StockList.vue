<template>
    <nav>
        <ul @click="navFocus()">
            <li v-for="(company, idx) in companyList" :key="idx" :class="{ active: companyName === company.name }" @click="setData(company.name)">{{ company.name }}</li>
        </ul>
    </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from "vuex";


export default {
    name: 'StockList',
    setup() {
        const store = useStore()
        // state는 computed 로 접근해야함.
        // 값 변동시 set
        const companyList = computed(() => store.state.stocks)
        
        let companyName = ref(companyList.value[0].name)

        let setData = (name) => {
            companyName.value = name
            store.dispatch("CHANGE_DATA", name)
        }

        const navFocus = () => {
            let ul = document.querySelector("nav > ul")
            let activeLi = ul.querySelector(".active")
            activeLi.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
        }

        return {
            companyList,
            companyName,
            navFocus,
            setData
        }
    }
}
</script>