import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Clientes from '../pages/cliente/Lista'
import NovoCliente from '../pages/cliente/NovoCliente'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Login},
    {path: '/clientes', component: Clientes},
    {path: '/cliente/novo', component: NovoCliente},
    {path: '/dashboard', component: Dashboard}
  ]
})
