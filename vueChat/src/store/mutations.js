// 使用するので、mutation-type.jsから変数を定義する
import {
  GET_CHANNELS,
  SET_MESSAGES
} from './mutation-types'

export default {
  [GET_CHANNELS] (state, channels) {
    state.channels = channels
  },
  [SET_MESSAGES] (state, messages) {
    state.messages = messages
  }
}
