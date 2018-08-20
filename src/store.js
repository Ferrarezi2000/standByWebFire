import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: null
}
const mutations = {
  registrarAdm (state, payload) {
    state.token = payload
  }
}
const getters = {
  permissao () {
    return !!state.token
  }
}

export default new Vuex.Store({ state, mutations, getters })
