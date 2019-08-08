import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // eslint-disable-next-line no-unused-vars
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/searchbook',
      name: 'searchbook',
      // eslint-disable-next-line no-unused-vars
      component: () => import(/* webpackChunkName: "SearchBook" */ './views/SearchBook.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      // eslint-disable-next-line no-unused-vars
      component: () => import(/* webpackChunkName: "singup" */ './views/Signup.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      // eslint-disable-next-line no-unused-vars
      component: () => import(/* webpackChunkName: "singin" */ './views/Signin.vue')
    },
    {
      path: '/mybook',
      name: 'mybook',
      // eslint-disable-next-line no-unused-vars
      component: () => import(/* webpackChunkName: "mybook" */ './views/MyBook.vue')
    },
    {
      path: '/mypage',
      name: 'mypage',
      // eslint-disable-next-line no-unused-vars
      component: () => import(/* webpackChunkName: "mypage" */ './views/MyPage.vue')
    },
    {
      path: '/bookDetail/:isbn',
      name: 'bookDetail',
      // eslint-disable-next-line no-unused-vars
      component: () => import(/* webpackChunkName: "bookDetail" */ './views/BookDetail.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {
        next({
          path: '/signin',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next()
  }
})

export default router
