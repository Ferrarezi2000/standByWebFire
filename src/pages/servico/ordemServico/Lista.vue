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
        <div class="titulo">Ordens de Serviços</div>
      </div>
      <div class="column" style="text-align: right">
        <b-tooltip label="Atualizar" type="is-black">
          <button class="button is-small" @click="novaOrdemServico">
            <b-icon icon="plus"/>
          </button>
        </b-tooltip>
      </div>
    </div>

    <b-table :data="ordensServicos" hoverable narrowed
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

        <b-table-column field="nome" label="Nome" sortable>
          {{ props.row.nome }}
        </b-table-column>

        <b-table-column field="descricao" label="Descrição">
          {{ props.row.descricao }}
        </b-table-column>

        <b-table-column field="quantidade" label="Quantidade">
          {{ props.row.quantidade }}
        </b-table-column>

        <b-table-column field="valor" label="Valor à vista">
          {{ props.row.valor | currency }}
        </b-table-column>

        <b-table-column field="valor" label="Valor à prazo">
          {{ props.row.valorDesconto | currency }}
        </b-table-column>

        <b-table-column label="" width="90">
          <b-tooltip label="Editar" type="is-black" class="botao">
            <button class="button is-small tamanhaBotao" @click="editar(props.row.key)">
              <b-icon icon="pencil-alt"/>
            </button>
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import { permissao } from '../../../config/permissao'
import firebase from 'firebase'

export default {
  mixins: [permissao],
  created () {
    this.checarLogado()
    this.listarOrdemServico()
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
      ordensServicos: []
    }
  },
  methods: {
    listarOrdemServico () {
      this.loading = true
      this.ordensServicos = []
      firebase.database().ref('/ordemServicos').on('value', res => {
        res.forEach(ordem => {
          let item = ordem.val()
          item.key = ordem.key
          this.ordensServicos.push(item)
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
    novaOrdemServico () {
      this.$router.push('/ordemServico/novo')
    }
  }
}
</script>
