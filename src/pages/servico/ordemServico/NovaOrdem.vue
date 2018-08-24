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
        <div>Nº 0001</div>
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
        <div class="column">
          <div class="dadosPessoais">Dados Cliente</div>
          <div class="columns">
            <div class="column">
              <b-field label="Nome">
                <div>{{ ordem.cliente.nome }} {{ ordem.cliente.sobrenome }}</div>
              </b-field>
              <b-field label="Data Nascimento">
                <div>{{ ordem.cliente.dataNascimento }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="CPF/CNPJ">
                <div>{{ ordem.cliente.cpf }}</div>
              </b-field>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="dadosPessoais">Endereço</div>
          <div class="columns">
            <div class="column">
              <b-field label="Logradouro">
                <div>{{ ordem.cliente.endereco.logradouor }}, {{ ordem.cliente.endereco.numero }}</div>
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
        <!--<div class="column">-->
          <!--<b-field label="Sobrenome">-->
            <!--<b-input v-model="cliente.sobrenome"/>-->
          <!--</b-field>-->

          <!--<b-field label="Data Nascimento">-->
            <!--<date-picker v-model="cliente.dataNascimento" lang="pt-br" format="DD/MM/YYYY"-->
                         <!--confirm style="width: 100%"/>-->
          <!--</b-field>-->
        <!--</div>-->
      <!--</div>-->
      <!--<hr/>-->

      <!--<div class="dadosPessoais">Contatos</div>-->
      <!--<div class="columns">-->
        <!--<div class="column">-->
          <!--<b-field label="Telefone Fixo">-->
            <!--<b-input v-model="cliente.contato.fixo"  v-mask="['(##) ####-####', '(##) #####-####']"/>-->
          <!--</b-field>-->
        <!--</div>-->

        <!--<div class="column">-->
          <!--<b-field label="Telefone Celular">-->
            <!--<b-input v-model="cliente.contato.celular"  v-mask="['(##) ####-####', '(##) #####-####']"/>-->
          <!--</b-field>-->
        <!--</div>-->
      <!--</div>-->
      <!--<hr/>-->

      <!--<div class="dadosPessoais">Endereço</div>-->
      <!--<div class="columns">-->
        <!--<div class="column">-->
          <!--<b-field label="Logradouro">-->
            <!--<b-input v-model="cliente.endereco.logradouor"/>-->
          <!--</b-field>-->
        <!--</div>-->

        <!--<div class="column">-->
          <!--<b-field label="Bairro">-->
            <!--<b-input v-model="cliente.endereco.bairro"/>-->
          <!--</b-field>-->
        <!--</div>-->

        <!--<div class="column is-2">-->
          <!--<b-field label="Número">-->
            <!--<b-input v-model="cliente.endereco.numero"/>-->
          <!--</b-field>-->
        <!--</div>-->
      <!--</div>-->
      <hr/>

      <div style="width: 100%; text-align: right">
        <button class="button is-info is-fullwidth" @click="salvar" >Salvar</button>
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
  },
  data () {
    return {
      dataAtual: null,
      loading: false,
      isFullPage: true,
      clientes: [],
      ordem: {
        observacao: null,
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
  methods: {
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
    },
    listarClientes () {
      this.loading = true
      firebase.database().ref('/clientes').on('value', res => {
        res.forEach(ordem => {
          let item = ordem.val()
          item.key = ordem.key
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
    }
  }
}
</script>
