<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px}
  .tamanhaBotao {font-size: 10px}
  td:last-child {text-align: right}
  .botao {visibility: hidden}
  tr:hover .botao {visibility: visible}
</style>

<template>
  <div class="box page">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>

    <div class="columns">
      <div class="column">
        <div class="titulo">Vendas</div>
      </div>
    </div>

    <b-table :data="vendas" hoverable narrowed
             :paginated="isPaginated"
             :per-page="perPage"
             :current-page.sync="currentPage"
             :pagination-simple="isPaginationSimple"
             :default-sort-direction="defaultSortDirection"
             default-sort="nome">
      <template slot-scope="props">
        <b-table-column label="#" width="50">
          <small>{{ props.index + 1 }}.</small>
        </b-table-column>

        <b-table-column field="data" label="Data Venda" sortable>
          {{ props.row.data }}
        </b-table-column>

        <b-table-column field="cliente.nome" label="Cliente" sortable>
          {{ props.row.cliente.nome }} {{ props.row.cliente.sobrenome }}
        </b-table-column>

        <b-table-column field="produto.nome" label="Produto" sortable>
          {{ props.row.produto.nome }}
        </b-table-column>

        <b-table-column field="valor" label="Valor">
          {{ props.row.valor | currency}}
        </b-table-column>

        <b-table-column field="formaPagamento" label="Forma de Pagamento">
          {{ props.row.formaPagamento }}
        </b-table-column>

        <b-table-column label="" width="90">
          <b-tooltip label="Visualizar" type="is-black" class="botao">
            <button class="button is-small tamanhaBotao" @click="visualizar(props.row.key)">
              <b-icon icon="eye"/>
            </button>
          </b-tooltip>
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
    this.listarVendas()
  },
  data () {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 10,
      loading: false,
      isFullPage: true,
      vendas: []
    }
  },
  methods: {
    listarVendas () {
      this.loading = true
      this.vendas = []
      firebase.database().ref('/vendas').on('value', res => {
        res.forEach(venda => {
          let item = venda.val()
          item.key = venda.key
          this.vendas.push(item)
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
    visualizar () {}
  }
}
</script>
