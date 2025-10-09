import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'spells',
        component: () => import('src/pages/SpellsPage.vue'),
      },

      {
        path: 'character',
        name: 'character',
        component: () => import('src/pages/CharacterPage.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: 'login',
        name: 'login',
        component: () => import('src/pages/LoginPage.vue'),
      },

      {
        path: 'register',
        name: 'register',
        component: () => import('src/pages/RegisterPage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
