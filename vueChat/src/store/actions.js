// 使用するのでmutation-typeを読み込む
import { SET_MESSAGES, GET_CHANNELS } from './mutation-types'

// function の簡略化 引数とreturnを省略
const getMessagePath = cname => 'https://us-central1-demoapp-88ee1.cloudfunctions.net/v1/channels/' + cname + '/messages'
// const getMessagePath = cname => 'http://localhost:5000/demoapp-88ee1/us-central1/v1/channels/' + cname + '/messages'

// メッセージ用API fetch関数
async function fetchGetMessages (cname) {
  // urlを取得してfetch
  const response = await fetch(getMessagePath(cname))
  const json = await response.json()
  return json.messages
}

// action.jsから{commit}を使って、mutationを呼ぶ
// mutationにはstateの更新が書かれている
export default {
  // 通信してfirebaseに送るので、消去
  // [SET_MESSAGE] ({commit}, message) {
  //  commit(SET_MESSAGE, message)
  // },

  // 通信して取得して、最終的にstoreに追加する
  [GET_CHANNELS] ({commit}) {
    // fetch('https://us-central1-demoapp-88ee1.cloudfunctions.net/v1/channels')
    //  .then((response) => {
    //    return response.json()
    //  }).then((json) => {
    // 受け取ってstoreに入れる
    //    commit(GET_CHANNELS, json.channels)

    // asyncの関数を定義
    async function fetchApi () {
      // 待つ
      const response = await fetch('https://us-central1-demoapp-88ee1.cloudfunctions.net/v1/channels')
      // const response = await fetch('http://localhost:5000/demoapp-88ee1/us-central1/v1/channels')

      // さらに待つ
      const json = await response.json()
      commit(GET_CHANNELS, json.channels)
    }

    fetchApi()
  },

  // サーバのメッセージを取得する
  async GET_MESSAGES ({commit}, cname) {
    const messages = await fetchGetMessages(cname)
    commit(SET_MESSAGES, messages)
  },

  async POST_MESSAGES ({commit}, {cname, message}) {
    // response
    const response = await fetch(getMessagePath(cname), {
      method: 'POST',
      // POSTするときのbodyを設定
      // 内容をjsonに変換する
      body: JSON.stringify({
        'body': message
      }),
      // responseヘッダの設定
      // jsonで受け取る
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    if (json.result === 'ok') {
      const messages = await fetchGetMessages(cname)
      commit(SET_MESSAGES, messages)
    }
  }
}
