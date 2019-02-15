import archives from '../../pages/onhealth/archives.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

archives.el = '#root'
new Vue(archives)
