import { createRouter, createMemoryHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

import TheDashboard from "../views/TheDashboard.vue";
import TheLoginForm from "../views/TheLoginForm.vue";
import TheStreaming from "../views/TheStreaming.vue";
import TheUsers from "../views/TheUsers.vue";
import TheGagalVerifikasi from "../views/TheGagalVerifikasi.vue";

const routes = [
  { path: "/", component: TheDashboard },
  { path: "/dashboard", component: TheDashboard },
  { path: "/streaming", name: "streaming", component: TheStreaming },
  { path: "/users", name: "users", component: TheUsers },
  { path: "/gagal-verifikasi", name: "gagal-verifikasi", component: TheGagalVerifikasi },
  { path: "/login", name: "login", component: TheLoginForm },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const protectedRoutes = ["/", "/dashboard", "/streaming", "/users", "/gagal-verifikasi"];
const adminRoutes = ["/users"];

router.beforeEach((to) => {
  if (protectedRoutes.includes(to.path)) {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated.value) {
      return { path: "/login" };
    }
    if (adminRoutes.includes(to.path) && !isAdmin.value) {
      return { path: "/dashboard" };
    }
  }
});

export default router;
