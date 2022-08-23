<template>
    <section id="page-add">
        <h2>종목 추가</h2>
        <fieldset>
            <legend>
                유효한 종목명과 코드를 입력해주세요!
                <a href="https://www.kbsec.com/go.able?linkcd=s03090010P100&gubun=0" target="_blank" title="새 창에서 열기">종목코드 검색하러 가기(새 창)</a>
            </legend>

            <div>
                <input v-model="addStockName" type="text" id="name" autocomplete="off" required>
                <label for="name"><p>종목명</p></label>
            </div>

            <div>
                <input v-model="addStockCode" type="text" id="code" autocomplete="off" required  @input="numCheck" minlength="6" maxlength="6">
                <label for="code"><p>종목코드 <span>ex) 000000</span></p></label>
            </div>


            <button class="button-save" @click="addStock">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
                </svg>
                추가
            </button>
        </fieldset>
    </section>

</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'stock-monitor-add',
    setup() {
        const store = useStore()

        const addStockName = ref('')
        const addStockCode = ref('')

        onMounted(() => {
            store.commit("SET_LOADING_STATE", false)
        })

        const addStock = () => {
            const payload = {
                "name": addStockName.value,
                "code": addStockCode.value
            }
            store.dispatch("ADD_STOCK", payload)
            // RELOAD
            // HOME 으로 페이지 이동
        }

        const numCheck = (event) => {
            event.target.value = event.target.value.replace(/\D/g,"")
        }

        // 숫자나 문자만 입력 가능하게끔
        return {
            addStockName,
            addStockCode,
            addStock,
            numCheck
        }
    }
}
</script>