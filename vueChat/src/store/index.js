import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import mutations from './mutations'
import actions from './actions'

// import
Vue.use(Vuex)

const state = {
  messages: [],
  channels: []
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

// mutation-type.jsを使って、
// javascriptのmethodsを書いて、stateを変更させる
// 1.mutation-type.jsの変数を使って、javascriptからaction.jsを紐づけて呼ぶ
// 2.actions.jsがmutation.jsを呼ぶ
// 3.mutation.jsにはstateを変更させる内容のものが書かれている
