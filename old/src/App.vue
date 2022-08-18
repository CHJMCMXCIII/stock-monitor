<template>
    <section>
        <h1 class="app-title">주식 목표가격 모니터</h1>
        <div class="wrapper">

            <nav>
                <ul @click="scrollNav()">
                    <li @click="setData('삼성전자')" :class="{ 'active': name === '삼성전자' }">삼성전자</li>
                    <li @click="setData('기아')" :class="{ 'active': name === '기아' }">기아</li>
                    <li @click="setData('포스코케미칼')" :class="{ 'active': name === '포스코케미칼' }">포스코케미칼</li>
                    <li @click="setData('CJ CGV')" :class="{ 'active': name === 'CJ CGV' }">CJ CGV</li>
                    <li @click="setData('SK이노베이션')" :class="{ 'active': name === 'SK이노베이션' }">SK이노베이션</li>
                </ul>
            </nav>

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

            <h2 class="stock-name">{{ name }}</h2>
            <h3 class="stock-price-today">{{ commaAddedTodayPrice }}<span>원</span></h3>

            <p v-show="comment.length" class="comment">{{ comment }}</p>
            <div class="chart">
                <svg></svg>
            </div>
            <div class="target-price">
                <label v-if="isSaved === false" for="target">{{ targetPriceMessage }}</label>
                <label v-else-if="isSaved === true" for="target">목표 매수가가 저장됐어요.</label>
                <input id="target" v-model.number="targetPrice" type="number" step="500" min="0"
                    @click="isSaved = false">
                <button @click="setTargetPrice()">
                    저장
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M15.563 22.282l-3.563.718.72-3.562 2.843 2.844zm-2.137-3.552l2.845 2.845 7.729-7.73-2.845-2.845-7.729 7.73zm-3.062 2.27h-7.364v-7h12.327l6.673-6.688v-2.312l-4-4h-18v22h9.953l.411-2zm-5.364-18h12v7h-12v-7zm8.004 6h2.996v-5h-2.996v5z" />
                    </svg>
                </button>
            </div>
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
                        <tr v-for="(stock, index) in displayingStockPriceList" :key="index">
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
        </div>
    </section>
</template>
<script>
import * as d3 from 'd3'
import { onMounted, ref } from 'vue'
import axios from 'axios'

export default {
    name: 'stock-monitor',
    compnents: {},
    //setup 함수는, Vue 3 에서 새로 나온 Composition API 이다.
    // 기존에 data, methods 등으로 흩어져있던것을, 하나의 장소로 모으게 해준다.
    // template 에서 사용하고자하는 변수, 함수등을 정의한뒤,
    // 객체에 하나씩 골라담아, return 해주면
    // template 에서 해당 변수와 함수를 접근할수있다.
    setup() {
        let name = ref("삼성전자")
        let comment = ref("")
        let isLoading = ref(true)
        let targetPrice = ref(0)
        let targetPriceMessage = ref("아래 버튼을 눌러 목표 매수가를 저장해주세요.")
        let isSaved = ref(false)
        let displayingStockPrice = ref({})
        let displayingStockPriceList = ref({})
        let stockPriceToday = {}
        let stockPriceList = {}

        const draw = (target, now) => {
            d3.select(".chart svg").selectAll("g").remove()
            const remain = ((now - Math.max(now - target, 0)) / now) * 100
            if (remain === 100) {
                comment.value = `살 때가 왔군요!`
            } else if (remain >= 50) {
                comment.value = `조금만 참으세요.`
                // comment.value = `조금만 참으세요. ${Math.round(remain)}% 네요.`
            } else {
                comment.value = `장기적으로 바라봐요.`
                //comment.value = `장기적으로 바라봐요. ${Math.round(remain)}% 입니다. `
            }

            const width = 180
            const height = 180
            const radius = Math.min(width, height) / 2.3
            const group = d3.select(".chart svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`)

            const pieGenerator = d3.pie().sort(null)

            const arc = d3.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius)

            const textDOM = group.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", ".5em")
                .attr("font-size", "4.8rem")
                .attr("font-weight", "bold")
                .style("fill", "#7f00ff")

            group.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "-2em")
                .attr("font-size", "1.4rem")
                .text("목표까지")
                .style("fill", "#333")
                .style("font-weight", "500")

            group.append("path")
                .data(pieGenerator([1]))
                .attr("class", "backColor")
                .attr("d", arc)

            const foreground = group.append("path")
                .data(pieGenerator([0, 100]))
                .attr("class", (d, i) => `frontColor${i}`)
                .attr("d", arc)

            const format = d3.format(".0%")

            function arcTween(pie) {
                return function (d) {
                    const interpolate = d3.interpolate(pie[0].startAngle, pie[0].endAngle)
                    const interpolateText = d3.interpolate(0, pie[0].value)
                    return function (t) {
                        d.endAngle = interpolate(t)
                        textDOM.text(format(interpolateText(t) / 100))
                        return arc(d)
                    }
                }
            }
            foreground.transition()
                .duration(1500)
                .attrTween("d", arcTween(pieGenerator([remain, 100 - remain])))
                .delay(300)
        }

        const setTargetPrice = () => {
            setLocalStorage(name.value, targetPrice.value)
            isSaved.value = true
            draw(targetPrice.value, displayingStockPrice.value)
        }

        const getLocalStorage = name => {
            return localStorage.getItem(name) || 0
        }

        const setLocalStorage = (name, value, saved) => {
            localStorage.setItem(name, value, saved)
        }

        let setData = (data) => {
            name.value = data
            displayingStockPrice.value = stockPriceToday[data]
            displayingStockPriceList.value = stockPriceList[data]
            targetPrice.value = getLocalStorage(data)
            draw(targetPrice.value, displayingStockPrice.value)
        }

        const scrollNav = () => {
            let ul = document.querySelector("nav > ul")
            let activeLi = ul.querySelector(".active")
            activeLi.scrollIntoView({ inline: 'center', block: 'end', behavior: 'smooth' })
        }

        onMounted(() => {
            Promise.all([
                axios.get("http://127.0.0.1:12010/stocks/today"),
                axios.get("http://127.0.0.1:12010/stocks/days")
            ])
                .then(res => {
                    isLoading.value = false
                    stockPriceToday = res[0].data
                    stockPriceList = res[1].data
                    setData("삼성전자")
                })
        })

        setInterval(() => {
            axios.get('http://127.0.0.1:12010/stocks/today')
                .then(res => {
                    stockPriceToday = res.data
                    displayingStockPrice.value = stockPriceToday[name.value]
                    draw(targetPrice.value, displayingStockPrice.value)
                })
        }, 1000 * 600)

        return {
            isLoading,
            isSaved,
            targetPrice,
            targetPriceMessage,
            stockPriceToday,
            stockPriceList,
            displayingStockPrice,
            displayingStockPriceList,
            name,
            comment,
            setTargetPrice,
            setData,
            scrollNav
        }
    },
    watch: {
        targetPrice: function (targetPrice) {
            if (parseInt(targetPrice) === 0) {
                this.targetPriceMessage = "목표 매수금액을 설정하세요."
            } else if (parseInt(targetPrice) < 0) {
                this.targetPriceMessage = "0 이상의 금액을 입력해주세요!"
            } else if (parseInt(targetPrice) !== 0) {
                this.targetPriceMessage = "아래 버튼을 눌러 목표 매수가를 저장해주세요."
            }
        }
    },
    computed: {
        commaAddedTodayPrice() {
            return this.displayingStockPrice.toLocaleString('ko-KR');
        }
    }
}
</script>

<style lang="scss">
@import "@/assets/scss/style.scss";
</style>