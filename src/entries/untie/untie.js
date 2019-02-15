import untie from '../../pages/untie/untie.vue'
import sharedMixin from '../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

untie.el = '#root'
new Vue(untie)
