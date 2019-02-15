<template>
  <div class="unread" v-if="isShow" :style="widthStyle"><text class="unread_word">{{number}}</text></div>
</template>
<script>
export default {
  props: ['num'],
  watch: {
    num(value) {
      this.showUnread();
    }
  },
  data () {
    return {
        number: this.num,
        isShow: false
    }
  },
  mounted () {
    this.showUnread();
  },
  methods: {
    showUnread() {
      console.log(this.num)
      if (this.num > 0 && this.num < 10) {
        this.isShow = true;
        this.widthStyle = {width: '40px'}
        this.number = this.num
      } else if (this.num > 9 && this.num < 100) {
        this.isShow = true;
        this.widthStyle = {width: '50px'}
        this.number = this.num
      } else if (this.num > 99) {
        this.isShow = true;
        this.number = '99+'
        this.widthStyle = {width: '60px'}
      } else {
        this.isShow = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .unread{
        width: 40px;
        height:40px;
        position: absolute;
        border-width: 3px;
        border-color: #ffffff;
        background-color: #FF2A2A;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 999px;
    }
    .unread_word{
        font-size: 20px;
        color: rgb(255, 255, 255);
    }
</style>
