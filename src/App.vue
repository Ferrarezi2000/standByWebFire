<style scoped>
  .page {padding: 80px 100px}
  .menuLateral {background-color: #262f3d; width: 100%; height: 100%; left: 0; bottom: 0; top: 0; position: relative}
  .menuTop {background-color: #262f3d; width: 100%; height: 120px; left: 0; top: 0; position: relative}
</style>
<template>
  <div id="app">
    <div class="columns">
      <div class="column is-2">
        <div class="menuLateral"></div>
      </div>

      <div class="column">
        <div class="menuTop"></div>
        <router-view/>
      </div>

    </div>
  </div>
</template>

<script>
import Menu from './components/Menu'

export default {
  components: {'meu-menu': Menu},
  name: 'App'
}
</script>


