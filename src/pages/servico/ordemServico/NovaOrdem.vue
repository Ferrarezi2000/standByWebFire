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
      <div class="titulo column">Nova Ordem de Serviço</div>
      <div class="column" style="text-align: right; font-weight: bold">
        <div>{{ ordem.numero }}</div>
        <div>{{ dataAtual | moment("ddd, DD MMM YYYY HH:mm") }}</div>
      </div>
    </div>

    <div style="margin: 0 20px 0 20px">
      <b-field label="Cliente">
        <b-select placeholder="Selecione o cliente" expanded v-model="ordem.cliente">
          <option
            v-for="(item, index) in clientes"
            :value="item"
            :key="index">
            {{ item.nome }} {{ item.sobrenome }}
          </option>
        </b-select>
      </b-field>

      <div class="columns" v-if="ordem.cliente.key">
        <div class="column is-8">
          <div class="dadosPessoais">Dados Cliente</div>
          <div class="columns">
            <div class="column">
              <b-field label="Nome">
                <div>{{ ordem.cliente.nome }} {{ ordem.cliente.sobrenome }}</div>
              </b-field>

            </div>
            <div class="column">
              <b-field label="CPF/CNPJ">
                <div>{{ ordem.cliente.cpf }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Data Nascimento">
                <div>{{ ordem.cliente.dataNascimento }}</div>
              </b-field>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="dadosPessoais">Endereço</div>
          <div class="columns">
            <div class="column">
              <b-field label="Logradouro">
                <div>{{ ordem.cliente.endereco.logradouro }}, {{ ordem.cliente.endereco.numero }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Bairro">
                <div>{{ ordem.cliente.endereco.bairro }}</div>
              </b-field>
            </div>
          </div>
        </div>
      </div>
      <hr/>

      <div class="dadosPessoais">Ordem de serviço</div>
      <div class="columns">
        <div class="column">
          <b-field label="Tipo">
            <b-input v-model="ordem.tipo" />
          </b-field>

          <b-field label="Nº Série">
            <b-input v-model="ordem.numeroSerie" />
          </b-field>

          <b-field label="Observações">
            <b-input v-model="ordem.observacao" type="textarea"/>
          </b-field>
        </div>

        <div class="column">
          <b-field label="Marca">
            <b-input v-model="ordem.marca" />
          </b-field>

          <b-field label="Modelo">
            <b-input v-model="ordem.modelo" />
          </b-field>

          <b-field label="Acessorios">
            <b-input v-model="ordem.acessorios" type="textarea"/>
          </b-field>
        </div>
      </div>
      <hr/>

      <div style="width: 100%; text-align: right">
        <button class="button is-info is-fullwidth" @click="salvar" :disabled="habilitarSavar">Salvar</button>
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
    this.listarClientes()
    this.dataAtual = new Date()
    this.ajustardata(this.dataAtual)
    this.listarOrdens()
  },
  data () {
    return {
      dataAtual: null,
      loading: false,
      isFullPage: true,
      clientes: [],
      ordens: [],
      ordem: {
        observacao: null,
        finalizado: false,
        relizado: false,
        cancelado: false,
        tipo: null,
        numero: null,
        cliente: {},
        descricao: null,
        data: null,
        acessorios: null,
        numeroSerie: null,
        marca: null,
        modelo: null
      }
    }
  },
  computed: {
    habilitarSavar () {
      let retorno = true
      if (this.ordem.cliente.nome && this.ordem.observacao && this.ordem.tipo && this.ordem.numero &&
        this.ordem.descricao && this.ordem.acessorios && this.ordem.numeroSerie && this.ordem.marca &&
        this.ordem.modelo) {
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
      this.ordem.data = dia + '/' + mes + '/' + ano + ''
    },
    listarOrdens () {
      firebase.database().ref('/ordemServicos').on('value', res => {
        res.forEach(ordem => {
          let item = ordem.val()
          this.ordens.push(item)
        })
        if (this.ordens.length !== 0) {
          this.ordem.numero = this.ordens[this.ordens.length - 1].numero + 1
        } else {
          this.ordem.numero = 1
        }
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
    listarClientes () {
      this.loading = true
      firebase.database().ref('/clientes').on('value', res => {
        res.forEach(ordem => {
          let item = ordem.val()
          item.key = ordem.key
          this.clientes.push(item)
        })
        this.clientes.sort(this.ordenarClientes)
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
    ordenarClientes (a, b) {
      if (a.nome < b.nome) {
        return -1
      }
      if (a.nome > b.nome) {
        return 1
      }
      return 0
    },
    salvar () {
      this.loading = true
      firebase.database().ref('/ordemServicos').push(this.ordem).then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Ordem de Serviço cadastrada com sucesso!`,
          type: 'is-success'
        })
        this.$router.push('/ordemServico')
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Não foi possivel salvar essa Ordem de Serviço`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
