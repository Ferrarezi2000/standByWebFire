<style scoped>
  .box {background-color: white; padding: 20px}
</style>

<template>
  <div class="box">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>

    <div class="columns">
      <div class="column">
        <div class="title">Clientes</div>
      </div>
      <div class="column" style="text-align: right">
        <button class="button is-primary">
          <b-icon icon="plus"/>
        </button>
      </div>
    </div>
    <hr/>

    <b-table :data="clientes">
    <template slot-scope="props">
      <b-table-column field="nome" label="Nome" width="40" sortable numeric>
        {{ props.row.nome }}
      </b-table-column>

      <b-table-column field="telefone" label="Telefone" sortable>
        {{ props.row.telefone }}
      </b-table-column>
    </template>
  </b-table>
  </div>
</template>

<script>
import { permissao } from '../../config/permissao'
import firebase from 'firebase'

export default {
  mixins: [permissao],
  created () {
    this.checarLogado()
    this.carregarCliente()
  },
  data () {
    return {
      loading: false,
      isFullPage: true,
      clientes: []
    }
  },
  methods: {
    carregarCliente () {
      this.loading = true
      firebase.database().ref('/clientes').on('value', res => {
        res.forEach(cliente => {
          let item = cliente.val()
          item.key = cliente.key
          this.clientes.push(item)
        })
        this.loading = false
      })
    }
  }
}
</script>

