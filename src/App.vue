<style scoped>
  .fundoLogin {background-color: #039be5}
  .titulo {font-size: 18px; color: white; font-weight: bold;}
  .menuTop {background-color: rgb(3, 155, 229); width: 100%; height: 49px; left: 0; top: 0; position: relative; box-shadow: 0 3px 3px rgba(0,0,0,0.3)}
</style>
<template>
  <div id="app" style="height: 100%" :class="{'fundoLogin' : $route.path === '/'}">
    <div>
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
    ...mapGetters(['getExibir'])
  }
}
</script>
