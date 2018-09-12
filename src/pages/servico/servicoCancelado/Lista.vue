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
        <div class="titulo">Ordens de Serviços - Cancelados</div>
      </div>
    </div>

    <b-table :data="ordensServicos" hoverable narrowed
             :paginated="isPaginated"
             :per-page="perPage"
             :current-page.sync="currentPage"
             :pagination-simple="isPaginationSimple"
             :default-sort-direction="defaultSortDirection"
             default-sort="index">
      <template slot-scope="props">
        <b-table-column label="#" width="50">
          <small>{{ props.index + 1 }}.</small>
        </b-table-column>

        <b-table-column label="Número" width="80">
          {{ props.row.numero }}
        </b-table-column>

        <b-table-column label="Data" >
          {{ props.row.data }}
        </b-table-column>

        <b-table-column field="cliente.nome" label="Nome" sortable v-if="props.row.cliente">
          {{ props.row.cliente.nome }} {{ props.row.cliente.sobrenome }}
        </b-table-column>

        <b-table-column field="tipo" label="Tipo">
          {{ props.row.tipo }}
        </b-table-column>

        <b-table-column field="marca" label="Marca">
          {{ props.row.marca }}
        </b-table-column>

        <b-table-column field="Modelo" label="Modelo">
          {{ props.row.modelo }}
        </b-table-column>

        <b-table-column field="numeroSerie" label="Nº Série">
          {{ props.row.numeroSerie }}
        </b-table-column>

        <b-table-column label="" width="80">
          <b-tooltip label="Visualizar" type="is-black" class="botao">
            <button class="button is-small tamanhaBotao" @click="rota('/ordemServico/' + props.row.key)">
              <b-icon icon="eye"/>
            </button>
          </b-tooltip>

          <b-tooltip label="Imprimir" type="is-black" class="botao">
            <button class="button is-small tamanhaBotao" @click="rota(props.row.key)">
              <b-icon icon="print"/>
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
      ordemSelecionada: null,
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
          if (item.cancelada) {
            this.ordensServicos.push(item)
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
    rota (caminho) {
      this.$router.push(caminho)
    }
  }
}
</script>
