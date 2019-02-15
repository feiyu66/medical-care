import healthBehavior from '../../pages/onhealth/healthBehavior.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

healthBehavior.el = '#root'
new Vue(healthBehavior)
