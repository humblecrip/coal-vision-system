import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes.js";

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  next();
});

router.afterEach((to, from) => {
  const _title = to.meta._title;
  if (_title) {
    window.document.title = _title;
  }
});

export default router;
