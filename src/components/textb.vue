<template>
<div class="textb clear">
  <div class="title">春眠不觉晓觉晓</div>
  <div class="title">处处蚊蚊子咬</div>
  <div class="title">夜来风d雨声</div>
  <div class="title">红包知多gh少</div>
  <router-link to='/endc' v-show="next">下一步</router-link>
</div>
</template>
<script>
export default {
  data: function () {
    return {
      next: false
    }
  },
  /**
   * @param Object el
   */
  methods: {
    textFlutter: function (el) {
      var text = el.innerText.split('')
      var elHTML = ''
      for (let i = 0; i < text.length; i++) {
        elHTML += '<span class="hidden">' + text[i] + '</span>'

        let n = Math.floor(Math.random() * 1000)

        setTimeout(() => {
          console.log(el.getElementsByTagName('span')[i])
          el.getElementsByTagName('span')[i].style.top = '0px'
          el.getElementsByTagName('span')[i].style.opacity = '1'
        }, n)
      }
      el.innerHTML = elHTML
      const _this = this
      setTimeout(() => {
        _this.next = true
      }, 3000)
    }
  },
  mounted () {
    var el = this.$el.getElementsByClassName('title')
    for (var i = 0; i < el.length; i++) {
      this.textFlutter(el[i])
    }
  }
}
</script>

<style>
.textb>div {
  float: left;
  width: 160px;
  margin: 10px 8px;
  color: green;
}
.hidden {
  position: relative;
  top: 300px;
  opacity: 0;
  transition: all 2s ease;
}
.clear::after {
  display: block;
  content: "";
  clear: both;
  height: 0px;
}
</style>
