<style scoped>
  .titulo {font-size: 18px; color: white; font-weight: bold;}
  .menuTop {background-color: rgb(3, 155, 229); width: 100%; height: 49px; left: 0; top: 0; position: relative; box-shadow: 0 3px 3px rgba(0,0,0,0.3)}
</style>
<template>
  <div id="app" style="height: 100%">
    <div class="columns" style="height: 100%; margin: 0 !important;" v-if="$route.path !== '/'">
      <div class="column is-2 is-paddingless">
        <menu-lateral/>
      </div>

      <div class="column is-paddingless">
        <div class="menuTop has-shadow" style="padding: 10px 0 0 50px">
          <span class="titulo">{{ getTitulo }}</span>
        </div>
        <router-view/>
      </div>
    </div>

    <div v-else>
      <router-view/>
    </div>
  </div>
</template>

<script>
import Menu from './components/Menu'
import MenuLateral from './components/MenuLateral'
import { mapGetters } from 'vuex'

export default {
  components: {'meu-menu': Menu, 'menu-lateral': MenuLateral},
  name: 'App',
  computed: {
    ...mapGetters(['getTitulo'])
  }
}
</script>
