<style scoped></style>

<template>
  <div>
  <div>Dashboard</div>
    <button class="button is-primary is-fullwidth" @click.stop.prevent="logar">Logar</button>
    <button class="button is-primary is-fullwidth" @click.stop.prevent="deslogarUsuario">Deslogado</button>
    <button class="button is-primary is-fullwidth" @click.stop.prevent="verificarUsuarioLogado">Verificar</button>
    <button class="button is-primary is-fullwidth" @click.stop.prevent="teste">Salvar Teste</button>
  </div>
</template>

<script>
import { permissao } from '../config/permissao'
import firebase from 'firebase'

export default {
  mixins: [permissao],
  created () {
    this.checarLogado()
  },
  methods: {
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
    logar () {
      firebase.auth().signInWithEmailAndPassword('ferrarezi_alem@yahoo.com.br', 'ferrarezi2000')
    },
    teste () {
      firebase.database().ref('clientes').push({
        nome: 'thiago ferrarezi',
        telefone: '0000000'
      })
    }
  }
}
</script>
