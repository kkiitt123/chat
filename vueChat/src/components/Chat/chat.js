// vuexを使うための内容を書く
// ヘルパー関数。vuexとの間に使用。
import { mapGetters, mapActions } from 'vuex'
import { GET_CHANNELS } from '../../store/mutation-types'
// これほぼもうディレクトリをimportする感じ
// importする名前は自由だった。
import messageList from '../MessageList'

export default {
  name: 'chat',

  // name: 'message-list',でjsで定義しているが、
  // 関係ないっぽい。名前とはという感じ
  // componensではないよ。ここでミスって表示されなかった
  components: {
    // 左のaaaaはタグを使うときに利用
    // 右辺はimportした時の名前
    'message-list': messageList
  },

  mounted () {
    // ここで実行しないとcomputedしてもchannelsを取得できない
    this.GET_CHANNELS()
    this.GET_MESSAGES(this.$route.params.cname)
  },
  computed: {
    // storeに登録されているmessageを受け取る
    // this.$store.getters.messagesと同じ。
    ...mapGetters([
      'messages',
      'channels'
    ])
  },
  // これがないと、チャンネルをクリックした時にメッセージが取得できない
  beforeRouteUpdate (to, from, next) {
    this.GET_MESSAGES(to.params.cname)
    next()
  },
  methods: {
    // actionと紐づけるための定数
    ...mapActions([
      // mutation-typesでは定義していないので、
      // ''で囲ってfunction名をつける
      'POST_MESSAGES',
      'GET_MESSAGES',
      GET_CHANNELS
    ]),

    send_message () {
      // this.SET_MESSAGES(this.message)
      this.POST_MESSAGES({'cname': this.$route.params.cname, 'message': this.message})
      this.message = ''
    }
  },

  data () {
    return {
      // messageだけは残す。messagesは消す
      message: ''
    }
  }
}
