import { createStore } from 'vuex'
import axios from 'axios'
const data = require('../../../data/CompanyList.json')
const init_data = data.stocks

//import { axios } from 'axios'

const local_data = JSON.parse(localStorage.getItem("stocks"))

export default createStore({
    state: {
        stocks: local_data || init_data,
        isLoading : true,
        currentStockName: '',
        stockPriceData: {},
        stockPrice: {},
        tableData: {},
        tableValue: {},
        targetPrice: '',
    },
    mutations: {
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
            console.log(state.targetPrice)
        }
    },
    actions: {
        LOAD_DATA({ commit }) {
            Promise.all([
                axios.get("http://127.0.0.1:12010/stocks/today"),
                axios.get("http://127.0.0.1:12010/stocks/days")
            ])
                .then(res => {
                    this.state.isLoading = false
                    this.state.currentStockName = "삼성전자"

                    // 현재 주가
                    this.state.stockPriceData = res[0].data
                    commit("SET_STOCK_PRICE", this.state.stockPriceData[this.state.currentStockName])

                    // 테이블 가격 테이블
                    this.state.tableData = res[1].data
                    commit("SET_TABLE_DATA", this.state.tableData[this.state.currentStockName])

                })
        },
        CHANGE_DATA({ commit }, payload) {
            commit("SET_NAME", payload)
            commit("SET_STOCK_PRICE", this.state.stockPriceData[payload])
            commit("SET_TABLE_DATA", this.state.tableData[payload])
            commit("SET_TARGET_PRICE", localStorage.getItem[payload] || 0)
            console.log(localStorage.getItem)
        },
    }
})

