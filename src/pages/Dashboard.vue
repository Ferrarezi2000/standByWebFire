<style scoped></style>

<template>
  <div>Dashboard</div>
</template>

<script>
import { permissao } from '../config/permissao'

export default {
  mixins: [permissao],
  created () {
    this.checarLogado()
  }
}
</script>
