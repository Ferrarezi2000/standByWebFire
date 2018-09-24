<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px; margin-bottom: 20px}
  .dadosPessoais {font-weight: 500; margin: 20px 20px 20px 0; color: rgb(3, 155, 229); font-size: 17px}
</style>

<template>
  <div class="box page">
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false"/>

    <div class="columns">
      <div class="titulo column">Visualizar Venda</div>
      <div class="column" style="text-align: right; font-weight: bold">
        <div>{{ venda.data }}</div>
      </div>
    </div>

    <div style="margin: 0 20px 0 20px">
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
      <hr/>

      <div class="columns">
        <div class="column is-2">
          <b-field label="Parcelado?">
            <div class="block">
              <b-radio v-model="venda.parcelado"
                       native-value="sim" disabled>
                SIM
              </b-radio>
              <b-radio v-model="venda.parcelado"
                       native-value="nao" disabled>
                NÃO
              </b-radio>
            </div>
          </b-field>
        </div>
        <div class="column is-3">
          <b-field label="Cartão?">
            <div class="block">
              <b-radio v-model="venda.formaPagamento"
                       native-value="Dinheiro" disabled>
                Dinheiro
              </b-radio>
              <b-radio v-model="venda.formaPagamento"
                       native-value="Cartão" disabled>
                Cartão
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
    this.carregarVenda(this.$route.params.id)
  },
  data () {
    return {
      loading: false,
      venda: {
        cliente: {},
        produto: {},
        data: null
      }
    }
  },
  methods: {
    carregarVenda (id) {
      this.loading = true
      firebase.database().ref('/vendas').orderByKey().equalTo(id).on('value', res => {
        res.forEach(item => {
          this.venda = item.val()
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
    }
  }
}
</script>
