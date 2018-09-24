import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: null,
  exibir: 'login',
  titulo: 'Cliente'
}
const mutations = {
  registrarAdm (state, payload) {
    state.token = payload
  },
  mudarExibicao (state, payload) {
    state.exibir = payload
  },
  inserirTitulo (state, payload) {
    state.titulo = payload
  }
}
const getters = {
  checkToken () {
    return !!state.token
  },
  getExibir () {
    return state.exibir
  },
  getTitulo () {
    return state.titulo
  }
}

export default new Vuex.Store({ state, mutations, getters })
