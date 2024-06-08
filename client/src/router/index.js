import { createRouter, createWebHistory } from 'vue-router'
import Review from '@/views/Review.vue'
import WelcomePage from '@/views/welcome.vue'
import QuestionsPage from '@/views/questions.vue'

import adminLogin from '@/views/adminLogin.vue'
import Admin from '@/views/Admin.vue'
import EditForm from '@/views/admin/EditForm.vue'
import usersManager from '@/views/admin/usersManager.vue'
import ResultsPage from '@/views/review/ResultsPage.vue'
import ContactPage from '@/views/review/ContactPage.vue'
import ThanksPage from '@/views/review/ThanksPage.vue'
import FeedbacksPage from '@/views/admin/FeedbacksPage.vue'

const routes = [
  {
    path: '/review/:user_id/',
    name: 'review',
    component: Review,
    children: [
      {
        name: 'welcome',
        path: 'welcome',
        component: WelcomePage
      },
      {
        name: 'questions',
        path: 'questions/:step?',
        component: QuestionsPage
      },
      {
        name: 'results',
        path: 'results/:status',
        component: ResultsPage
      },
      {
        name: 'contact',
        path: 'contact',
        component: ContactPage
      },
      {
        name: 'thanks',
        path: 'thanks',
        component: ThanksPage
      }
    ]
  },
  {
    path: '/admin/',
    name: 'admin',
    component: Admin,
    children: [
      {
        name: 'admin_login',
        path: 'login',
        component: adminLogin
      },
      {
        name: 'edit_form',
        path: 'edit_form',
        component: EditForm
      },
      {
        name: 'users_manager',
        path: 'users_manager',
        component: usersManager
      },
      {
        name: 'feedbacks',
        path: 'feedbacks',
        component: FeedbacksPage
      },
    ]
  },
  // {
  //   path: '/:catchAll(.*)',
  //   redirect: '/review'
  // },
  {
    path: '/',
    redirect: '/admin'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// router.beforeEach((to, from, next) => {
//   const isLoggedIn = localStorage.getItem('user_token');
  
//   if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
//     // Redirect to login page if not logged in
//     next('admin/login');
//   } else {
//     next();
//   }
// });

export default router
