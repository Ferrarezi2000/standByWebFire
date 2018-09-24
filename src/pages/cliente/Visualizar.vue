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
            <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>

            <div class="titulo">Visualizar Cliente</div>

            <div style="margin: 0 20px 0 20px">
              <div class="dadosPessoais">Dados Pessoais</div>

              <div class="columns">
                <div class="column">
                  <b-field label="Nome">
                    <b-input v-model="cliente.nome" disabled/>
                  </b-field>

                  <b-field label="CPF">
                    <b-input v-model="cliente.cpf" v-mask="['###.###.###-##', '##.###.###/####-##']" disabled/>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Sobrenome">
                    <b-input v-model="cliente.sobrenome" disabled/>
                  </b-field>

                  <b-field label="Data Nascimento">
                    <date-picker v-model="cliente.dataNascimento" lang="pt-br" format="DD/MM/YYYY" disabled
                                 confirm style="width: 100%"/>
                  </b-field>
                </div>
              </div>
              <hr/>

              <div class="dadosPessoais">Contatos</div>
              <div class="columns">
                <div class="column">
                  <b-field label="Telefone Fixo">
                    <b-input v-model="cliente.contato.fixo" disabled v-mask="['(##) ####-####', '(##) #####-####']"/>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Telefone Celular">
                    <b-input v-model="cliente.contato.celular" disabled  v-mask="['(##) ####-####', '(##) #####-####']"/>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Email">
                    <b-input v-model="cliente.contato.email" disabled/>
                  </b-field>
                </div>
              </div>
              <hr/>

              <div class="dadosPessoais">Endereço</div>
              <div class="columns">
                <div class="column">
                  <b-field label="Logradouro">
                    <b-input v-model="cliente.endereco.logradouro" disabled/>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Bairro">
                    <b-input v-model="cliente.endereco.bairro" disabled/>
                  </b-field>
                </div>

                <div class="column is-2">
                  <b-field label="Número">
                    <b-input v-model="cliente.endereco.numero" disabled/>
                  </b-field>
                </div>
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
      this.carregarCliente(this.$route.params.id)
    }
  },
  data () {
    return {
      loading: false,
      isFullPage: true,
      cliente: {
        nome: null,
        sobrenome: null,
        cpf: null,
        dataNascimento: null,
        contato: {fixo: null, celular: null, email: null},
        endereco: {logradouro: null, numero: null, bairro: null}
      }
    }
  },
  methods: {
    carregarCliente (id) {
      this.loading = true
      firebase.database().ref('/clientes').orderByKey().equalTo(id).on('value', res => {
        res.forEach(item => {
          this.cliente = item.val()
          let dia = this.cliente.dataNascimento.slice(0, 2)
          let mes = this.cliente.dataNascimento.slice(3, 5)
          let ano = this.cliente.dataNascimento.slice(6, 10)
          let data = new Date(parseInt(ano), parseInt(mes - 1), parseInt(dia))
          this.cliente.dataNascimento = data
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
    ajustarNascimento () {
      if (this.cliente.dataNascimento.length === undefined) {
        let data = this.cliente.dataNascimento
        let dia = data.getDate()
        if (dia.toString().length === 1) {
          dia = '0' + dia
        }
        let mes = data.getMonth() + 1
        if (mes.toString().length === 1) {
          mes = '0' + mes
        }
        let ano = data.getFullYear()
        this.cliente.dataNascimento = dia + '/' + mes + '/' + ano + ''
      }
    }
  }
}
</script>
