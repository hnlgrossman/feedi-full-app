const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    proxy: {
      // Proxy all requests starting with /api to the target below
      '/api': {
        target: 'http://localhost:3000',
        // changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  }
})
