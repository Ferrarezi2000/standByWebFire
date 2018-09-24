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
      <div class="titulo column">Nova Venda</div>
      <div class="column" style="text-align: right; font-weight: bold">
        <div>{{ dataAtual | moment("ddd, DD MMM YYYY HH:mm") }}</div>
      </div>
    </div>

    <div style="margin: 0 20px 0 20px">
      <b-field label="Cliente">
        <b-select placeholder="Selecione o cliente" expanded v-model="venda.cliente">
          <option
            v-for="(item, index) in clientes"
            :value="item"
            :key="index">
            {{ item.nome }} {{ item.sobrenome }}
          </option>
        </b-select>
      </b-field>

      <div v-if="venda.cliente.key">
        <div>
          <div class="dadosPessoais">Dados Cliente</div>
          <div class="columns">
            <div class="column">
              <b-field label="Nome">
                <div>{{ venda.cliente.nome }} {{ venda.cliente.sobrenome }}</div>
              </b-field>

            </div>
            <div class="column">
              <b-field label="CPF/CNPJ">
                <div>{{ venda.cliente.cpf }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Data Nascimento">
                <div>{{ venda.cliente.dataNascimento }}</div>
              </b-field>
            </div>
          </div>
        </div>
<hr/>
        <div>
          <div class="dadosPessoais">Endereço</div>
          <div class="columns">
            <div class="column">
              <b-field label="Logradouro">
                <div>{{ venda.cliente.endereco.logradouro }}, {{ venda.cliente.endereco.numero }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Bairro">
                <div>{{ venda.cliente.endereco.bairro }}</div>
              </b-field>
            </div>
          </div>
        </div>
      </div>
      <hr/>

      <div class="columns">
        <div class="column">
          <b-field label="Produto">
            <b-select placeholder="Selecione o cliente" expanded v-model="venda.produto">
              <option
                v-for="(item, index) in produtos"
                :value="item"
                :key="index">
                {{ item.nome }} - {{ item.descricao }} - {{ item.marca }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="column is-2">
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
        <div class="column is-2">
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

      <div class="columns" v-if="venda.produto.key">
        <div class="column">
          <div class="dadosPessoais">Dados Produto</div>
          <div class="columns">
            <div class="column">
              <b-field label="Nome">
                <div>{{ venda.produto.nome }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Descrição">
                <div>{{ venda.produto.descricao }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Marca">
                <div>{{ venda.produto.marca }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Número de Série">
                <div>{{ venda.produto.serial }}</div>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Valor">
                <money :value="venda.produto.valorDesconto" class="input" disabled v-if="venda.parcelado === 'sim'"
                       style="background-color: white; border-color: white"/>
                <money :value="venda.produto.valor" class="input" disabled v-else
                       style="background-color: white; border-color: white"/>
              </b-field>
            </div>
          </div>
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
import { permissao } from '../../config/permissao'
import firebase from 'firebase'
import { mask } from 'vue-the-mask'

export default {
  mixins: [permissao],
  directives: { mask },
  created () {
    this.checarLogado()
    this.listarClientes()
    this.dataAtual = new Date()
    this.ajustardata()
    this.listarProdutos()
  },
  data () {
    return {
      dataAtual: null,
      loading: false,
      isFullPage: true,
      clientes: [],
      produtos: [],
      venda: {
        tipo: 'venda',
        formaPagamento: '',
        parcelado: '',
        cliente: {},
        produto: {},
        data: null
      }
    }
  },
  computed: {
    habilitarSavar () {
      let retorno = true
      if (this.venda.cliente.nome && this.venda.produto.nome && this.venda.parcelado && this.venda.formaPagamento) {
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
    listarProdutos () {
      this.loading = true
      firebase.database().ref('/produtos').on('value', res => {
        res.forEach(ordem => {
          let item = ordem.val()
          item.key = ordem.key
          this.produtos.push(item)
        })
        this.produtos.sort(this.ordenarClientes)
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
      if (this.venda.parcelado === 'sim') {
        this.venda.valor = this.venda.produto.valorDesconto
      } else {
        this.venda.valor = this.venda.produto.valor
      }
      firebase.database().ref('/vendas').push(this.venda).then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Venda realizada com sucesso!`,
          type: 'is-success'
        })
        this.$router.push('/vendas')
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
