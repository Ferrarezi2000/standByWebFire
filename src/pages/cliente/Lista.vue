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
            <div class="columns">
              <div class="column">
                <div class="titulo">Clientes</div>
              </div>
              <div class="column" style="text-align: right">
                <b-field>
                  <b-input placeholder="Pesquisar..."
                           type="search"
                           icon-pack="fas"
                           v-model="filtro"
                           icon="search">
                  </b-input>
                </b-field>
              </div>
            </div>

            <b-table :data="listaFiltrada" hoverable narrowed
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
                  {{ props.row.nome }} {{ props.row.sobrenome }}
                </b-table-column>

                <b-table-column field="cpf" label="CPF/CNPJ">
                  {{ props.row.cpf }}
                </b-table-column>

                <b-table-column field="dataNascimento" label="Data Nascimento">
                  {{ props.row.dataNascimento }}
                </b-table-column>

                <b-table-column field="contato.fixo" label="Fixo">
                  {{ props.row.contato.fixo }}
                </b-table-column>

                <b-table-column field="contato.celular" label="Celular">
                  {{ props.row.contato.celular }}
                </b-table-column>

                <b-table-column field="contato.email" label="Email">
                  {{ props.row.contato.email }}
                </b-table-column>

                <b-table-column label="" width="90">
                  <b-tooltip label="Editar" type="is-black" class="botao">
                    <button class="button is-small tamanhaBotao" @click="editar(props.row.key)">
                      <b-icon icon="pencil-alt"/>
                    </button>
                  </b-tooltip>

                  <b-tooltip label="Detalhe" type="is-black" class="botao">
                    <button class="button tamanhaBotao" @click="visualizar(props.row.key)">
                      <b-icon icon="arrow-right"/>
                    </button>
                  </b-tooltip>
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
import { permissao } from '../../config/permissao'
import firebase from 'firebase'
import Menu from '../../components/Menu'
import MenuLateral from '../../components/MenuLateral'

export default {
  mixins: [permissao],
  components: {'meu-menu': Menu, 'menu-lateral': MenuLateral},
  created () {
    this.carregarCliente()
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
      filtro: '',
      clientes: []
    }
  },
  computed: {
    listaFiltrada () {
      return this.clientes.filter(i => {
        return i.nome.toUpperCase().indexOf(this.filtro.toUpperCase()) > -1 ||
          i.sobrenome.toUpperCase().indexOf(this.filtro.toUpperCase()) > -1
      })
    }
  },
  methods: {
    visualizar (id) {
      this.$router.push('cliente/visualizar/' + id)
    },
    carregarCliente () {
      this.loading = true
      this.clientes = []
      firebase.database().ref('/clientes').on('value', res => {
        res.forEach(cliente => {
          let item = cliente.val()
          item.key = cliente.key
          this.clientes.push(item)
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
    editar (id) {
      this.$router.push('/cliente/' + id)
    }
  }
}
</script>
