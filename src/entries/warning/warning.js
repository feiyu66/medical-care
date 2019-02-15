import warning from '../../pages/warning/warning.vue'
import sharedMixin from '../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

warning.el = '#root'
new Vue(warning)
