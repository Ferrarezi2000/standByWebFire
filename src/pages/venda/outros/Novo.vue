<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px; margin-bottom: 20px}
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
              <div class="titulo column">Novo Lançamento</div>
              <div class="column" style="text-align: right; font-weight: bold">
                <div>{{ dataAtual | moment("ddd, DD MMM YYYY HH:mm") }}</div>
              </div>
            </div>

            <div style="margin: 0 20px 0 20px">
              <b-field label="Descrição">
                <b-input v-model="venda.descricao"/>
              </b-field>

              <b-field label="Valor">
                <money v-model="venda.valor" class="input"/>
              </b-field>

              <div class="columns">
                <div class="column">
                  <b-field label="Parcelado?">
                    <div class="block">
                      <b-radio v-model="venda.parcelado"
                               native-value="sim">
                        SIM
                      </b-radio>
                      <b-radio v-model="venda.parcelado"
                               native-value="nao">
                        NÃO
                      </b-radio>
                    </div>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Cartão?">
                    <div class="block">
                      <b-radio v-model="venda.formaPagamento"
                               native-value="Cartão">
                        SIM
                      </b-radio>
                      <b-radio v-model="venda.formaPagamento"
                               native-value="Dinheiro">
                        NÃO
                      </b-radio>
                    </div>
                  </b-field>
                </div>
              </div>
              <div style="width: 100%; text-align: right">
                <button class="button is-info is-fullwidth" @click="salvar" :disabled="habilitarSavar">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { permissao } from '../../../config/permissao'
import firebase from 'firebase'
import { mask } from 'vue-the-mask'
import Menu from '../../../components/Menu'
import MenuLateral from '../../../components/MenuLateral'

export default {
  mixins: [permissao],
  components: {'meu-menu': Menu, 'menu-lateral': MenuLateral},
  directives: { mask },
  created () {
    this.dataAtual = new Date()
    this.ajustardata()
  },
  data () {
    return {
      dataAtual: null,
      loading: false,
      isFullPage: true,
      venda: {
        tipo: 'outros',
        formaPagamento: '',
        parcelado: '',
        descricao: null,
        data: null
      }
    }
  },
  computed: {
    habilitarSavar () {
      let retorno = true
      if (this.venda.descricao && this.venda.valor && this.venda.parcelado && this.venda.formaPagamento) {
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
      this.venda.data = dia + '/' + mes + '/' + ano + ''
    },
    salvar () {
      this.loading = true
      firebase.database().ref('/vendas').push(this.venda).then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Adicionado com sucesso!`,
          type: 'is-success'
        })
        this.$router.push('/venda/outros')
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
