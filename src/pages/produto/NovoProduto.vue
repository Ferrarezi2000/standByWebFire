<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px}
  .dadosPessoais {font-weight: 500; margin: 20px 20px 20px 0; color: rgb(3, 155, 229); font-size: 17px}
</style>

<template>
  <div class="box page">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>
    <div class="titulo" v-if="$route.params.id">Editar Produto</div>
    <div class="titulo" v-else>Novo Produto</div>

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
</template>

<script>
import { permissao } from '../../config/permissao'
import firebase from 'firebase'
import { mask } from 'vue-the-mask'

export default {
  mixins: [permissao],
  directives: { mask },
  created () {
    this.checarLogado()
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
