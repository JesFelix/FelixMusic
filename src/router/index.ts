/**
 * FelixMusic 路由配置
 *
 * 所有页面作为 MainLayout 的子路由，
 * 通过 <router-view> 渲染在内容区域。
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/favorites', // 访问 / 时重定向到 /selected
      component: () => import('@/layouts/MainLayout/index.vue'),
      children: [
        {
          path: 'theme-setting',
          name: 'ThemeSetting',
          component: () => import('@/views/theme-setting/index.vue'),
        },
        {
          path: 'selected',
          name: 'Selected',
          component: () => import('@/views/selected/index.vue'),
        },
        {
          path: 'collection',
          name: 'Collection',
          component: () => import('@/views/collection/index.vue'),
        },
        {
          path: 'favorites',
          name: 'Favorites',
          component: () => import('@/views/favorites/index.vue'),
        },
        {
          path: 'local-music',
          name: 'LocalMusic',
          component: () => import('@/views/local-music/index.vue'),
          redirect: '/local-music/all',
          children: [
            {
              path: 'all',
              name: 'LocalMusicAll',
              component: () => import('@/views/local-music/models/AllSong.vue'),
            },
            {
              path: 'folder',
              name: 'LocalMusicFolder',
              component: () => import('@/views/local-music/models/FileSong.vue'),
            },
          ],
        },
        {
          path: 'recently-played',
          name: 'RecentlyPlayed',
          component: () => import('@/views/recently-played/index.vue'),
        },
        {
          path: 'sys-setting',
          name: 'SysSetting',
          component: () => import('@/views/sys-setting/index.vue'),
        },
        {
          path: 'test-page',
          name: 'TestPage',
          component: () => import('@/views/test-page/index.vue'),
        }
        // TODO: 其他页面路由在此扩展
      ],
    },
    {
      path: '/play',
      name: 'Play',
      component: () => import('@/layouts/PlayLayout/index.vue')
    }
  ],
})

export default router
