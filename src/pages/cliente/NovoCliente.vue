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

            <div class="columns">
              <div class="column">
                <div class="titulo" v-if="$route.params.id">Editar Cliente</div>
                <div class="titulo" v-else>Novo Cliente</div>
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

                <div class="column">
                  <b-field label="Email">
                    <b-input v-model="cliente.contato.email"/>
                  </b-field>
                </div>
              </div>
              <hr/>

              <div class="dadosPessoais">Endereço</div>
              <div class="columns">
                <div class="column">
                  <b-field label="Logradouro">
                    <b-input v-model="cliente.endereco.logradouro"/>
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
  computed: {
    habilitarSavar () {
      let retorno = true
      if (this.cliente.nome && this.cliente.sobrenome && this.cliente.dataNascimento && this.cliente.cpf && this.cliente.contato.fixo && this.cliente.contato.email &&
        this.cliente.contato.celular && this.cliente.endereco.logradouro && this.cliente.endereco.numero && this.cliente.endereco.bairro) {
        retorno = false
      }
      return retorno
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
    },
    addEditar () {
      if (this.$route.params.id) {
        this.editar()
      } else {
        this.salvar()
      }
    },
    deletar () {
      firebase.database().ref('/clientes').child(this.$route.params.id).remove().then(res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Cliente deletado com sucesso!`,
          type: 'is-success'
        }, res => {
          this.loading = false
          this.$toast.open({
            duration: 3000,
            message: `Não foi possivel cadastrar cliente`,
            type: 'is-danger'
          })
        })
        this.$router.push('/clientes')
      })
    },
    editar () {
      this.loading = true
      this.ajustarNascimento()
      firebase.database().ref('/clientes').child(this.$route.params.id).set(this.cliente).then(res => {
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
    }
  }
}
</script>
