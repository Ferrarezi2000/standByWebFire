<style scoped>
  .box {background-color: white; padding: 20px}
  .titulo {font-weight: bold; font-size: 25px}
  .data {font-weight: bold; font-size: 15px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .negrito {font-weight: bold; font-style: italic}
  .tituloStand {font-size: 18px; color: white; font-weight: bold;}
  .menuTop {background-color: rgb(3, 155, 229); width: 100%; height: 49px; left: 0; top: 0;
    position: relative; box-shadow: 0 3px 3px rgba(0,0,0,0.3)}
</style>

<template>
  <div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false"/>
    <div class="columns" style="height: 100%; margin: 0 !important;">
      <div class="column is-2 is-paddingless">
        <menu-lateral/>
      </div>

      <div class="column is-paddingless">
        <div class="menuTop has-shadow" style="padding: 10px 0 0 20px; position: fixed; margin-left: 243px">
          <span class="tituloStand">Stand By - Soluções em Informática</span>
        </div>
        <div style="margin-top: 80px">
          <div class="box page">
            <div class="columns">
              <div class="column">
                <div class="titulo">Caixa</div>
              </div>

              <div class="column" style="text-align: right">
                <div class="data">{{ dataAtual | moment("ddd, DD MMM YYYY")}}</div>
              </div>
            </div>
            <hr/>

            <div class="columns">
              <div class="column">
                <div>
                  <div class="negrito">Despesas pagas até Hoje:</div>
                  <money :value="despesasPagasCalculo" class="input" disabled></money>
                </div>
              </div>

              <div class="column">
                <div class="negrito">Despesas que ainda não foram pagas:</div>
                <money :value="despesasNaoPagasCalculo" class="input" disabled></money>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <div>
                  <div class="negrito">Serviços realizados até Hoje:</div>
                  <money :value="servicosCalculo" class="input" disabled></money>
                </div>
              </div>

              <div class="column">
                <div class="negrito">Vendas realizadas até Hoje:</div>
                <money :value="vendasCalculo" class="input" disabled></money>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <div>
                  <div class="negrito">Disponível em CAIXA:</div>
                  <money :value="caixa" class="input" disabled></money>
                </div>
              </div>
            </div>
          </div>

          <div class="box page">
            <div class="columns">
              <div class="column">
                <div class="titulo">Clientes</div>
              </div>
            </div>
            <hr/>

            <div class="columns">
              <div class="column">
                <div>
                  <div class="negrito">Total de clientes cadastrados em nosso sistema:</div>
                  <b-input :value="totalClientes" disabled></b-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../components/Menu'
import MenuLateral from '../components/MenuLateral'
import { permissao } from '../config/permissao'
import firebase from 'firebase'

export default {
  components: {'meu-menu': Menu, 'menu-lateral': MenuLateral},
  mixins: [permissao],
  created () {
    this.listarDespesas()
    this.listarVendas()
    this.listarServicos()
    this.listarClientes()
    this.dataAtual = new Date()
  },
  data () {
    return {
      dataAtual: null,
      totalCaixa: 0,
      loading: false,
      listaVendas: [],
      listaClientes: [],
      listaServicos: [],
      despesasPagas: [],
      despesasNaoPagas: [],
      clientes: []
    }
  },
  computed: {
    vendasCalculo () {
      let total = 0
      this.listaVendas.forEach(item => {
        total += item.valor
      })
      return total
    },
    servicosCalculo () {
      let total = 0
      this.listaServicos.forEach(item => {
        total += item.valor
      })
      return total
    },
    despesasNaoPagasCalculo () {
      let total = 0
      this.despesasNaoPagas.forEach(item => {
        total += item.valor
      })
      return total
    },
    despesasPagasCalculo () {
      let total = 0
      this.despesasPagas.forEach(item => {
        total += item.valor
      })
      return total
    },
    caixa () {
      let total = (this.vendasCalculo + this.servicosCalculo) - this.despesasPagasCalculo
      return total
    },
    totalClientes () {
      return this.listaClientes.length
    }
  },
  methods: {
    listarDespesas () {
      this.loading = true
      firebase.database().ref('/despesas').on('value', res => {
        res.forEach(despesa => {
          let item = despesa.val()
          item.key = despesa.key
          if (despesa.val().pago === 'SIM') {
            this.despesasPagas.push(item)
          } else {
            this.despesasNaoPagas.push(item)
          }
        })
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Você não está logado em nosso sistema`,
          type: 'is-danger'
        })
      })
    },
    listarClientes () {
      this.loading = true
      firebase.database().ref('/clientes').on('value', res => {
        res.forEach(cliente => {
          let item = cliente.val()
          item.key = cliente.key
          this.listaClientes.push(item)
        })
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Você não está logado em nosso sistema`,
          type: 'is-danger'
        })
      })
    },
    listarServicos () {
      this.loading = true
      firebase.database().ref('/ordemServicos').on('value', res => {
        res.forEach(servico => {
          let item = servico.val()
          item.key = servico.key
          if (servico.val().finalizada) {
            this.listaServicos.push(item)
          }
        })
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Você não está logado em nosso sistema`,
          type: 'is-danger'
        })
      })
    },
    listarVendas () {
      this.loading = true
      firebase.database().ref('/vendas').on('value', res => {
        res.forEach(venda => {
          let item = venda.val()
          item.key = venda.key
          this.listaVendas.push(item)
        })
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Você não está logado em nosso sistema`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
