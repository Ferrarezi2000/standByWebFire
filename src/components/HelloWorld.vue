<style scoped></style>

<template>
  <div>
    <div>teste</div>

    <b-field label="Name">
      <b-input v-model="nome"></b-input>
    </b-field>

    <b-field label="Name">
      <b-input v-model="telefone"></b-input>
    </b-field>

    <button @click="teste"/>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'HelloWorld',
  created () {},
  data () {
    return {
      nome: null,
      telefone: null
    }
  },
  methods: {
    teste () {
      let clientes = firebase.database().ref('clientes')
      clientes.push({
        nome: this.nome,
        telefone: this.telefone
      })
    }
  }
}
</script>
