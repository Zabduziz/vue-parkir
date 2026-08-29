<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { isAuthenticated, isAdmin, logout } = useAuth();

function handleLogout() {
    logout();
    router.push("/login");
}
</script>

<template>
    <div class="sidebar d-flex flex-column bg-dark text-white">
        <div class="sidebar-brand p-3 border-bottom border-secondary">
            <h5 class="mb-0">
                <i class="bi bi-shop me-2"></i>
                Parkir Management
            </h5>
        </div>

        <ul v-if="isAuthenticated" class="nav flex-column mt-3 px-2">
            <li class="nav-item mb-1">
                <router-link
                    to="/dashboard"
                    class="nav-link text-white d-flex align-items-center gap-2"
                    active-class="active-menu"
                >
                    <i class="bi bi-grid-fill"></i>
                    <span>Dashboard</span>
                </router-link>
            </li>
            <li class="nav-item mb-1">
                <router-link
                    to="/streaming"
                    class="nav-link text-white d-flex align-items-center gap-2"
                    active-class="active-menu"
                >
                    <i class="bi bi-camera-video-fill"></i>
                    <span>Camera</span>
                </router-link>
            </li>
            <li class="nav-item mb-1">
                <router-link
                    to="/gagal-verifikasi"
                    class="nav-link text-white d-flex align-items-center gap-2"
                    active-class="active-menu"
                >
                    <i class="bi bi-x-octagon-fill"></i>
                    <span>Gagal Verifikasi</span>
                </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item mb-1">
                <router-link
                    to="/users"
                    class="nav-link text-white d-flex align-items-center gap-2"
                    active-class="active-menu"
                >
                    <i class="bi bi-people-fill"></i>
                    <span>Data User</span>
                </router-link>
            </li>
        </ul>

        <div class="mt-auto p-3 border-top border-secondary">
            <router-link
                v-if="!isAuthenticated"
                to="/login"
                class="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            >
                <i class="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
            </router-link>
            <button
                v-else
                class="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                @click="handleLogout"
            >
                <i class="bi bi-box-arrow-right"></i>
                <span>Logout</span>
            </button>
            <small class="text-secondary d-block text-center mt-2">v1.0.0</small>
        </div>
    </div>
</template>

<style scoped>
.sidebar {
    width: 250px;
    min-height: 100vh;
    flex-shrink: 0;
}
.sidebar-brand {
    background: rgba(255, 255, 255, 0.05);
}
.nav-link {
    border-radius: 8px;
    padding: 0.6rem 1rem;
    transition: all 0.2s ease;
}
.nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
}
.active-menu {
    background-color: #0d6efd !important;
    font-weight: 500;
}
.active-menu i {
    color: #fff;
}
</style>
