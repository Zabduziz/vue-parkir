<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { register } = useAuth();

const name = ref("");
const username = ref("");
const password = ref("");
const role = ref("admin");
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref(false);

const handleRegister = async () => {
    errorMsg.value = "";
    loading.value = true;
    try {
        await register(name.value, username.value, password.value, role.value);
        successMsg.value = true;
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
                    <h4 class="fw-bold mt-2">Buat Akun Baru</h4>
                    <p class="text-muted small">Daftar untuk mengakses aplikasi</p>
                </div>

                <div v-if="successMsg" class="alert alert-success py-2 small">
                    <i class="bi bi-check-circle-fill me-1"></i>Registrasi berhasil! Silakan
                    <router-link to="/login" class="alert-link">login</router-link>.
                </div>

                <div v-if="errorMsg" class="alert alert-danger py-2 small">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i>{{ errorMsg }}
                </div>

                <form v-if="!successMsg" @submit.prevent="handleRegister">
                    <div class="mb-3">
                        <label for="name" class="form-label fw-medium">Nama</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person-badge"></i></span>
                            <input
                                type="text"
                                class="form-control"
                                id="name"
                                v-model="name"
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                        </div>
                    </div>

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

                    <div class="mb-3">
                        <label for="role" class="form-label fw-medium">Role</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
                            <select class="form-select" id="role" v-model="role">
                                <option value="admin">Admin</option>
                                <option value="petugas">Petugas</option>
                            </select>
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
                        <i v-else class="bi bi-person-plus me-2"></i>
                        Register
                    </button>
                </form>

                <hr class="my-3" />
                <div class="text-center">
                    <router-link to="/login" class="btn btn-link text-decoration-none p-0">
                        <i class="bi bi-box-arrow-in-right me-1"></i>Sudah punya akun? Login
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
