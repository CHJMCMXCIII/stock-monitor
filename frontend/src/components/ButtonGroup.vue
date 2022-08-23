<template>
    <div class="button-wrapper">
        <button class="reload-button" @click="reloadData()" :disabled="isReloading">
            <span>새로고침</span>
            <svg :class="{ rotate: isReloading }" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24">
                <path
                    d="M23 12c0 1.042-.154 2.045-.425 3h-2.101c.335-.94.526-1.947.526-3 0-4.962-4.037-9-9-9-1.706 0-3.296.484-4.655 1.314l1.858 2.686h-6.994l2.152-7 1.849 2.673c1.684-1.049 3.659-1.673 5.79-1.673 6.074 0 11 4.925 11 11zm-6.354 7.692c-1.357.826-2.944 1.308-4.646 1.308-4.962 0-9-4.038-9-9 0-1.053.191-2.06.525-3h-2.1c-.271.955-.425 1.958-.425 3 0 6.075 4.925 11 11 11 2.127 0 4.099-.621 5.78-1.667l1.853 2.667 2.152-6.989h-6.994l1.855 2.681z" />
            </svg>
        </button>
        <span class="separator">|</span>
        <button class="delete-button" @click="deleteStock">
            <span>종목 제거하기</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z" />
            </svg>
        </button>
    </div>
</template>
<script>
// const Josa = require('josa-js')
import Josa from 'josa-js'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'button-group',
    setup() {
        const store = useStore()
        let isReloading = ref(false)
        const companyList = computed(() => store.state.stocks)
        let currentStockName = computed(() => store.state.currentStockName)

        const reloadData = () => {
            store.dispatch("RELOAD_DATA", currentStockName.value)
            isReloading.value = true

            setTimeout(() => {
                isReloading.value = false
            }, 1000)
        }

        const deleteStock = () => {
            if (companyList.value.length < 2) {
                alert('하나 이상의 종목을 구독해주세요!')
            } else {
                let askDelete = confirm(`${Josa.r(currentStockName.value, '을/를')} 목록에서 제거할까요?`)
                if (askDelete) {
                    store.dispatch("DELETE_STOCK", currentStockName.value)
                }
            }

        }

        return {
            isReloading,
            currentStockName,
            reloadData,
            deleteStock
        }
    }
}
</script>