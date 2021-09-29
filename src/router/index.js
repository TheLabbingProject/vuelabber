import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Lost from '../views/Lost.vue'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import AnalysisBrowser from '../views/AnalysisBrowser.vue'
import AnalysisInformation from '../components/analysis/analysis-information.vue'
// import BrainBrowserView from '../views/BrainBrowser.vue'
import DicomBrowser from '../views/DicomBrowser.vue'
import MriBrowser from '../views/MriBrowser.vue'
import PipelineBrowser from '../views/PipelineBrowser.vue'
import RunBrowser from '../views/RunBrowser.vue'
import SequenceTypes from '../views/SequenceTypes.vue'
import StudyBrowser from '../views/StudyBrowser.vue'
import SubjectBrowser from '../views/SubjectBrowser.vue'
import TaskBrowser from '../views/TaskBrowser.vue'
import ScanTypes from '../views/ScanTypes.vue'
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
      path: '/user/:username',
      name: 'userInformation',
      component: User,
      props: true
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
      path: '/mri-sequence-types',
      name: 'sequenceTypes',
      component: SequenceTypes,
      beforeEnter: requireAuthenticated
    },
    {
      path: '/mri-browser',
      name: 'mriBrowser',
      component: MriBrowser,
      beforeEnter: requireAuthenticated
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
    },
    {
      path: '/analysis-browser',
      name: 'analysisBrowser',
      component: AnalysisBrowser,
      beforeEnter: requireAuthenticated
    },
    {
      path: '/analysis-browser/:analysisId',
      name: 'analysisInformation',
      component: AnalysisInformation,
      beforeEnter: requireAuthenticated,
      props: true
    },
    {
      path: '/run-browser',
      name: 'runBrowser',
      component: RunBrowser,
      beforeEnter: requireAuthenticated
    },
    {
      path: '/pipeline-browser',
      name: 'pipelineBrowser',
      component: PipelineBrowser,
      beforeEnter: requireAuthenticated
    },
    // {
    //   path: '/brain-browser',
    //   name: 'brainBrowser',
    //   component: BrainBrowserView,
    //   beforeEnter: requireAuthenticated
    // },
    {
      path: '/scan-types',
      name: 'scanTypes',
      component: ScanTypes,
      beforeEnter: requireAuthenticated
    },
    {
      path: '/tasks',
      name: 'taskBrowser',
      component: TaskBrowser,
      beforeEnter: requireAuthenticated
    }
  ]
})
