// webpack 打包入口文件
import Vue from 'vue';
import App from './App';
import router from './router';
import http from '../../utils/http';

Vue.prototype.$http = http; // 引入前后端交互工具

// 开始创建Vue实例
new Vue({
  el: '#app',
  components: { App },
  router, // 注入路由
  template: '<App />',
  data: {
    addList: null,
    editAdd: null,
    selectedAdd: null,
    deliverType: 'inStore',
  },
});
