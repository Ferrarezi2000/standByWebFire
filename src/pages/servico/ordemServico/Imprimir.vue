<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 20px 20px; border-radius: 0 !important}
</style>

<template>
  <div class="box page">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>
    <div class="columns">
      <div class="column">
        <div>Stand By Soluções em Informática</div>
        <div>Av. Carlos Alberto Araújo, nº 14 - Vila Laroca</div>
        <div>CNPJ: 0212120202121202021210</div>
        <div>(32) 98898-1758 - Thiago Ferrarezi</div>
        <div>(32) 98898-1758 - Anderson Machado</div>
      </div>
      <div class="column is-4">
        <div>Comprovante de entrega do Cliente</div>
        <div>Data expedição: {{ordem.data}}</div>
        <div>Número O.S.: {{ordem.numero}}</div>
      </div>
    </div>
    <hr/>

    <div class="columns">
      <div class="column">
        <div>Cliente: {{ordem.cliente.nome}} {{ordem.cliente.sobrenome}}</div>
        <div>Endereço: {{ordem.cliente.endereco.logradouro}}, nº {{ordem.cliente.endereco.numero}} - {{ordem.cliente.endereco.bairro}}</div>
        <div>Contato: {{ordem.cliente.contato.fixo}}, {{ordem.cliente.contato.celular}}, {{ordem.cliente.contato.email}}</div>
      </div>
      <div class="column"></div>
    </div>
    {{ordem}}
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  created () {
    this.carregarOrdem(this.$route.params.id)
  },
  data () {
    return {
      loading: false,
      isFullPage: true,
      ordem: {
        numero: null,
        data: null,
        cliente: {nome: null, sobrenome: null},
        endereco: {logradouro: null, numero: null, bairro: null}
      }
    }
  },
  methods: {
    carregarOrdem (id) {
      this.loading = true
      firebase.database().ref('/ordemServicos').orderByKey().equalTo(id).on('value', res => {
        res.forEach(item => {
          this.ordem = item.val()
        })
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Ordem não encontrada!`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
