import './styles/main.scss';
import 'material-design-icons/iconfont/material-icons.css';

import 'bootstrap';
import 'babel-polyfill';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(Vuex);

var i18n = new VueI18n({
  locale: 'en_US',
  messages: {
    en_US: require('./i18n/en_US.yaml')
  }
});

var router = new VueRouter({
  routes: [
    ...['', ...require('./lib/library-entry-statuses.js').list].map((status) => ({
      path: '/' + status,
      component: require('./components/library.vue').default,
      props: {
        listStatus: status
      }
    })),
    {
      path: '/detail/:entryId',
      component: require('./components/entry-detail.vue').default,
      name: 'detail'
    }
  ]
});

var store = new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  }
});

// Change page title on each route change
router.afterEach((to, from) => {
  router.app.$nextTick(() => {
    let title;
    if (to.matched[0]) {
      title = to.matched[0].instances.default.pageTitle;
    } else {
      title = router.app.$t('application.page_not_found');
    }
    if (title) {
      document.title = `${title} - sedosipE`;
    } else {
      document.title = `sedosipE`;
    }
  });
});

var vm = new Vue({
  i18n,
  router,
  store,
  render: h => h(require('./components/app.vue').default)
}).$mount('#app');
