<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuth } from "../composables/useAuth";
import { API_BASE } from "../composables/useAuth";

interface User {
    id: number;
    nama: string;
    username: string;
    role: "admin" | "petugas";
}

type Role = "admin" | "petugas";

const { authFetch } = useAuth();

const usersList = ref<User[]>([]);
const isLoading = ref(true);
const errorMessage = ref("");
const successMessage = ref("");
const searchQuery = ref("");

const emptyAddForm = (): { nama: string; username: string; password: string; role: Role } => ({
    nama: "",
    username: "",
    password: "",
    role: "petugas",
});
const addForm = ref(emptyAddForm());
const addLoading = ref(false);
const addError = ref("");

const editForm = ref({ id: 0, nama: "", username: "", password: "", role: "petugas" as Role });
const editLoading = ref(false);
const editError = ref("");

const deleteTarget = ref<User | null>(null);
const deleteLoading = ref(false);
const deleteError = ref("");

const filteredList = computed(() => {
    if (!searchQuery.value.trim()) return usersList.value;
    const q = searchQuery.value.toLowerCase();
    return usersList.value.filter(
        (u) =>
            u.nama.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q),
    );
});

const totalUsers = computed(() => usersList.value.length);
const totalAdmin = computed(() => usersList.value.filter((u) => u.role === "admin").length);
const totalPetugas = computed(() => usersList.value.filter((u) => u.role === "petugas").length);

function notify(msg: string) {
    successMessage.value = msg;
    setTimeout(() => (successMessage.value = ""), 3000);
}

function closeModal(id: string) {
    const btn = document.querySelector(
        `#${id} .btn-close, #${id} [data-bs-dismiss="modal"]`,
    ) as HTMLElement | null;
    btn?.click();
}

const fetchUsers = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = "";
        const response = await authFetch(`${API_BASE}/users`);
        if (!response.ok) {
            throw new Error("Gagal mengambil data user");
        }
        const data = await response.json();
        usersList.value = data.data;
    } catch (error: any) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const submitAdd = async () => {
    addError.value = "";
    addLoading.value = true;
    try {
        const res = await authFetch(`${API_BASE}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addForm.value),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Gagal menambah user");
        }
        addForm.value = emptyAddForm();
        closeModal("addUserModal");
        notify("User berhasil ditambahkan");
        fetchUsers();
    } catch (err: any) {
        addError.value = err.message;
    } finally {
        addLoading.value = false;
    }
};

const openEdit = (user: User) => {
    editForm.value = {
        id: user.id,
        nama: user.nama,
        username: user.username,
        password: "",
        role: user.role,
    };
    editError.value = "";
};

const submitEdit = async () => {
    editError.value = "";
    editLoading.value = true;
    try {
        const res = await authFetch(`${API_BASE}/users/${editForm.value.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm.value),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Gagal memperbarui user");
        }
        closeModal("editUserModal");
        notify("User berhasil diperbarui");
        fetchUsers();
    } catch (err: any) {
        editError.value = err.message;
    } finally {
        editLoading.value = false;
    }
};

const openDelete = (user: User) => {
    deleteTarget.value = user;
    deleteError.value = "";
};

