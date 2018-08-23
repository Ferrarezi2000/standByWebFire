import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import store from './store'
import VueCurrencyFilter from 'vue-currency-filter'
import VueResource from 'vue-resource'
import VueMoment from 'vue-moment'
import moment from 'moment'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import VeeValidate, { Validator } from 'vee-validate'
import ptBR from 'vee-validate/dist/locale/pt_BR'
import DatePicker from 'vue2-datepicker'

Vue.config.productionTip = false

/* eslint-disable */
const config = {
  apiKey: "AIzaSyABgVL1DtmSIxIYKvtlH9-bPSvkbrJfvlI",
  authDomain: "stand-by-83130.firebaseapp.com",
  databaseURL: "https://stand-by-83130.firebaseio.com",
  projectId: "stand-by-83130",
  storageBucket: "stand-by-83130.appspot.com",
  messagingSenderId: "146976060182"
};
firebase.initializeApp(config)

Validator.localize('pt_BR', ptBR)
moment.locale('pt-BR')

Vue.use(DatePicker)
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
