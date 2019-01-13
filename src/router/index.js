import Vue from 'vue'
import Router from 'vue-router'
const CircleA = () => import('@/components/circle')
const TextB = () => import('@/components/TextB')
const Endc = () => import('@/components/endc')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CircleA',
      component: CircleA
    },
    {
      path: '/textb',
      name: 'TextB',
      component: TextB
    },
    {
      path: '/endc',
      name: 'Endc',
      component: Endc
    }
  ]
})
