<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px; margin-bottom: 20px}
  .dadosPessoais {font-weight: 500; margin: 20px 20px 20px 0; color: rgb(3, 155, 229); font-size: 17px}
</style>

<template>
  <div class="box page">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>

    <div class="columns">
      <div class="titulo column">Novo Lançamento</div>
      <div class="column" style="text-align: right; font-weight: bold">
        <div>{{ dataAtual | moment("ddd, DD MMM YYYY HH:mm") }}</div>
      </div>
    </div>

    <div style="margin: 0 20px 0 20px">
      <b-field label="Descrição">
        <b-input v-model="despesa.descricao"/>
      </b-field>

      <b-field label="Valor">
        <money v-model="despesa.valor" class="input"/>
      </b-field>

      <div style="width: 100%; text-align: right">
        <button class="button is-info is-fullwidth" @click="salvar" :disabled="habilitarSavar">Salvar</button>
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
    this.dataAtual = new Date()
    this.ajustardata()
  },
  data () {
    return {
      dataAtual: null,
      loading: false,
      isFullPage: true,
      despesa: {
        descricao: null,
        pago: 'nao',
        data: null
      }
    }
  },
  computed: {
    habilitarSavar () {
      let retorno = true
      if (this.despesa.descricao && this.despesa.valor) {
        retorno = false
      }
      return retorno
    }
  },
  methods: {
    ajustardata () {
      let dia = this.dataAtual.getDate()
      if (dia.toString().length === 1) {
        dia = '0' + dia
      }
      let mes = this.dataAtual.getMonth() + 1
      if (mes.toString().length === 1) {
        mes = '0' + mes
      }
      let ano = this.dataAtual.getFullYear()
      this.despesa.data = dia + '/' + mes + '/' + ano + ''
    },
    salvar () {
      this.loading = true
      firebase.database().ref('/despesas').push(this.despesa).then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Despesa cadastrada com sucesso!`,
          type: 'is-success'
        })
        this.$router.push('/despesas')
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Erro no sistema`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
