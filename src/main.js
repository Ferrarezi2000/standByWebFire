import Vue from 'vue'
import App from './App'
import router from './router'
import Firebase from 'firebase'
import store from './store'
import VueCurrencyFilter from 'vue-currency-filter'
import VueResource from 'vue-resource'
import VueMoment from 'vue-moment'
import moment from 'moment'
import Buefy from 'buefy'
import VeeValidate, { Validator } from 'vee-validate'

Vue.config.productionTip = false

Validator.localize('pt_BR', ptBR)
moment.locale('pt-BR')

Vue.use(Firebase)
Vue.use(Buefy, {defaultIconPack: 'fas'})
Vue.use(VueResource)
Vue.use(VueMoment, {moment})
Vue.use(VeeValidate, { locale: 'pt_BR', deleay: '5' })
Vue.use(VueCurrencyFilter,
  {
    symbol: 'R$',
    thousandsSeparator: '.',
    fractionCount: 2,
    fractionSeparator: ',',
    symbolPosition: 'front',
    symbolSpacing: true
  })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
