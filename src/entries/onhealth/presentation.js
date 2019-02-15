import presentation from '../../pages/onhealth/presentation.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

presentation.el = '#root'
new Vue(presentation)
