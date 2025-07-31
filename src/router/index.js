import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path:'/',
      redirect:'/videoPlay'
    },
    {
      path: '/videoPlay',
      name: 'videoPlay',
      component: () => import('@/view/videoPlay/index.vue')
    }
  ],
})

export default router
