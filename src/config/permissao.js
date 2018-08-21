import { mapGetters } from 'vuex'

export const permissao = {
  created () {},
  computed: {
    ...mapGetters(['checkToken'])
  },
  methods: {
    checarLogado () {
      if (!this.checkToken) {
        this.$router.push('/')
      }
    }
  }
}
