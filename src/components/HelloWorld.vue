<style scoped></style>

<template>
  <div>
    <div>teste</div>

    <b-field label="Name">
      <b-input v-model="cliente.nome"></b-input>
    </b-field>

    <b-field label="Name">
      <b-input v-model="cliente.telefone"></b-input>
    </b-field>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'HelloWorld',
  created () {
    this.teste()
  },
  data () {
    return {
      cliente: {nome: null, telefone: null}
    }
  },
  methods: {
    teste () {
      let clientes = firebase.database().ref('clientes')
      clientes.push()
    }
  }
}
</script>
