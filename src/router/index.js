import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Lost from '../views/Lost.vue'
import Home from '../views/Home.vue'
import DicomBrowser from '../views/DicomBrowser.vue'
import StudyBrowser from '../views/StudyBrowser.vue'
import SubjectBrowser from '../views/SubjectBrowser.vue'
import store from '../store'

const requireAuthenticated = (to, from, next) => {
  store.dispatch('auth/initialize').then(() => {
    if (!store.getters['auth/isAuthenticated']) {
      next('/login')
    } else {
      next()
    }
  })
}

const requireUnauthenticated = (to, from, next) => {
  store.dispatch('auth/initialize').then(() => {
    if (store.getters['auth/isAuthenticated']) {
      next('/home')
    } else {
      next()
    }
  })
}

const redirectLogout = (to, from, next) => {
  store.dispatch('auth/logout').then(() => next('/login'))
}

Vue.use(Router)

export default new Router({
  saveScrollPosition: true,
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      beforeEnter: requireAuthenticated
    },
    {
      path: '/login',
      component: Login,
      beforeEnter: requireUnauthenticated
    },
    {
      path: '/logout',
      beforeEnter: redirectLogout
    },
    {
      path: '*',
      component: Lost
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
      path: '/dicom-browser',
      name: 'dicomBrowser',
      component: DicomBrowser,
      beforeEnter: requireAuthenticated
    },
    {
      path: '/subjects',
      name: 'subjectBrowser',
      component: SubjectBrowser,
      beforeEnter: requireAuthenticated
    },
    {
      path: '/studies',
      name: 'studyBrowser',
      component: StudyBrowser,
      beforeEnter: requireAuthenticated
    }
  ]
})
