<template>
    <article>
        <nav>
            <ul>
                <li>삼성전자</li>
                <li>기아</li>
                <li>포스코케미칼</li>
                <li>CJ CGV</li>
                <li>SK이노베이션</li>
            </ul>
        </nav>

    </article>
</template>
<script>
    import * as d3 from 'd3'
    import { onMounted, ref } from 'vue'
    import axios from 'axios'

    export default {
        name: 'stock-monitor',
        compnents: {},
        setup() {
            let name = ref('삼성전자')
            let message = ref("")
        }
    }
</script>
<style lang="scss">
ul {
    li {
        color: red;
    }
}
</style>