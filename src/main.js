// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './app'
import router from './router'
import VueMaterial from 'vue-material'
import Vuetify from 'vuetify'
import VueApexCharts from 'vue-apexcharts'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import '../node_modules/ag-grid-community/dist/styles/ag-grid.css'
import '../node_modules/ag-grid-community/dist/styles/ag-theme-material.css'
import 'vuetify/dist/vuetify.min.css'

Vue.use(VueMaterial)
Vue.use(Vuetify)
Vue.use(VueApexCharts)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