const submitDelete = async () => {
    if (!deleteTarget.value) return;
    deleteError.value = "";
    deleteLoading.value = true;
    try {
        const res = await authFetch(`${API_BASE}/users/${deleteTarget.value.id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Gagal menghapus user");
        }
        closeModal("deleteUserModal");
        deleteTarget.value = null;
        notify("User berhasil dihapus");
        fetchUsers();
    } catch (err: any) {
        deleteError.value = err.message;
    } finally {
        deleteLoading.value = false;
    }
};

onMounted(fetchUsers);
</script>

<template>
    <div class="py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">
                <i class="bi bi-people-fill me-2"></i>Data User
            </h4>
            <div class="d-flex gap-2">
                <button
                    class="btn btn-outline-primary btn-sm"
                    @click="fetchUsers"
                    :disabled="isLoading"
                >
                    <i class="bi bi-arrow-clockwise me-1"></i>Refresh
                </button>
                <button
                    class="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#addUserModal"
                >
                    <i class="bi bi-person-plus me-1"></i>Tambah User
                </button>
            </div>
        </div>

        <div v-if="successMessage" class="alert alert-success py-2 small">
            <i class="bi bi-check-circle-fill me-1"></i>{{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger py-2 small">
            <i class="bi bi-exclamation-triangle-fill me-1"></i>{{ errorMessage }}
        </div>

        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm bg-primary text-white">
                    <div class="card-body d-flex align-items-center gap-3">
                        <i class="bi bi-people fs-1"></i>
                        <div>
                            <h6 class="card-title mb-0">Total User</h6>
                            <span class="fs-3 fw-bold">{{ totalUsers }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm bg-success text-white">
                    <div class="card-body d-flex align-items-center gap-3">
                        <i class="bi bi-shield-check fs-1"></i>
                        <div>
                            <h6 class="card-title mb-0">Admin</h6>
                            <span class="fs-3 fw-bold">{{ totalAdmin }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm bg-info text-white">
                    <div class="card-body d-flex align-items-center gap-3">
                        <i class="bi bi-person-badge fs-1"></i>
                        <div>
                            <h6 class="card-title mb-0">Petugas</h6>
                            <span class="fs-3 fw-bold">{{ totalPetugas }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm">
            <div
                class="card-header bg-white d-flex justify-content-between align-items-center py-3"
            >
                <h5 class="mb-0 fw-semibold">Daftar User</h5>
                <div class="input-group input-group-sm" style="max-width: 280px">
                    <span class="input-group-text bg-white"
                        ><i class="bi bi-search"></i
                    ></span>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Cari user..."
                        v-model="searchQuery"
                    />
                </div>
            </div>
            <div class="card-body p-0">
                <div v-if="isLoading" class="text-center py-5">
                    <div class="spinner-border text-primary mb-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted mb-0">Memuat data user...</p>
                </div>

                <div v-else-if="filteredList.length === 0" class="text-center py-5">
                    <i class="bi bi-inbox fs-1 text-muted"></i>
                    <p class="text-muted mt-2 mb-0">Tidak ada data user ditemukan</p>
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-hover table-striped mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nama</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th class="text-end">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredList" :key="item.id">
                                <td>{{ item.id }}</td>
                                <td class="fw-medium">{{ item.nama }}</td>
                                <td>{{ item.username }}</td>
                                <td>
                                    <span
                                        class="badge rounded-pill"
                                        :class="
                                            item.role === 'admin'
                                                ? 'bg-primary'
                                                : 'bg-info'
                                        "
                                    >
                                        <i
                                            class="bi me-1"
                                            :class="
                                                item.role === 'admin'
                                                    ? 'bi-shield-check'
                                                    : 'bi-person-badge'
                                            "
                                        ></i>
                                        {{ item.role }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button
                                        class="btn btn-sm btn-outline-primary me-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editUserModal"
                                        @click="openEdit(item)"
                                    >
                                        <i class="bi bi-pencil-square me-1"></i>Edit
                                    </button>
                                    <button
                                        class="btn btn-sm btn-outline-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteUserModal"
                                        @click="openDelete(item)"
                                    >
                                        <i class="bi bi-trash me-1"></i>Hapus
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add User Modal -->
    <div
        class="modal fade"
        id="addUserModal"
        tabindex="-1"
        aria-labelledby="addUserModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="addUserModalLabel">
                        <i class="bi bi-person-plus me-2"></i>Tambah User
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <form @submit.prevent="submitAdd">
                    <div class="modal-body">
                        <div v-if="addError" class="alert alert-danger py-2 small">
                            <i class="bi bi-exclamation-triangle-fill me-1"></i>{{ addError }}
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">Nama</label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    ><i class="bi bi-person-badge"></i
                                ></span>
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="addForm.nama"
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">Username</label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    ><i class="bi bi-person"></i
                                ></span>
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="addForm.username"
                                    placeholder="Masukkan username"
                                    required
                                />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">Password</label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    ><i class="bi bi-lock"></i
                                ></span>
                                <input
                                    type="password"
                                    class="form-control"
                                    v-model="addForm.password"
                                    placeholder="Masukkan password"
                                    required
                                />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">Role</label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    ><i class="bi bi-shield-lock"></i
                                ></span>
                                <select class="form-select" v-model="addForm.role">
                                    <option value="petugas">Petugas</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary px-4"
                            :disabled="addLoading"
                        >
                            <span
                                v-if="addLoading"
                                class="spinner-border spinner-border-sm me-2"
                                role="status"
                            ></span>
                            <i v-else class="bi bi-check-lg me-2"></i>Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit User Modal -->
    <div
        class="modal fade"
        id="editUserModal"
        tabindex="-1"
        aria-labelledby="editUserModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="editUserModalLabel">
                        <i class="bi bi-pencil-square me-2"></i>Edit User
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <form @submit.prevent="submitEdit">
                    <div class="modal-body">
                        <div v-if="editError" class="alert alert-danger py-2 small">
                            <i class="bi bi-exclamation-triangle-fill me-1"></i>{{ editError }}
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">Nama</label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    ><i class="bi bi-person-badge"></i
                                ></span>
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="editForm.nama"
                                    required
                                />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">Username</label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    ><i class="bi bi-person"></i
                                ></span>
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="editForm.username"
                                    required
                                />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">
                                Password
                                <small class="text-muted">(kosongkan jika tidak diganti)</small>
                            </label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    ><i class="bi bi-lock"></i
                                ></span>
                                <input
                                    type="password"
                                    class="form-control"
                                    v-model="editForm.password"
                                    placeholder="Masukkan password baru"
                                />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-medium">Role</label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    ><i class="bi bi-shield-lock"></i
                                ></span>
                                <select class="form-select" v-model="editForm.role">
                                    <option value="petugas">Petugas</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary px-4"
                            :disabled="editLoading"
                        >
                            <span
                                v-if="editLoading"
                                class="spinner-border spinner-border-sm me-2"
                                role="status"
                            ></span>
                            <i v-else class="bi bi-check-lg me-2"></i>Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Delete User Modal -->
    <div
        class="modal fade"
        id="deleteUserModal"
        tabindex="-1"
        aria-labelledby="deleteUserModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="deleteUserModalLabel">
                        <i class="bi bi-trash me-2"></i>Hapus User
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    <p>
                        Yakin ingin menghapus user
                        <strong>{{ deleteTarget?.nama }}</strong>
                        ({{ deleteTarget?.username }})?
                    </p>
                    <div v-if="deleteError" class="alert alert-danger py-2 small">
                        <i class="bi bi-exclamation-triangle-fill me-1"></i>{{ deleteError }}
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger px-4"
                        :disabled="deleteLoading"
                        @click="submitDelete"
                    >
                        <span
                            v-if="deleteLoading"
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                        ></span>
                        <i v-else class="bi bi-trash me-2"></i>Hapus
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
