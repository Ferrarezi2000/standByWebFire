<style scoped>
  .box {background-color: white; padding: 20px}
  .page {margin: 5px; border-radius: 0 !important}
  .borda {border: 1px solid darkgray}
</style>

<template>
  <div class="box page">
    <b-loading :is-full-page="true" :active.sync="loading" :can-cancel="false"/>

    <div style="text-align: center; font-weight: bold; background-color: whitesmoke;
    padding: 10px; margin-bottom: 20px; font-size: 25px">
      Venda
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
        <div
          style="text-align: center; font-weight: bold; background-color: whitesmoke; padding: 10px; font-size: 20px">
          Comprovante
        </div>
        <strong>
          <div style="text-align: center; margin-top: 20px">Data</div>
          <div style="text-align: center">{{venda.data}}</div>
        </strong>
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
          {{venda.cliente.nome}} {{venda.cliente.sobrenome}}
        </div>
        <div>
          {{venda.cliente.endereco.logradouro}}, nº {{venda.cliente.endereco.numero}} - {{venda.cliente.endereco.bairro}}
        </div>
        <div>
          Fixo - {{venda.cliente.contato.fixo}}, Celular - {{venda.cliente.contato.celular}}
        </div>
        <div>
          {{venda.cliente.contato.email}}
        </div>
      </div>
    </div>

    <div style="text-align: center; font-weight: bold; background-color: whitesmoke;
    padding: 10px; margin-bottom: 20px; font-size: 20px">Equipamento</div>
    <div class="columns borda">
      <div class="column is-2">
        <div><strong>Nome:</strong></div>
        <div><strong>Marca:</strong></div>
        <div><strong>Descrição:</strong></div>
        <div><strong>Modelo:</strong></div>
        <div><strong>Número de Série:</strong></div>
      </div>
      <div class="column">
        <div>{{venda.produto.nome}}</div>
        <div>{{venda.produto.marca}}</div>
        <div>{{venda.produto.descricao}}</div>
        <div>{{venda.produto.modelo}}</div>
        <div>{{venda.produto.numeroSerie}}</div>
      </div>
    </div>

    <div class="columns borda">
      <div class="column">
        <div><strong>Valor da Venda</strong></div>
        <money :value="venda.valor" class="input" disabled/>
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
    this.carregarVenda(this.$route.params.id)
  },
  data () {
    return {
      loading: false,
      venda: {
        cliente: {},
        produto: {},
        data: null
      }
    }
  },
  methods: {
    ...mapMutations(['mudarExibicao']),
    carregarVenda (id) {
      this.loading = true
      firebase.database().ref('/vendas').orderByKey().equalTo(id).on('value', res => {
        res.forEach(item => {
          this.venda = item.val()
        })
        this.loading = false
      }, res => {
        this.loading = false
        this.$toast.open({
          duration: 3000,
          message: `Cliente não encontrado!`,
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
