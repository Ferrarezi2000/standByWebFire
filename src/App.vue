<style scoped>
  .menuLateral {background-color: #262f3d; width: 100%; height: 100%; left: 0; bottom: 0; top: 0; position: relative}
  .menuTop {background-color: rgb(3, 155, 229); width: 100%; height: 45px; left: 0; top: 0; position: relative; box-shadow: 0 3px 3px rgba(0,0,0,0.3)}
</style>
<template>
  <div id="app" style="height: 100%">
    <div class="columns" style="height: 100%; margin: 0 !important;" v-if="$route.path !== '/'">
      <div class="column is-2 is-paddingless">
        <div class="menuLateral">
        </div>
      </div>

      <div class="column is-paddingless">
        <div class="menuTop has-shadow">
          <span>{{ getTitulo }}</span>
        </div>
        <router-view/>
      </div>
    </div>

    <div v-else>
      {{$router.path}}
      <router-view/>
    </div>
  </div>
</template>

<script>
import Menu from './components/Menu'
import { mapGetters } from 'vuex'

export default {
  components: {'meu-menu': Menu},
  name: 'App',
  computed: {
    ...mapGetters(['getTitulo'])
  }
}
</script>
