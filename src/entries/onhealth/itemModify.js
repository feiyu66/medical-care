import itemModify from '../../pages/onhealth/itemModify.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

itemModify.el = '#root'
new Vue(itemModify)
