import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Clientes from '../pages/cliente/Lista'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Login},
    {path: '/clientes', component: Clientes},
    {path: '/dashboard', component: Dashboard}
  ]
})
