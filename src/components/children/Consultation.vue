<template>
    <div class="box">
        <text @click="jump('teamIntroduce')">团队介绍</text>
    </div>
</template>
<script>
import { createLink, storage_getItem, printLog } from '../../shared/utils'
const storage = weex.requireModule('storage')
export default {
    name: 'Consultation',
    data () {
        return {
            
        }
    },
    methods: {
        jump( path ) {
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

