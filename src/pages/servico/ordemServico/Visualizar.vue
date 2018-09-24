<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 30px 50px; border-radius: 0 !important;}
  .titulo {font-weight: bold; font-size: 25px; margin-bottom: 20px}
  .tituloStand {font-size: 18px; color: white; font-weight: bold;}
  .menuTop {background-color: rgb(3, 155, 229); width: 100%; height: 49px; left: 0; top: 0;
    position: relative; box-shadow: 0 3px 3px rgba(0,0,0,0.3)}
  .dadosPessoais {font-weight: 500; margin: 20px 20px 20px 0; color: rgb(3, 155, 229); font-size: 17px}
</style>

<template>
  <div>
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false"/>
    <div class="columns" style="height: 100%; margin: 0 !important;">
      <div class="column is-2 is-paddingless">
        <menu-lateral/>
      </div>

      <div class="column is-paddingless">
        <div class="menuTop has-shadow" style="padding: 10px 0 0 20px; position: fixed; margin-left: 243px">
          <span class="tituloStand">Stand By - Soluções em Informática</span>
        </div>
        <div style="margin-top: 80px">
          <div class="box page">
            <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>

            <div class="columns">
              <div class="titulo column">Ordem de Serviço</div>
              <div class="column" style="text-align: right; font-weight: bold">
                <div>{{ ordem.numero }}</div>
                <div>{{ ordem.data }}</div>
              </div>
            </div>

            <div style="margin: 0 20px 0 20px">
              <div class="columns" v-if="ordem.cliente.key">
                <div class="column is-8">
                  <div class="dadosPessoais">Dados Cliente</div>
                  <div class="columns">
                    <div class="column">
                      <b-field label="Nome">
                        <div>{{ ordem.cliente.nome }} {{ ordem.cliente.sobrenome }}</div>
                      </b-field>

                    </div>
                    <div class="column">
                      <b-field label="CPF/CNPJ">
                        <div>{{ ordem.cliente.cpf }}</div>
                      </b-field>
                    </div>
                    <div class="column">
                      <b-field label="Data Nascimento">
                        <div>{{ ordem.cliente.dataNascimento }}</div>
                      </b-field>
                    </div>
                  </div>
                </div>

                <div class="column">
                  <div class="dadosPessoais">Endereço</div>
                  <div class="columns">
                    <div class="column">
                      <b-field label="Logradouro">
                        <div>{{ ordem.cliente.endereco.logradouro }}, {{ ordem.cliente.endereco.numero }}</div>
                      </b-field>
                    </div>
                    <div class="column">
                      <b-field label="Bairro">
                        <div>{{ ordem.cliente.endereco.bairro }}</div>
                      </b-field>
                    </div>
                  </div>
                </div>
              </div>
              <hr/>

              <div class="dadosPessoais">Equipamento</div>
              <div class="columns">
                <div class="column">
                  <b-field label="Tipo">
                    <div>{{ordem.tipo}}</div>
                  </b-field>

                  <b-field label="Nº Série">
                    <div>{{ordem.numeroSerie}}</div>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Marca">
                    <div>{{ordem.marca}}</div>
                  </b-field>

                  <b-field label="Acessorios">
                    <div>{{ordem.acessorios}}</div>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Modelo">
                    <div>{{ordem.modelo}}</div>
                  </b-field>

                  <b-field label="Observações">
                    <div>{{ordem.observacao}}</div>
                  </b-field>
                </div>
              </div>
              <hr/>

              <div class="dadosPessoais">Status</div>
              <div class="columns" v-if="ordem.cancelada">
                <div class="column is-3">
                  <b-field label="Status">
                    <div style="color: red; font-weight: bold">CANCELADA</div>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Motivo do Cancelamento">
                    <div>{{ordem.motivoCancelamento}}</div>
                  </b-field>
                </div>
              </div>

              <div class="columns" v-if="ordem.finalizada">
                <div class="column">
                  <b-field label="Status">
                    <div v-if="ordem.finalizada" style="color: green; font-weight: bold">FINALIZADA</div>
                  </b-field>
                </div>

                <div class="column">
                  <b-field label="Valor">
                    <money :value="ordem.valor" class="input" disabled style="background-color: white; border-color: white"/>
                  </b-field>
                </div>
              </div>

              <div class="columns" v-if="!ordem.cancelada && !ordem.finalizada">
                <div class="column">
                  <b-field label="Status">
                    <div style="color: blue; font-weight: bold">EM ANÁLISE</div>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { permissao } from '../../../config/permissao'
import firebase from 'firebase'
import { mask } from 'vue-the-mask'
import Menu from '../../../components/Menu'
import MenuLateral from '../../../components/MenuLateral'

export default {
  mixins: [permissao],
  directives: { mask },
  components: {'meu-menu': Menu, 'menu-lateral': MenuLateral},
  created () {
    if (this.$route.params.id) {
      this.carregarOrdem(this.$route.params.id)
    }
  },
  data () {
    return {
      dataAtual: null,
      loading: false,
      isFullPage: true,
      clientes: [],
      ordens: [],
      ordem: {
        observacao: null,
        tipo: null,
        numero: null,
        cliente: {},
        descricao: null,
        data: null,
        acessorios: null,
        numeroSerie: null,
        marca: null,
        modelo: null
      }
    }
  },
  methods: {
    carregarOrdem (id) {
      this.loading = true
      firebase.database().ref('/ordemServicos').orderByKey().equalTo(id).on('value', res => {
        res.forEach(item => {
          this.ordem = item.val()
        })
        this.loading = false
        console.log('ordem', this.ordem)
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Ordem de serviço não encontrada!`,
          type: 'is-danger'
        })
      })
    }
  }
}
</script>
