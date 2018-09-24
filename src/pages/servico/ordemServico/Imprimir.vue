<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 5px; border-radius: 0 !important}
  .borda {border: 1px solid darkgray}
</style>

<template>
  <div class="box page">
    <b-loading :is-full-page="isFullPage" :active.sync="loading" :can-cancel="false"/>

    <div style="text-align: center; font-weight: bold; background-color: whitesmoke;
    padding: 10px; margin-bottom: 20px; font-size: 25px">
      Ordem de Serviço
    </div>
    <div class="columns">
      <div class="column borda">
        <div style="text-align: center; font-weight: bold; background-color: whitesmoke; padding: 10px; font-size: 20px">
          Stand By Soluções em Informática
        </div>
        <div>Av. Carlos Alberto Araújo, nº 14 - Vila Laroca</div>
        <div>CNPJ: 0212120202121202021210</div>
        <div>email@email.com</div>
        <div>(32) 98898-1758 - Thiago Ferrarezi</div>
        <div>(32) 98898-1758 - Anderson Machado</div>
      </div>
      <div class="column is-5 borda">
        <div style="text-align: center; font-weight: bold; background-color: whitesmoke; padding: 10px; font-size: 20px">
          Comprovante de entrega
        </div>
        <div class="columns">
          <div class="column">
            <strong>
              <div style="text-align: center; margin-top: 20px">Data expedição</div>
              <div style="text-align: center">{{ordem.data}}</div>
            </strong>
          </div>
          <div class="column">
            <strong>
              <div style="text-align: center; margin-top: 20px">Número O.S.</div>
              <div style="text-align: center">{{ordem.numero}}</div>
            </strong>
          </div>
        </div>
      </div>
    </div>

    <div style="text-align: center; font-weight: bold; background-color: whitesmoke;
    padding: 10px; margin-bottom: 20px; font-size: 20px">
      Cliente
    </div>

    <div class="columns borda">
      <div class="column is-2">
        <div><strong>Nome:</strong></div>
        <div>
          <strong>Endereço:</strong>
        </div>
        <div>
          <strong>Telefone:</strong>
        </div>
        <div>
          <strong>Email:</strong>
        </div>
      </div>
      <div class="column">
        <div>
          {{ordem.cliente.nome}} {{ordem.cliente.sobrenome}}
        </div>
        <div>
          {{ordem.cliente.endereco.logradouro}}, nº {{ordem.cliente.endereco.numero}} - {{ordem.cliente.endereco.bairro}}
        </div>
        <div>
          Fixo - {{ordem.cliente.contato.fixo}}, Celular - {{ordem.cliente.contato.celular}}
        </div>
        <div>
          {{ordem.cliente.contato.email}}
        </div>
      </div>
    </div>

    <div style="text-align: center; font-weight: bold; background-color: whitesmoke;
    padding: 10px; margin-bottom: 20px; font-size: 20px">Equipamento</div>
    <div class="columns borda">
      <div class="column is-2">
        <div><strong>Marca:</strong></div>
        <div><strong>Modelo:</strong></div>
        <div><strong>Número de Série:</strong></div>
        <div><strong>Acessórios:</strong></div>
      </div>
      <div class="column">
        <div>{{ordem.marca}}</div>
        <div>{{ordem.modelo}}</div>
        <div>{{ordem.numeroSerie}}</div>
        <div>{{ordem.acessorios}}</div>
      </div>
    </div>

    <div class="columns borda">
      <div class="column">
        <div><strong>Observações / Problema relatado</strong></div>
        <div>{{ordem.observacao}}</div>
      </div>
    </div>
    <hr/>

    <div class="columns borda">
      <div class="column">
        <div style="text-align: center"><strong>Assinatura ADM</strong></div>
        <div style="margin-bottom: 60px; margin-top: 60px"></div>
      </div>
    </div>

    <button class="button is-fullwidth" @click="voltar">Voltar</button>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapMutations } from 'vuex'

export default {
  created () {
    this.carregarOrdem(this.$route.params.id)
  },
  data () {
    return {
      loading: false,
      isFullPage: true,
      ordem: {
        numero: null,
        data: null,
        cliente: {nome: null, sobrenome: null},
        endereco: {logradouro: null, numero: null, bairro: null}
      }
    }
  },
  methods: {
    ...mapMutations(['mudarExibicao']),
    carregarOrdem (id) {
      this.loading = true
      firebase.database().ref('/ordemServicos').orderByKey().equalTo(id).on('value', res => {
        res.forEach(item => {
          this.ordem = item.val()
        })
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Ordem não encontrada!`,
          type: 'is-danger'
        })
      })
    },
    voltar () {
      this.mudarExibicao('programa')
      this.$router.push('/dashboard')
    }
  }
}
</script>
