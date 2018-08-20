<style scoped>

</style>

<template>
    <div class="hero">
      <b-loading :is-full-page="isFullPage" :active.sync="isFullPage" :can-cancel="true"></b-loading>

      <div class="hero-body  animated fadeIn">
        <div class="login">

          <div class="has-text-centered">
            <img src="../assets/avatar.png" class="circle-border" />
            <p>Por favor, informe seu usuário e senha.</p>
          </div>

          <form @submit.stop.prevent="logar">
            <b-field>
              <b-input v-model="email" autofocus/>
            </b-field>

            <b-field>
              <b-input v-model="senha" placeholder="******"  type="password" password-reveal/>
            </b-field>

            <button class="button is-primary is-fullwidth" @click.stop.prevent="logar">Logar</button>
            <button class="button is-primary is-fullwidth" @click.stop.prevent="deslogarUsuario">Deslogado</button>
            <button class="button is-primary is-fullwidth" @click.stop.prevent="verificarUsuarioLogado">Verificar</button>
            <button class="button is-primary is-fullwidth" @click.stop.prevent="teste">Salvar Teste</button>
          </form>
        </div>
      </div>

      <div class="hero-footer has-text-centered">
        <small>Stand By - Soluções em informática - {{new Date() | moment("YYYY")}}</small>
      </div>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
  created () {},
  data () {
    return {
      isFullPage: true,
      email: null,
      senha: null
    }
  },
  methods: {
    logar () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.senha).then(res => {
        console.log('sucesso')
      }, res => {
        console.log('erro')
      })
      console.log()
    },
    verificarUsuarioLogado () {
      if (firebase.auth().currentUser) {
        console.log('logado')
      } else {
        console.log('nao logado')
      }
    },
    deslogarUsuario () {
      firebase.auth().signOut().then(res => {
        console.log('deslogado')
      })
    },
    teste () {
      let clientes = firebase.database().ref('clientes')
      clientes.push({
        nome: 'thiago',
        telefone: '0000000'
      })
    }
  }
}
</script>
