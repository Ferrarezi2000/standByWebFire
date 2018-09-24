<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px}
  .dadosPessoais {font-weight: 500; margin: 20px 20px 20px 0; color: rgb(3, 155, 229); font-size: 17px}
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
                <div class="titulo" v-if="$route.params.id">Editar Produto</div>
                <div class="titulo" v-else>Novo Produto</div>
              </div>

              <div class="column" v-if="$route.params.id" style="text-align: right">
                <b-tooltip label="Apagar" type="is-black">
                  <button class="button is-small is-danger" @click="deletar">
                    <b-icon icon="trash" />
                  </button>
                </b-tooltip>
              </div>
            </div>

            <div style="margin: 0 20px 0 20px">
              <div class="dadosPessoais">Dados</div>
              <div class="columns">
                <div class="column">
                  <b-field label="Nome">
                    <b-input v-model="produto.nome"/>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Marca">
                    <b-input v-model="produto.marca"/>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Serial">
                    <b-input v-model="produto.serial"/>
                  </b-field>
                </div>

                <div class="column is-1">
                  <b-field label="Quantidade">
                    <b-input v-model="produto.quantidade"/>
                  </b-field>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <b-field label="Valor À Vista">
                    <money :value="calcularDesconto" class="input" disabled/>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Valor À Prazo">
                    <money v-model="produto.valorDesconto" class="input"/>
                  </b-field>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <b-field label="Descição">
                    <b-input v-model="produto.descricao" type="textarea"/>
                  </b-field>
                </div>
              </div>
              <hr/>

              <div style="width: 100%; text-align: right">
                <button class="button is-info is-fullwidth" @click="addEditar" :disabled="habilitarSavar">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { permissao } from '../../config/permissao'
import firebase from 'firebase'
import { mask } from 'vue-the-mask'
import Menu from '../../components/Menu'
import MenuLateral from '../../components/MenuLateral'

export default {
  mixins: [permissao],
  directives: { mask },
  components: {'meu-menu': Menu, 'menu-lateral': MenuLateral},
  created () {
    if (this.$route.params.id) {
      this.carregarProduto(this.$route.params.id)
    }
  },
  data () {
    return {
      loading: false,
      isFullPage: true,
      produto: {
        serial: null,
        nome: null,
        marca: null,
        descricao: null,
        quantidade: null,
        valor: '',
        valorDesconto: ''
      }
    }
  },
  computed: {
    calcularDesconto () {
      if (this.produto.valorDesconto) {
        this.calcularDescontoFinal()
      }
      return this.produto.valor
    },
    habilitarSavar () {
      let retorno = true
      if (this.produto.nome && this.produto.descricao && this.produto.quantidade && this.produto.valor && this.produto.marca && this.produto.serial) {
        retorno = false
      }
      return retorno
    }
  },
  methods: {
    deletar () {
      firebase.database().ref('/produtos').child(this.$route.params.id).remove().then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Produto deletado com sucesso!`,
          type: 'is-success'
        }, res => {
          this.loading = false
          this.$toast.open({
            duration: 3000,
            message: `Erro no sistema`,
            type: 'is-danger'
          })
        })
        this.$router.push('/produtos')
      })
    },
    calcularDescontoFinal () {
      if (this.produto.valorDesconto) {
        let desconto = this.produto.valorDesconto * (10 / 100)
        this.produto.valor = this.produto.valorDesconto - desconto
      }
    },
    carregarProduto (id) {
      this.loading = true
      firebase.database().ref('/produtos').orderByKey().equalTo(id).on('value', res => {
        res.forEach(item => {
          this.produto = item.val()
        })
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Cliente não encontrado!`,
          type: 'is-danger'
        })
      })
    },
    addEditar () {
      if (this.$route.params.id) {
        this.editar()
      } else {
        this.salvar()
      }
    },
    editar () {
      this.loading = true
      firebase.database().ref('/produtos').child(this.$route.params.id).set(this.produto).then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Produto cadastrado com sucesso!`,
          type: 'is-success'
        })
        this.$router.push('/produtos')
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Não foi possivel cadastrar produto`,
          type: 'is-danger'
        })
      })
    },
    salvar () {
      this.loading = true
      firebase.database().ref('/produtos').push(this.produto).then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Produto cadastrado com sucesso!`,
          type: 'is-success'
        })
        this.$router.push('/produtos')
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Não foi possivel cadastrar produto`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
