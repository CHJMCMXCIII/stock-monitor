<template>
    <section>
        <p v-show="comment.length" class="comment">{{ comment }}</p>
        <div class="chart">
            <svg></svg>
        </div>
        <div class="target-price">
            <label v-if="isSaved === false" for="target">{{ targetPriceMessage }}</label>
            <label v-else-if="isSaved === true" for="target">목표 매수가가 저장됐어요.</label>
            <input id="target" v-model.number="targetPrice" type="number" step="500" min="0" :max="stockPrice" @click="isSaved = false">
            <button @click="setTargetPrice()" :disabled="targetPrice < 0">
                저장
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        d="M15.563 22.282l-3.563.718.72-3.562 2.843 2.844zm-2.137-3.552l2.845 2.845 7.729-7.73-2.845-2.845-7.729 7.73zm-3.062 2.27h-7.364v-7h12.327l6.673-6.688v-2.312l-4-4h-18v22h9.953l.411-2zm-5.364-18h12v7h-12v-7zm8.004 6h2.996v-5h-2.996v5z" />
                </svg>
            </button>
        </div>
    </section>
</template>

<script>
import { computed, watchEffect, ref } from 'vue'
import { useStore } from 'vuex'
import * as d3 from 'd3'
export default {
    name: 'TargetPriceAndChart',
    setup() {
        const store = useStore()
        let comment = ref('')

        const stockName = computed(() => store.state.currentStockName)
        const stockPrice = computed(() => store.state.stockPrice) 

        // state는 computed 로 접근해야함.
        // 값 변동시 set
        let targetPrice = computed({
            get: () => store.state.targetPrice,
            set: (val) => store.commit("SET_TARGET_PRICE", val)
        })

        let targetPriceMessage = ref("아래 버튼을 눌러 목표 매수가를 저장해주세요.")
        let isSaved = ref(false)

        const draw = (target, now) => {
            d3.select(".chart svg").selectAll("g").remove()
            const remain = ((now - Math.max(now - target, 0)) / now) * 100
            if (remain === 100) {
                comment.value = `때가 왔군요!`
            } else if (remain >= 90) {
                comment.value = `결정의 시기가 왔어요.`
            } else if (remain >= 50) {
                comment.value = `조금만 참으세요.`
                // comment.value = `조금만 참으세요. ${Math.round(remain)}% 네요.`
            } else {
                comment.value = `장기적으로 바라봐요..`
                //comment.value = `장기적으로 바라봐요. ${Math.round(remain)}% 입니다. `
            }

            const width = 180
            const height = 180
            const radius = Math.min(width, height) / 2
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
                .attr("font-size", "3.8rem")
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

            const format = d3.format(",.1%")

            function arcTween(pie) {
                return function (d) {
                    //console.log(pie)
                    const interpolate = d3.interpolate(pie[1].startAngle, pie[0].endAngle)
                    const randomNum = Math.random() * 100;
                    const interpolateText = d3.interpolate(randomNum, pie[0].value)
                    return function (t) {
                        d.endAngle = interpolate(t)
                        textDOM.text(format(interpolateText(t) / 100))
                        return arc(d)
                    }
                }
            }
            foreground.transition()
                .attrTween("d", arcTween(pieGenerator([remain, 100 - remain])))
        }
        
        
        const setLocalStorage = (name, value) => {
            return localStorage.setItem(name, value)
        }

        const setTargetPrice = () => {
            setLocalStorage(stockName.value, targetPrice.value)
            isSaved.value = true
            store.commit("SET_TARGET_PRICE", targetPrice.value)
            draw(targetPrice.value, stockPrice.value)
        }

        watchEffect(() => {
            if (parseInt(targetPrice.value) === 0) {
                targetPriceMessage.value = "목표 매수금액을 설정하세요."
            } else if (parseInt(targetPrice.value) < 0) {
                targetPriceMessage.value = "0 이상의 금액을 입력해주세요!"
            } else if (parseInt(targetPrice.value) !== 0) {
                targetPriceMessage.value = "아래 버튼을 눌러 목표 매수가를 저장해주세요."
            }

            draw(targetPrice.value, stockPrice.value)
        })

        return {
            stockPrice,
            targetPrice,
            comment,
            isSaved,
            targetPriceMessage,
            setTargetPrice,
        }
    }

}
</script>