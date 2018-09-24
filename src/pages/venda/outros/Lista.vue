<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px}
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
            <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>

            <div class="columns">
              <div class="column">
                <div class="titulo">Outros</div>
              </div>

              <div class="column" style="text-align: right">
                <b-tooltip label="Adicionar" type="is-black">
                  <button class="button is-small" @click="rota('/venda/outros/novo')">
                    <b-icon icon="plus"/>
                  </button>
                </b-tooltip>
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

                <b-table-column field="descricao" label="Descrição" sortable>
                  {{ props.row.descricao }}
                </b-table-column>

                <b-table-column field="formaPagamento" label="Forma Pagamento" sortable>
                  {{ props.row.formaPagamento }}
                </b-table-column>

                <b-table-column field="parcelado" label="Parcelado">
                  <span v-if="props.row.parcelado === 'sim'">SIM</span>
                  <span v-else>NÃO</span>
                </b-table-column>

                <b-table-column field="valor" label="Valor">
                  {{ props.row.valor | currency}}
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { permissao } from '../../../config/permissao'
import firebase from 'firebase'
import { mapMutations } from 'vuex'
import Menu from '../../../components/Menu'
import MenuLateral from '../../../components/MenuLateral'

export default {
  mixins: [permissao],
  components: {'meu-menu': Menu, 'menu-lateral': MenuLateral},
  created () {
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
    ...mapMutations(['mudarExibicao']),
    listarVendas () {
      this.loading = true
      this.vendas = []
      firebase.database().ref('/vendas').on('value', res => {
        res.forEach(venda => {
          let item = venda.val()
          item.key = venda.key
          if (item.tipo === 'outros') {
            this.vendas.push(item)
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
