<template>
<div>
  <img src="./circle2.png" id="lamp" style="display:none;">
  <div class="outer" @touchmove.prevent="ballmove" @touchstart="touchStart" @touchend="touchEnd">
    <div class="core">
      <div class="movePath" :style="pathStyle()">
        <div class="lower"></div>
        <div class="upper">
          <canvas id="mycanvas" width="310" height="310"></canvas>
        </div>
      </div>
      <div class="startPosi" :style="startStyle"></div>
      <div class="ball" :style="ballStyle()">
        <span></span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  data: function () {
    return {
      ballX: 0, // 小球X轴坐标
      ballY: -150, // 小球Y轴坐标
      radii: 150, // 小球运动轨迹半径
      allowMove: false // 是否允许小球跟随手指运动
    }
  },
  computed: {
    startStyle: function () {
      var style = `top:-${this.radii + 8}px;left:-8px;`
      return style
    }
  },
  methods: {
    touchStart: function (e) {
      var core = this.$el.getElementsByClassName('core')[0]
      var coreX = core.offsetLeft // 圆心X坐标
      var coreY = core.offsetTop // 圆心Y坐标
      var fingerX = e.touches[0].clientX - coreX // 手指相对于圆心x坐标
      var fingerY = e.touches[0].clientY - coreY // 手指相对于圆心y坐标
      /* 手指到球当前所在位置的距离 */
      var finger2ball = Math.sqrt(Math.pow((this.ballX - fingerX), 2) + Math.pow((this.ballY - fingerY), 2))
      if (finger2ball < 50 && fingerX >= 0) {
        this.allowMove = true
      }
    },
    touchEnd: function () {
      this.allowMove = false
      this.ballBack()
    },
    /* 小球沿着轨迹运动 */
    ballmove: function (e) {
      if (!this.allowMove) {
        return false
      }
      var core = this.$el.getElementsByClassName('core')[0]
      var coreX = core.offsetLeft // 圆心X坐标
      var coreY = core.offsetTop // 圆心Y坐标
      var fingerX = e.touches[0].clientX - coreX // 手指相对于圆心x坐标
      var fingerY = e.touches[0].clientY - coreY // 手指相对于圆心y坐标
      if (fingerX < 0 && fingerY < 0) { // 当手指滑到第四象限时停止滑动
        if (fingerX / fingerY < 1.73) {
          this.allowMove = false
          return false
        }
      }
      /**
       * 假设小球x、y坐标分别为ballX、ballY
       *  由于圆心、手指和小球在一条直线上，所以：
       * ballY / ballX = (fingerY - coreY) / (fingerX - coreX)
       * 即： ballY = ((fingerY - coreY) / (fingerX - coreX)) * ballX
       * 又由于 ballY平方 + ballX平方 = 运动轨迹半径的平方
       * 即： ballY = (运动轨迹半径的平方 - ballX平方)的平方根
       * 亦即： (fingerY / fingerX) * ballX = (运动轨迹半径的平方 - ballX平方)的平方根
       * 即： ((fingerY / fingerX)的平方 + 1) * ballX的平方 = 运动轨迹半径的平方
       * 即： ballX = (运动轨迹半径的平方 / ((fingerY / fingerX)的平方 + 1))平方根
       * 所以小球相对于圆心的x坐标如下：
       */
      var ballX = Math.sqrt(Math.pow(this.radii, 2) / (Math.pow(fingerY / Math.abs(fingerX), 2) + 1))
      var ballY = (fingerY / Math.abs(fingerX)) * ballX
      if (ballX === 0) { // 防止 ballY 的值为 NAN
        fingerY < 0 && (ballY = -this.radii)
        fingerY > 0 && (ballY = this.radii)
      }
      if (fingerX < 0) { // 手指在圆心左边小球的x坐标取负值
        ballX = -ballX
      }
      this.pathColor(ballX, ballY) // 给小球经过的路径染色

      this.ballX = ballX
      this.ballY = ballY
    },
    /** 小球的style属性 */
    ballStyle: function () {
      var style = `top:${this.ballY}px;left:${this.ballX}px;`
      return style
    },
    /** 小球运动轨迹层style属性 */
    pathStyle: function () {
      var style = `width:${this.radii * 2}px;
                   height:${this.radii * 2}px;
                   top:-${this.radii}px;
                   left:-${this.radii}px;`
      return style
    },
    /* 随着小球运动，小球经过的路径变色 */
    drawCircle: function (x, y, r, a) {
      var c = document.getElementById('mycanvas')
      var ctx = c.getContext('2d')
      const PI = Math.PI
      ctx.clearRect(0, 0, c.width, c.height)
      var img = document.getElementById('lamp')
      var pat = ctx.createPattern(img, 'no-repeat')
      ctx.beginPath()
      ctx.arc(x, y, r, -0.5 * PI, (a - 0.5) * PI)
      ctx.fillStyle = pat
      ctx.fill()
    },
    pathColor: function (ballX, ballY) {
      var angle = 0 // 小球运行的角度
      const PI = Math.PI
      if (ballX > 0 && ballY < 0) { // 小球位于第一象限
        angle = Math.abs(Math.acos(ballX / this.radii) - PI / 2) / PI
      } else if (ballX > 0 && ballY > 0) { // 小球位于第二象限
        angle = Math.abs(Math.acos(ballX / this.radii) + PI / 2) / PI
      } else if (ballX < 0 && ballY > 0) { // 小球位于第三象限
        angle = Math.abs(Math.acos(ballX / this.radii) + PI / 2) / PI
      } else if (ballX < 0 && ballY < 0) { // 小球位于第四象限
        angle = Math.abs(3 * PI / 2 - Math.acos(ballX / this.radii)) / PI + 1
      }
      this.drawCircle(this.radii, this.radii, this.radii, angle)
    },
    /**
     * 松开手指小球返回起始处
    */
    ballBack: function () {
      if (this.ballX > 0 && this.ballY <= 0) { // 小球位于第一象限
        this.ballX -= 10
        this.ballY = -Math.sqrt(Math.pow(this.radii, 2) - Math.pow(this.ballX, 2))
      } else if (this.ballX > 0 && this.ballY > 0) { // 小球位于第二象限
        this.ballX += 10
        if (this.ballX > this.radii) {
          this.ballX = this.radii
        }
        this.ballY = Math.sqrt(Math.pow(this.radii, 2) - Math.pow(this.ballX, 2))
      } else if (this.ballX < 0 && this.ballY > 0) { // 小球位于第三象限
        this.ballX -= 10
        if (this.ballX < -this.radii) {
          this.ballX = -this.radii
        }
        this.ballY = Math.sqrt(Math.pow(this.radii, 2) - Math.pow(this.ballX, 2))
      } else if (this.ballX < 0 && this.ballY <= 0) { // 小球位于第四象限
        if (this.ballY !== 0 && this.ballX / this.ballY < 0.1) { // 防止小球返回时超过起始点
          this.ballY = -this.radii
          this.ballX = 0
          this.pathColor(this.ballX, this.ballY)
          return false
        }
        this.ballX += 5
        this.ballY = -Math.sqrt(Math.pow(this.radii, 2) - Math.pow(this.ballX, 2))
        this.pathColor(this.ballX, this.ballY)
        this.$router.replace('/textb')
        if (this.ballX > -140) { // 小球运动的终点，当轨迹半径不同时该值也会变化，需要在测试时寻找该值
          return false
        }
      } else {
        return false
      }
      this.pathColor(this.ballX, this.ballY) // 给小球经过的路径染色

      const _this = this
      setTimeout(() => {
        _this.ballBack()
      }, 20)
    }
  },
  mounted () {
    // this.drawCircle(150, 150, 150, 90)
  }
}
</script>
<style scoped>
.outer {
  width: 300px;
  height: 300px;
}
.core {
  position: relative;
  height: 0px;
  width: 0px;
  top: 150px;
  left: 150px;
  background: red;
}
.movePath {
  position: absolute;
  /* border: 3px dotted #333; */
  border-radius: 50%;
}
.startPosi {
  position: absolute;
  width: 14px;
  height: 14px;
  background: white;
  border: 1px solid red;
  border-radius: 50%;
}
.lower {
  width: 300px;
  height: 300px;
  background: url("./circle.png") center no-repeat;
}
.upper {
  position: absolute;
  top: 0px;
  left: 0px;
}
.ball {
  position: absolute;
  width: 0px;
  height: 0px;
}
.ball span {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: red;
  top: -6px;
  left: -6px;
}
</style>
