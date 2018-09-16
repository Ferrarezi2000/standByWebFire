<style scoped>
  .login {width: 300px; margin: auto}
  img {width: 140px; height: 140px}
  p {margin: 15px 0 15px 0}
</style>

<template>
  <div class="hero">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"></b-loading>

    <div class="hero-body  animated fadeIn">
      <div class="login">

        <div class="has-text-centered">
          <img src="../assets/avatar.png" class="circle-border"/>
          <p>Por favor, informe seu usuário e senha.</p>
        </div>

        <form @submit.stop.prevent="logar">
          <b-field>
            <b-input v-model="email" autofocus/>
          </b-field>

          <b-field>
            <b-input v-model="senha" placeholder="******" type="password" password-reveal/>
          </b-field>

          <button class="button is-info is-fullwidth" @click.stop.prevent="logar">Logar</button>
        </form>
      </div>
    </div>

    <div class="login">
      <hr/>
    </div>

    <div class="hero-footer has-text-centered">
      <small>Stand By - Soluções em informática - {{new Date() | moment("YYYY")}}</small>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import firebase from 'firebase'

export default {
  created () {},
  data () {
    return {
      loading: false,
      isFullPage: true,
      email: null,
      senha: null
    }
  },
  methods: {
    ...mapMutations(['registrarAdm', 'mudarExibicao']),
    logar () {
      this.loading = true
      firebase.auth().signInWithEmailAndPassword(this.email, this.senha).then(res => {
        let token = Math.random().toString(5)
        this.registrarAdm(token)
        this.mudarExibicao('programa')
        this.$router.push('/dashboard')
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 5000,
          message: `Email ou Senha incorreto!`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
