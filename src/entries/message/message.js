import message from '../../pages/message/message.vue'
import sharedMixin from '../../shared/mixin'

// hide title bar
try {
    const titleBar = weex.requireModule('titleBar')
    titleBar.showTitleBar(false)
} catch (e) {}

// use shared mixins
Vue.mixin(sharedMixin)

message.el = '#root'
new Vue(message)
