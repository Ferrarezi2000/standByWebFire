<style scoped>
  nav {position: fixed; width: 100%; z-index: 10; font-size: 12px}
  .itensMenu:hover {background-color: white !important; color: darkblue !important;}
</style>
<template>
  <nav class="navbar animated fadeInDown">
    <div class="navbar-brand" style="background-color: darkblue">
      <span class="navbar-item cabecalho-sistema" style="color: white">
        <b-icon icon="power-off" />
        <span>Stand By</span>
      </span>
    </div>

    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item itensMenu" to="/" ><b-icon icon="home"/></router-link>

        <router-link class="navbar-item itensMenu" to="/clientes">Cliente</router-link>
      </div>

      <div class="navbar-end">
        <a class="navbar-item itensMenu" @click="sair">
          <b-icon icon="sign-out-alt"/>
          <span>Sair</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import firebase from 'firebase'

export default {
  created () {},
  data () {
    return {
      menu_ativo: false
    }
  },
  methods: {
    sair () {
      firebase.auth().signOut().then(res => {
        this.$router.push('/')
      })
    }
  }
}
</script>
