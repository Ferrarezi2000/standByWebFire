<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px}
  .dadosPessoais {font-weight: 500; margin: 20px 20px 20px 0; color: rgb(3, 155, 229); font-size: 17px}
</style>

<template>
  <div class="box page">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>

    <div class="titulo" v-if="$route.params.id">Editar Cliente</div>
    <div class="titulo" v-else>Novo Cliente</div>

    <div style="margin: 0 20px 0 20px">
      <div class="dadosPessoais">Dados Pessoais</div>

      <div class="columns">
        <div class="column">
          <b-field label="Nome">
            <b-input v-model="cliente.nome"/>
          </b-field>

          <b-field label="CPF">
            <b-input v-model="cliente.cpf" v-mask="['###.###.###-##', '##.###.###/####-##']"/>
          </b-field>
        </div>

        <div class="column">
          <b-field label="Sobrenome">
            <b-input v-model="cliente.sobrenome"/>
          </b-field>

          <b-field label="Data Nascimento">
            <date-picker v-model="cliente.dataNascimento" lang="pt-br" format="DD/MM/YYYY"
                         confirm style="width: 100%"/>
          </b-field>
        </div>
      </div>
      <hr/>

      <div class="dadosPessoais">Contatos</div>
      <div class="columns">
        <div class="column">
          <b-field label="Telefone Fixo">
            <b-input v-model="cliente.contato.fixo"  v-mask="['(##) ####-####', '(##) #####-####']"/>
          </b-field>
        </div>

        <div class="column">
          <b-field label="Telefone Celular">
            <b-input v-model="cliente.contato.celular"  v-mask="['(##) ####-####', '(##) #####-####']"/>
          </b-field>
        </div>
      </div>
      <hr/>

      <div class="dadosPessoais">Endereço</div>
      <div class="columns">
        <div class="column">
          <b-field label="Logradouro">
            <b-input v-model="cliente.endereco.logradouor"/>
          </b-field>
        </div>

        <div class="column">
          <b-field label="Bairro">
            <b-input v-model="cliente.endereco.bairro"/>
          </b-field>
        </div>

        <div class="column is-2">
          <b-field label="Número">
            <b-input v-model="cliente.endereco.numero"/>
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
import { permissao } from '../../../config/permissao'
import firebase from 'firebase'
import { mask } from 'vue-the-mask'

export default {
  mixins: [permissao],
  directives: { mask },
  created () {
    this.checarLogado()
  },
  data () {
    return {
      loading: false,
      ordem: {
        nome: null,
        sobrenome: null,
        cpf: null,
        dataNascimento: null,
        contato: {fixo: null, celular: null},
        endereco: {logradouor: null, numero: null, bairro: null}
      }
    }
  },
  methods: {
    salvar () {
      this.loading = true
      this.ajustarNascimento()
      firebase.database().ref('clientes').push(this.cliente).then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Cliente cadastrado com sucesso!`,
          type: 'is-success'
        })
        this.$router.push('/clientes')
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Não foi possivel cadastrar cliente`,
          type: 'is-danger'
        })
      })
    },
    listarClientes () {
      this.loading = true
      this.ordensServicos = []
      firebase.database().ref('/ordemServicos').on('value', res => {
        res.forEach(ordem => {
          let item = ordem.val()
          item.key = ordem.key
          this.ordensServicos.push(item)
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
  }
}
</script>
