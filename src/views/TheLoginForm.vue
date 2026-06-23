<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { login } = useAuth();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const handleLogin = async () => {
    errorMsg.value = "";
    loading.value = true;
    try {
        await login(username.value, password.value);
        router.push("/");
    } catch (err: any) {
        errorMsg.value = err.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
        <div class="card border-0 shadow" style="max-width: 420px; width: 100%;">
            <div class="card-body p-4">
                <div class="text-center mb-4">
                    <i class="bi bi-shop fs-1 text-primary"></i>
                    <h4 class="fw-bold mt-2">Parkir Management</h4>
                    <p class="text-muted small">Silakan login untuk melanjutkan</p>
                </div>

                <div v-if="errorMsg" class="alert alert-danger py-2 small">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i>{{ errorMsg }}
                </div>

                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label for="username" class="form-label fw-medium">Username</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                            <input
                                type="text"
                                class="form-control"
                                id="username"
                                v-model="username"
                                placeholder="Masukkan username"
                                required
                            />
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="password" class="form-label fw-medium">Password</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-lock"></i></span>
                            <input
                                type="password"
                                class="form-control"
                                id="password"
                                v-model="password"
                                placeholder="Masukkan password"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                        Login
                    </button>
                </form>

                <hr class="my-3" />
                <div class="text-center">
                    <router-link to="/register" class="btn btn-link text-decoration-none p-0">
                        <i class="bi bi-person-plus me-1"></i>Belum punya akun? Register
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
