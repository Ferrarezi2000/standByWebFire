import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from 'air-vue-components/store/store-auth'

Vue.use(Vuex)

const state = {}
const mutations = {}
const actions = {}
const getters = {}
const modules = {auth}

export default new Vuex.Store({ state, mutations, actions, getters, modules })
