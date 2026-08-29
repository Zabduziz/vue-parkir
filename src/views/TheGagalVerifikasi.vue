<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuth, API_BASE } from "../composables/useAuth";

interface GagalItem {
    id: number;
    platNomor: string;
    gambarGagalPath: string;
    similarity: number;
    waktuValidasi: string;
}

const gagalList = ref<GagalItem[]>([]);
const isLoading = ref(true);
const errorMessage = ref("");
const selectedImage = ref("");
const searchQuery = ref("");

const filteredList = computed(() => {
    if (!searchQuery.value.trim()) return gagalList.value;
    const q = searchQuery.value.toLowerCase();
    return gagalList.value.filter(
        (item) =>
            item.platNomor?.toLowerCase().includes(q) ||
            item.id?.toString().includes(q),
    );
});

const totalGagal = computed(() => gagalList.value.length);

const { authFetch } = useAuth();

function imageUrl(path: string): string {
    if (!path) return "";
    try {
        const url = new URL(path, API_BASE);
        return `${API_BASE}${url.pathname}`;
    } catch {
        return `${API_BASE}/${path.replace(/^\//, "")}`;
    }
}

const fetchGagal = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = "";
        const response = await authFetch(`${API_BASE}/parkir/gagal`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        gagalList.value = result.data;
    } catch (error: any) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchGagal();
});
</script>

<template>
    <div class="py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">
                <i class="bi bi-x-octagon-fill me-2"></i>Gagal Verifikasi
            </h4>
            <button
                class="btn btn-outline-primary btn-sm"
                @click="fetchGagal"
                :disabled="isLoading"
            >
                <i class="bi bi-arrow-clockwise me-1"></i>Refresh
            </button>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm bg-danger text-white">
                    <div class="card-body d-flex align-items-center gap-3">
                        <i class="bi bi-x-circle fs-1"></i>
                        <div>
                            <h6 class="card-title mb-0">Total Gagal</h6>
                            <span class="fs-3 fw-bold">{{ totalGagal }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm">
            <div
                class="card-header bg-white d-flex justify-content-between align-items-center py-3"
            >
                <h5 class="mb-0 fw-semibold">Data Gagal Verifikasi</h5>
                <div
                    class="input-group input-group-sm"
                    style="max-width: 280px"
                >
                    <span class="input-group-text bg-white"
                        ><i class="bi bi-search"></i
                    ></span>
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Cari plat nomor..."
                        v-model="searchQuery"
                    />
                </div>
            </div>
            <div class="card-body p-0">
                <div v-if="isLoading" class="text-center py-5">
                    <div class="spinner-border text-primary mb-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-muted mb-0">Memuat data gagal verifikasi...</p>
                </div>

                <div v-else-if="errorMessage" class="alert alert-danger m-3">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i
                    >{{ errorMessage }}
                </div>

                <div
                    v-else-if="filteredList.length === 0"
                    class="text-center py-5"
                >
                    <i class="bi bi-inbox fs-1 text-muted"></i>
                    <p class="text-muted mt-2 mb-0">
                        Tidak ada data gagal verifikasi ditemukan
                    </p>
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-hover table-striped mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Plat Nomor</th>
                                <th>Similarity</th>
                                <th>Waktu Validasi</th>
                                <th>Gambar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredList" :key="item.id">
                                <td>{{ item.id }}</td>
                                <td class="fw-medium">{{ item.platNomor }}</td>
                                <td>{{ item.similarity }}</td>
                                <td>{{ item.waktuValidasi }}</td>
                                <td>
                                    <button
                                        class="btn btn-sm btn-outline-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#gagalImageModal"
                                        @click="
                                            selectedImage = imageUrl(item.gambarGagalPath)
                                        "
                                    >
                                        <i class="bi bi-image me-1"></i>Lihat
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Image Modal -->
    <div
        class="modal fade"
        id="gagalImageModal"
        tabindex="-1"
        aria-labelledby="gagalImageModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="gagalImageModalLabel">
                        <i class="bi bi-image me-2"></i>Gambar Gagal Verifikasi
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body text-center p-0">
                    <img
                        v-if="selectedImage"
                        :src="selectedImage"
                        class="img-fluid w-100"
                        :alt="selectedImage"
                    />
                </div>
                <div class="modal-footer border-0 justify-content-center">
                    <button
                        type="button"
                        class="btn btn-secondary px-4"
                        data-bs-dismiss="modal"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
