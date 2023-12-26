import Vue from 'vue'
import Vuex from 'vuex'

import myadmin from '@/store/modules/_admin'
Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
      myadmin
    },
    state:{},
})