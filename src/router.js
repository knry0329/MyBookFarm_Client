import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import myBookDetail from './views/MyBookDetail.vue'
import searchBook from './views/SearchBook.vue'
import userDetail from './views/UserDetail.vue'
import about from './views/About.vue'
import signup from './views/Signup.vue'
import signin from './views/Signin.vue'
import myBookList from './views/MyBookList.vue'
import myPage from './views/MyPage.vue'
import bookDetail from './views/BookDetail.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: about 
    },
    {
      path: '/searchbook',
      name: 'searchbook',
      component: searchBook,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup
    },
    {
      path: '/',
      name: 'signin',
      component: signin
    },
    {
      path: '/mybook',
      name: 'mybook',
      component: myBookList,
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: myPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/mybook/:isbn',
      name: 'myBookDetail',
      component: myBookDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/userDetail/:uid',
      name: 'userDetail',
      component: userDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/bookDetail/:uid/:isbn',
      name: 'bookDetail',
      component: bookDetail,
      meta: { requiresAuth: true }
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
          path: '/',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next()
  }
})

export default router
