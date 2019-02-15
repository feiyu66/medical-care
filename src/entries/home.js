import Home from '../components/children/Home.vue'
import sharedMixin from '../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

Home.el = '#root'
new Vue(Home)
