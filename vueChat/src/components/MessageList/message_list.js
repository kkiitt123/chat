export default {
  name: 'message-list',
  props: {
    'messages': {
      type: Array,
      // 初期値。validatorつけると入力チェック的なこともできる
      default: [],
      required: true
    }
  }
  // props: ['messages']
}
