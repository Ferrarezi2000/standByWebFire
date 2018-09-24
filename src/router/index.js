import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Clientes from '../pages/cliente/Lista'
import NovoCliente from '../pages/cliente/NovoCliente'
import Produtos from '../pages/produto/Lista'
import NovoProduto from '../pages/produto/NovoProduto'
import ListaOrdemServico from '../pages/servico/ordemServico/Lista'
import NovaOrdem from '../pages/servico/ordemServico/NovaOrdem'
import VisualizarOrdem from '../pages/servico/ordemServico/Visualizar'
import ListaServicoRealizado from '../pages/servico/servicoRealizado/Lista'
import ListaServicoCancelado from '../pages/servico/servicoCancelado/Lista'
import Imprimir from '../pages/servico/ordemServico/Imprimir'
import Venda from '../pages/venda/Lista'
import NovaVenda from '../pages/venda/NovaVenda'
import VisualizarVenda from '../pages/venda/Visualizar'
import ImprimirVenda from '../pages/venda/Imprimir'
import VendaOutrosLista from '../pages/venda/outros/Lista'
import VendaOutrosNovo from '../pages/venda/outros/Novo'
import DespesaNovo from '../pages/despesa/Novo'
import Despesas from '../pages/despesa/Lista'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Login},
    {path: '/clientes', component: Clientes},
    {path: '/cliente/novo', component: NovoCliente},
    {path: '/cliente/:id', component: NovoCliente},
    {path: '/produtos', component: Produtos},
    {path: '/produto/novo', component: NovoProduto},
    {path: '/produto/:id', component: NovoProduto},
    {path: '/ordemServico', component: ListaOrdemServico},
    {path: '/ordemServico/novo', component: NovaOrdem},
    {path: '/ordemServico/:id', component: VisualizarOrdem},
    {path: '/servicoRealizado', component: ListaServicoRealizado},
    {path: '/servicoCancelado', component: ListaServicoCancelado},
    {path: '/imprimir/:id', component: Imprimir},
    {path: '/dashboard', component: Dashboard},
    {path: '/vendas', component: Venda},
    {path: '/venda/novo', component: NovaVenda},
    {path: '/venda/visualizar/:id', component: VisualizarVenda},
    {path: '/venda/imprimir/:id', component: ImprimirVenda},
    {path: '/venda/outros', component: VendaOutrosLista},
    {path: '/venda/outros/novo', component: VendaOutrosNovo},
    {path: '/despesa/novo', component: DespesaNovo},
    {path: '/despesas', component: Despesas}
  ]
})
