import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: 'hduhduehdeuh',
  titulo: 'Cliente'
}
const mutations = {
  registrarAdm (state, payload) {
    state.token = payload
  },
  inserirTitulo (state, payload) {
    state.titulo = payload
  }
}
const getters = {
  checkToken () {
    return !!state.token
  },
  getTitulo () {
    return state.titulo
  }
}

export default new Vuex.Store({ state, mutations, getters })
