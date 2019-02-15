import createTeam from '../../pages/team/createTeam.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

createTeam.el = '#root'
new Vue(createTeam)
