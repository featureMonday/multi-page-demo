import Vue from 'vue';
import Router from 'vue-router';
import hello from './view/index';

Vue.use(Router); // 启用router插件
// 以下是路由配置
let router = new Router({
  base: '/multi-page-demo/pageA/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: hello,
    },
  ],
});

export default router;
