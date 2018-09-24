<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px}
  .tamanhaBotao {font-size: 10px}
  td:last-child {text-align: right}
  .botao {visibility: hidden}
  tr:hover .botao {visibility: visible}
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
                <div class="titulo">Ordens de Serviços - Cancelados</div>
              </div>
            </div>

            <div class="column" style="text-align: right">
              <b-field>
                <b-input placeholder="Pesquisar pelo número de série..."
                         type="search"
                         icon-pack="fas"
                         v-model="filtro"
                         icon="search">
                </b-input>
              </b-field>
            </div>

            <b-table :data="listaFiltrada" hoverable narrowed
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

                  <!--<b-tooltip label="Imprimir" type="is-black" class="botao">-->
                  <!--<button class="button is-small tamanhaBotao" @click="imprimir(props.row.key)">-->
                  <!--<b-icon icon="print"/>-->
                  <!--</button>-->
                  <!--</b-tooltip>-->
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
    this.listarOrdemServico()
  },
  data () {
    return {
      filtro: '',
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
  computed: {
    listaFiltrada () {
      return this.ordensServicos.filter(i => {
        return i.numeroSerie.toUpperCase().indexOf(this.filtro.toUpperCase()) > -1
      })
    }
  },
  methods: {
    ...mapMutations(['mudarExibicao']),
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
    imprimir (id) {
      this.mudarExibicao('imprimir')
      this.$router.push('/imprimir/' + id)
    },
    rota (caminho) {
      this.$router.push(caminho)
    }
  }
}
</script>
