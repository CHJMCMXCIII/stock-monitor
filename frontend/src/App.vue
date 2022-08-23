<template>
    <section>
        <div class="router-nav">
            <h1 class="app-title">
                <router-link to="/">주식 매수 목표가격 모니터</router-link>
            </h1>
            <router-link class="link-add" to="/add">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>
                <span>종목추가</span>
            </router-link>
        </div>

        <div id="content">
            <router-view />
        </div>
    </section>
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
</template>
<script>
import { onBeforeMount, computed } from 'vue'
import { useStore } from "vuex";

export default {
    name: 'stock-monitor',
    setup() {
        const store = useStore()
        let isLoading = computed(() => store.state.isLoading)

        onBeforeMount(() => {
            store.commit("SET_ISLOADING", true)
        })
        

        return {
            isLoading
        }
    }
}

</script>

<style lang="scss">
@import "@/assets/scss/style.scss";
</style>