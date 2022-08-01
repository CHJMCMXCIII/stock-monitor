const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true
})


module.exports = {
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "@/assets/scss/_reset.scss";
                    @import "@/assets/scss/_font-face.scss";
                `
            }
        }
    }
}
