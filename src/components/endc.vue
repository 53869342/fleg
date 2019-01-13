<template>
<div>
  <div class="outer">
    <p v-for="index in 50" :key="index">✿</p>
  </div>
</div>
</template>
<script>
export default {
  data: function () {
    return {
      myp: false
    }
  },
  methods: {
    getRandom: function () {
      return Math.floor((Math.random() - 0.5) * 150 + 20)
    }
  },
  mounted () {
    var myp = this.$el.getElementsByTagName('p')
    for (let n = 0; n < myp.length; n++) {
      let randX = (Math.random() - 0.5) * 150 + 20 // 起始位置 x 轴偏移距离
      let randY = (Math.random() - 0.5) * 150 + 20 // 起始位置 y 轴偏移距离
      let randTime = Math.floor(Math.random() * 150 + 50)
      myp[n].style = `transform:translate(${randX}px, ${randY}px);`
      setTimeout(() => {
        var randY = Math.floor(Math.random() * 50 + 20) // 向上抛洒时 y 轴达到的距离
        myp[n].style = `transform:translate(${randX}px, -${randY}px);
                        opacity:1;`
        let randTime2 = Math.floor(Math.random() * 500 + 500)
        setTimeout(() => {
          myp[n].style = `transform:translate(${randX}px, ${randY + 400}px);
                          opacity:0;`
        }, randTime2)
      }, randTime)
    }
  }
}
</script>
<style>
.outer {
  display: inline-block;
  width: 50px;
  margin: 0 auto;
}
.outer p {
  position: absolute;
  opacity: 0;
  transition: all .8s ease;
}
</style>
