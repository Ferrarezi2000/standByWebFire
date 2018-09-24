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
        <div class="titulo">Despesas</div>
      </div>

      <div class="column" style="text-align: right">
        <div class="field">
          <b-switch v-model="filtro"
                    type="is-success">
            <b-tag v-if="filtro"
                   type="is-success">PAGAS
            </b-tag>
            <b-tag v-else
                   type="is-danger">NÃO PAGAS
            </b-tag>
          </b-switch>
        </div>
      </div>
    </div>

    <b-table :data="listaFiltrada" hoverable narrowed
             :paginated="isPaginated"
             :per-page="perPage"
             :current-page.sync="currentPage"
             :pagination-simple="isPaginationSimple"
             :default-sort-direction="defaultSortDirection"
             default-sort="data">
      <template slot-scope="props">
        <b-table-column label="#" width="50">
          <small>{{ props.index + 1 }}.</small>
        </b-table-column>

        <b-table-column field="data" label="Data do lançamento" sortable>
          {{ props.row.data }}
        </b-table-column>

        <b-table-column field="descricao" label="Descrição">
          {{ props.row.descricao }}
        </b-table-column>

        <b-table-column field="valor" label="Valor">
          {{ props.row.valor | currency}}
        </b-table-column>

        <b-table-column label="Pago">
          <b-tag v-if="props.row.pago === 'SIM'"
                 type="is-success">SIM
          </b-tag>
          <b-tag v-else
                 type="is-danger">NÃO
          </b-tag>
        </b-table-column>

        <b-table-column label="" width="90">
          <b-tooltip :label="props.row.pago === 'SIM' ? 'Pagamento já efetuado' : 'Pagar'" type="is-black" class="botao">
            <button class="button is-small tamanhaBotao is-success" @click="openModal(props.row)" :disabled="props.row.pago === 'SIM'">
              <b-icon icon="check"/>
            </button>
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>

    <!--Modal-->
    <b-modal :active.sync="modal" has-modal-card>
      <form action="">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Efetuar pagamento</p>
          </header>
          <section class="modal-card-body">
            <p style="margin-bottom: 20px">Valor da despesa...</p>

            <b-field label="Valor">
              <money v-model="despesaSelecionada.valor" class="input" required disabled/>
            </b-field>

          </section>
          <footer class="modal-card-foot">
            <button class="button" type="button" @click="closeModal">Fechar</button>
            <button class="button is-success" @click="pagar(despesaSelecionada.key)">Pagar</button>
          </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { permissao } from '../../config/permissao'
import firebase from 'firebase'
import { mapMutations } from 'vuex'

export default {
  mixins: [permissao],
  created () {
    this.checarLogado()
    this.listarDespesas()
  },
  data () {
    return {
      modal: false,
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 10,
      loading: false,
      isFullPage: true,
      filtro: true,
      despesaSelecionada: {key: null},
      despesas: []
    }
  },
  computed: {
    listaFiltrada () {
      let novaLista = []
      let listaNaoPagas = []
      this.despesas.forEach(item => {
        if (item.pago === 'SIM') {
          novaLista.push(item)
        } else {
          listaNaoPagas.push(item)
        }
      })
      if (this.filtro) {
        return novaLista
      } else {
        return listaNaoPagas
      }
    }
  },
  methods: {
    ...mapMutations(['mudarExibicao']),
    openModal (despesa) {
      this.despesaSelecionada = despesa
      this.modal = true
    },
    closeModal () {
      this.modal = false
    },
    listarDespesas () {
      this.loading = true
      this.despesas = []
      firebase.database().ref('/despesas').on('value', res => {
        res.forEach(venda => {
          let item = venda.val()
          item.key = venda.key
          this.despesas.push(item)
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
    pagar (id) {
      this.closeModal()
      this.loading = true
      this.despesaSelecionada.pago = 'SIM'
      firebase.database().ref('/despesas').child(id).set(this.despesaSelecionada).then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Despesa paga com sucesso!`,
          type: 'is-success'
        })
        this.$router.push('/dashboard')
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Erro no sistema...`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
