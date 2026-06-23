import { createRouter, createMemoryHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

import TheDashboard from "../views/TheDashboard.vue";
import TheLoginForm from "../views/TheLoginForm.vue";
import TheRegister from "../views/TheRegister.vue";
import TheStreaming from "../views/TheStreaming.vue";

const routes = [
  { path: "/", component: TheDashboard },
  { path: "/dashboard", component: TheDashboard },
  { path: "/streaming", name: "streaming", component: TheStreaming },
  { path: "/login", name: "login", component: TheLoginForm },
  { path: "/register", name: "register", component: TheRegister },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const protectedRoutes = ["/", "/dashboard", "/streaming"];

router.beforeEach((to) => {
  if (protectedRoutes.includes(to.path)) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated.value) {
      return { path: "/login" };
    }
  }
});

export default router;
