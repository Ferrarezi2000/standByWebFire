<style scoped>
  .box {background-color: white; padding: 20px}
  .titulo {font-weight: bold; font-size: 25px}
  .data {font-weight: bold; font-size: 15px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .negrito {font-weight: bold; font-style: italic}
</style>

<template>
  <div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false"/>
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
            <money :value="totalDespesasPagas" class="input" disabled></money>
          </div>
        </div>

        <div class="column">
          <div class="negrito">Despesas que ainda não foram pagas:</div>
          <money :value="totalDespesasNaoPagas" class="input" disabled></money>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <div>
            <div class="negrito">Serviços realizados até Hoje:</div>
            <money :value="totalServicosRealizados" class="input" disabled></money>
          </div>
        </div>

        <div class="column">
          <div class="negrito">Vendas realizadas até Hoje:</div>
          <money :value="totalVendasRealizadas" class="input" disabled></money>
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
</template>

<script>
import { permissao } from '../config/permissao'
import firebase from 'firebase'

export default {
  mixins: [permissao],
  created () {
    this.checarLogado()
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
      totalVendasRealizadas: 0,
      totalServicosRealizados: 0,
      totalDespesasPagas: 0,
      totalDespesasNaoPagas: 0,
      listaVendas: [],
      listaClientes: [],
      listaServicos: [],
      despesasPagas: [],
      despesasNaoPagas: [],
      clientes: []
    }
  },
  computed: {
    caixa () {
      let total = (this.totalVendasRealizadas + this.totalServicosRealizados) - this.totalDespesasPagas
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
        this.despesasPagasCalculo()
        this.despesasNaoPagasCalculo()
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
        this.despesasPagasCalculo()
        this.despesasNaoPagasCalculo()
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
        this.servicosCalculo()
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
        this.vendasCalculo()
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
    vendasCalculo () {
      this.listaVendas.forEach(item => {
        this.totalVendasRealizadas += item.valor
      })
    },
    servicosCalculo () {
      this.listaServicos.forEach(item => {
        this.totalServicosRealizados += item.valor
      })
    },
    despesasPagasCalculo () {
      this.despesasPagas.forEach(item => {
        this.totalDespesasPagas += item.valor
      })
    },
    despesasNaoPagasCalculo () {
      this.despesasNaoPagas.forEach(item => {
        this.totalDespesasNaoPagas += item.valor
      })
    }
  }
}
</script>
