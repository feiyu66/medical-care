import teamIntroduce from '../../pages/team/teamIntroduce.vue'
import sharedMixin from '../../shared/mixin'
// use shared mixins
Vue.mixin(sharedMixin)

teamIntroduce.el = '#root'
new Vue(teamIntroduce)
