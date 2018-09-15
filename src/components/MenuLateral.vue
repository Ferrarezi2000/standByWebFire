<style scoped>
  .menuLateral {background-color: #262f3d; width: 243px; height: 100%; left: 0; bottom: 0; top: 0; position: fixed}
  .itens {background-color: #262f3d !important; color: white}
  .itemOpen {background-color: #19212b !important;}
  p {color: white}
  .borda {border: solid #404854; border-width: 0 0 1px 20px;}
  .bordaItens {border: solid #404854; border-width: 0 0 1px 0}
  span {margin-left: 10px}
  .sair {bottom: 0; position: absolute; color: white !important; text-align: right; width: 100%; padding: 15px;
         border: solid #404854; border-width: 1px 0 0 0; cursor: pointer}
  .sair:hover {background-color: rgb(3, 155, 229)}
  .itemSelecao:hover {color: rgb(3, 155, 229)}
</style>

<template>
  <div class="menuLateral">
    <b-collapse class="card itens borda" >
      <div slot="trigger" slot-scope="props" class="card-header">
        <p class="card-header-title">
          <b-icon icon="power-off" style="color: rgb(3, 155, 229); margin-top: 4px"/>
          <span style="font-size: 20px">Stand By</span>
        </p>
      </div>
    </b-collapse>

    <b-collapse class="card itens bordaItens" :open="false" >
      <div slot="trigger" slot-scope="props" class="card-header" style="height: 80px">
        <div style="margin: 12px 15px">
          <div style="font-weight: 500">Cliente</div>
          <div style="color: rgba(255,255,255,.7); font-size: 10px">Clientes cadastrados em nosso sistema</div>
        </div>
        <a class="card-header-icon" style="color: white">
          <b-icon :icon="props.open ? 'angle-up' : 'angle-down'" size="is-small"/>
        </a>
      </div>
      <div class="card-content itemOpen">
        <div class="content" style="color: rgba(255,255,255,.7)">
          <div style="margin-bottom: 20px; cursor: pointer" class="itemSelecao" @click="rota('/clientes')">
            <b-icon icon="clipboard-list" size="is-small"/>
            <span>Lista</span>
          </div>

          <div style="cursor: pointer" class="itemSelecao" @click="rota('/cliente/novo')">
            <b-icon icon="user" size="is-small"/>
            <span>Novo cliente</span>
          </div>
        </div>
      </div>
    </b-collapse>

    <b-collapse class="card itens bordaItens" :open="false">
      <div slot="trigger" slot-scope="props" class="card-header" style="height: 80px">
        <div style="margin: 12px 15px">
          <div style="font-weight: 500">Produto</div>
          <div style="color: rgba(255,255,255,.7); font-size: 10px">Produtos cadastrados em nosso sistema</div>
        </div>
        <a class="card-header-icon" style="color: white">
          <b-icon :icon="props.open ? 'angle-up' : 'angle-down'" size="is-small"/>
        </a>
      </div>
      <div class="card-content itemOpen">
        <div class="content" style="color: rgba(255,255,255,.7)">
          <div style="margin-bottom: 20px; cursor: pointer" class="itemSelecao" @click="rota('/produtos')">
            <b-icon icon="clipboard-list" size="is-small"/>
            <span>Lista</span>
          </div>

          <div style="cursor: pointer" class="itemSelecao" @click="rota('/produto/novo')">
            <b-icon icon="user" size="is-small"/>
            <span>Novo produto</span>
          </div>
        </div>
      </div>
    </b-collapse>

    <b-collapse class="card itens bordaItens" :open="false">
      <div slot="trigger" slot-scope="props" class="card-header" style="height: 80px">
        <div style="margin: 12px 15px">
          <div style="font-weight: 500">Serviço</div>
          <div style="color: rgba(255,255,255,.7); font-size: 10px">Serviços cadastrados em nosso sistema</div>
        </div>
        <a class="card-header-icon" style="color: white">
          <b-icon :icon="props.open ? 'angle-up' : 'angle-down'" size="is-small"/>
        </a>
      </div>
      <div class="card-content itemOpen">
        <div class="content" style="color: rgba(255,255,255,.7)">
          <div style="margin-bottom: 20px; cursor: pointer" class="itemSelecao" @click="rota('/ordemServico')">
            <b-icon icon="clipboard-list" size="is-small"/>
            <span>Ordem de serviço</span>
          </div>

          <div style="cursor: pointer; margin-bottom: 20px" class="itemSelecao" @click="rota('/servicoRealizado')">
            <b-icon icon="clipboard-list" size="is-small"/>
            <span>Serviço realizados</span>
          </div>

          <div style="cursor: pointer" class="itemSelecao" @click="rota('/servicoCancelado')">
            <b-icon icon="clipboard-list" size="is-small"/>
            <span>Serviço cancelados</span>
          </div>
        </div>
      </div>
    </b-collapse>

    <b-collapse class="card itens bordaItens" :open="false">
      <div slot="trigger" slot-scope="props" class="card-header" style="height: 80px">
        <div style="margin: 12px 15px">
          <div style="font-weight: 500">Venda</div>
          <div style="color: rgba(255,255,255,.7); font-size: 10px">Vendas cadastradas em nosso sistema</div>
        </div>
        <a class="card-header-icon" style="color: white">
          <b-icon :icon="props.open ? 'angle-up' : 'angle-down'"/>
        </a>
      </div>
      <div class="card-content itemOpen">
        <div class="content" style="color: rgba(255,255,255,.7)">
          <div style="margin-bottom: 20px; cursor: pointer" class="itemSelecao" @click="rota('/vendas')">
            <b-icon icon="clipboard-list" size="is-small"/>
            <span>Lista</span>
          </div>

          <div style="cursor: pointer; margin-bottom: 20px" class="itemSelecao" @click="rota('/venda/novo')">
            <b-icon icon="user" size="is-small"/>
            <span>Novo venda</span>
          </div>

          <div style="cursor: pointer" class="itemSelecao" @click="rota('/venda/outros')">
            <b-icon icon="user" size="is-small"/>
            <span>Outros serviços</span>
          </div>
        </div>
      </div>
    </b-collapse>

    <div class="sair" @click="sair">
      <span>Sair</span>
      <b-icon icon="sign-out-alt" size="is-small"/>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  methods: {
    sair () {
      firebase.auth().signOut().then(res => {
        this.$router.push('/')
      })
    },
    rota (caminho) {
      this.$router.push(caminho)
    }
  }
}
</script>
