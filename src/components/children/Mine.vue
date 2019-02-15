<template>
    <div class="box">
        <text @click="jump('statistics')">随访统计</text>
        <text @click="jump('managementTeam')">管理团队</text>
    </div>
</template>
<script>
import { createLink } from '../../shared/utils'
const storage = weex.requireModule('storage')
export default {
    name: 'Mine',
    data () {
        return {
            
        }
    },
    methods: {
        jump (path) {
            if(!path) return;
            const navigator = weex.requireModule('navigator')
            navigator.push({
                url: createLink(path),
                animated: "true"
            })
        }
    }
}
</script>

