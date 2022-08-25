import { createStore } from 'vuex'
import axios from 'axios'

const local_data = JSON.parse(localStorage.getItem("stocks"))

export default createStore({
    state: {
        stocks: local_data || {},
        isLoading : true,
        isFirstLoad: true,
        currentStockName: '',
        stockPriceData: {},
        stockPrice: 0,
        tableData: {},
        tableValue: {},
        targetPrice: '',
    },
    mutations: {
        SET_COMPANY(state, payload) {
            state.stocks = payload
        },
        SET_NAME(state, payload) {
            state.currentStockName = payload
        },
        SET_STOCK_PRICE(state, payload) {
            state.stockPrice = payload
        },
        SET_TABLE_DATA(state, payload) {
            state.tableValue = payload
        },
        SET_TARGET_PRICE(state, payload) {
            state.targetPrice = payload
        },
        SET_ISLOADING(state, payload) {
            state.isLoading = payload
        },
        SET_IS_FIRST_LOADING(state, payload) {
            state.isFirstLoad = payload
        }
    },
    actions: {
        LOAD_DATA({ commit }) {
            Promise.all([
                axios.get('http://127.0.0.1:12010/stocks/list'),
                axios.get("http://127.0.0.1:12010/stocks/today"),
                axios.get("http://127.0.0.1:12010/stocks/days")
            ])
                .then(res => {

                    // console.log('===LOAD DATA===')
                    // console.log(res[0].data[0].name)
                    // 종목 리스트 불러오기
                    commit("SET_COMPANY", res[0].data)
                    localStorage.setItem("stocks", JSON.stringify(res[0].data))

                    commit("SET_NAME", res[0].data[0].name)

                    // 현재 주가
                    // console.log('현재주가')
                    // console.log(res[1].data)
                    this.state.stockPriceData = res[1].data
                    commit("SET_STOCK_PRICE", this.state.stockPriceData[res[0].data[0].name])

                    // 가격 테이블
                    // console.log('가격테이블')
                    // console.log(res[2].data)
                    this.state.tableData = res[2].data
                    commit("SET_TABLE_DATA", this.state.tableData[res[0].data[0].name])
                    commit("SET_TARGET_PRICE", localStorage.getItem(res[0].data[0].name) || 0)

                    commit("SET_ISLOADING", false)
                    commit("SET_IS_FIRST_LOADING", false)
                }) 
        },
        CHANGE_DATA({ commit }, payload) {
            commit("SET_NAME", payload)
            commit("SET_STOCK_PRICE", this.state.stockPriceData[payload])
            commit("SET_TABLE_DATA", this.state.tableData[payload])
            commit("SET_TARGET_PRICE", localStorage.getItem(payload) || 0)
        },
        RELOAD_DATA({ commit }, payload) {
            axios.get('http://127.0.0.1:12010/stocks/today')
                .then(res => {
                    //console.log(res.data[payload.value])
                    commit("SET_STOCK_PRICE", res.data[payload])
                })
        },
        DELETE_STOCK({ commit }, payload) {
            axios.delete(`http://127.0.0.1:12010/stocks/list/${payload}`)
                .then(res => {
                    commit("SET_COMPANY", res.data)
                    commit("SET_NAME", res.data[0].name)
                    localStorage.setItem("stocks", JSON.stringify(res.data))
                })
        },
        ADD_STOCK({ commit }, payload) {
            Promise.all([
                axios.put(`http://127.0.0.1:12010/stocks/list/${payload.name}&${payload.code}`),
                axios.get('http://127.0.0.1:12010/stocks/list'),
                axios.get("http://127.0.0.1:12010/stocks/today"),
                axios.get("http://127.0.0.1:12010/stocks/days")
            ])
                .then(res => {
                    commit("SET_COMPANY", res[0].data)
                    commit("SET_NAME", res[0].data[0].name)
                    localStorage.setItem("stocks", JSON.stringify(res[0].data))
                })
        }
    }
})

