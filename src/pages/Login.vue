<style scoped>
  .login {width: 300px; margin: auto}
  img {width: 140px; height: 140px}
  p {font-size: 32px; color: white; font-weight: 500}
  .botao {background-color: #1d6fa5; border: 0; border-color: #1d6fa5 !important; padding: 15px; color: white; width: 100%; border-radius: 0.3rem}
</style>

<template>
  <div class="hero">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"></b-loading>

    <div style="width: 100%; text-align: center; margin: 100px 0 40px 0" class="animated fadeIn">
      <h1 style="color: white; font-size: 32px; font-weight: 300">Faça login na sua conta</h1>
    </div>

    <div style="background-color: white; margin: 0 38% 0 38%; border-radius: 10px" class="animated fadeIn">
      <div>
        <div class="has-text-centered" style="border-bottom: 1px solid #E5E5E5E5; background-color: black;
                                              border-radius: 10px 10px 0 0">
          <p style="margin: 40px">STAND BY</p>
        </div>

        <form @submit.stop.prevent="logar" style="margin: 30px 20px 20px 20px">
          <b-field :type="!!errors.first('email') ? 'is-danger' : ''">
            <b-input v-model="email" autofocus style="height: 45px"
                     :placeholder="!!errors.first('email') ? errors.first('email') : 'Email'"
                     v-validate="'required|email'" name="email" data-vv-as="Email"/>
          </b-field>

          <b-field :type="!!errors.first('senha') ? 'is-danger' : ''">
            <b-input v-model="senha" :placeholder="!!errors.first('senha') ? errors.first('senha') : '******'" type="password" password-reveal
                     v-validate="'required'" name="senha" data-vv-as="Senha"/>
          </b-field>

          <button style="margin-top: 30px" class="botao" @click.stop.prevent="logar">LOGAR</button>
        </form>
      </div>

      <div class="login">
        <hr/>
      </div>

      <div class="has-text-centered" style="color: #444444; margin-bottom: 5px">
        <small>{{new Date() | moment("dddd, DD MMMM YYYY")}}</small>
      </div>
    </div>

    <div style="width: 100%; text-align: center; color: white; margin-top: 25px">
      <small>Powered By </small>
      <b-icon icon="power-off" />
      <span style="font-size: 15px; font-weight: 400">Stand By - Soluções em informática</span>
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
      this.$validator.validateAll().then(res => {
        if (res) {
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
      })
    }
  }
}
</script>
