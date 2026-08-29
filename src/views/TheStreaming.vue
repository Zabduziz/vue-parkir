<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { API_BASE } from "../composables/useAuth";

const streamInUrl = `${API_BASE}/stream/in`;
const streamOutUrl = `${API_BASE}/stream/out`;

interface StreamStatus {
    gambarMasukPath: string;
    responseCode: number;
    similarity: number;
    status: string;
    targetPlate: string;
}

const statusData = ref<StreamStatus | null>(null);
const statusError = ref("");
let pollTimer: ReturnType<typeof setInterval> | null = null;

function replaceLocalhost(url: string): string {
    return url.replace(/http:\/\/localhost:\d+/, API_BASE);
}

async function fetchStatus() {
    try {
        const res = await fetch(`${API_BASE}/stream/status`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: StreamStatus = await res.json();
        data.gambarMasukPath = replaceLocalhost(data.gambarMasukPath);
        statusData.value = data;
        statusError.value = "";
    } catch (e) {
        statusError.value = (e as Error).message;
    }
}

onMounted(() => {
    fetchStatus();
    pollTimer = setInterval(fetchStatus, 5000);
});

onUnmounted(() => {
    if (pollTimer) clearInterval(pollTimer);
});
</script>

<template>
    <div class="py-4">
        <h4 class="fw-bold mb-4">
            <i class="bi bi-camera-video-fill me-2"></i>Live Camera
        </h4>

        <div class="row g-4">
            <div class="col-lg-6">
                <div class="card border-0 shadow-sm h-100">
                    <div
                        class="card-header bg-success text-white d-flex align-items-center gap-2 py-3"
                    >
                        <span class="live-dot"></span>
                        <h5 class="mb-0 fw-semibold">Camera - IN</h5>
                        <span class="badge bg-light text-success ms-auto small"
                            >LIVE</span
                        >
                    </div>
                    <div class="card-body p-0">
                        <img
                            :src="streamInUrl"
                            class="camera-img w-100"
                            alt="Camera IN"
                        />
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card border-0 shadow-sm h-100">
                    <div
                        class="card-header bg-danger text-white d-flex align-items-center gap-2 py-3"
                    >
                        <span class="live-dot"></span>
                        <h5 class="mb-0 fw-semibold">Camera - OUT</h5>
                        <span class="badge bg-light text-danger ms-auto small"
                            >LIVE</span
                        >
                    </div>
                    <div class="card-body p-0">
                        <img
                            :src="streamOutUrl"
                            class="camera-img w-100"
                            alt="Camera OUT"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <div class="card border-0 shadow-sm">
                <div
                    class="card-header bg-primary text-white d-flex align-items-center gap-2 py-3"
                >
                    <i class="bi bi-info-circle-fill"></i>
                    <h5 class="mb-0 fw-semibold">Stream Status</h5>
                </div>
                <div class="card-body">
                    <div v-if="statusError" class="alert alert-danger mb-0">
                        Gagal memuat status: {{ statusError }}
                    </div>
                    <div
                        v-else-if="statusData"
                        class="row g-3 align-items-center"
                    >
                        <div class="col-md-5">
                            <img
                                :src="statusData.gambarMasukPath"
                                alt="Gambar Masuk"
                                class="img-fluid rounded status-img"
                            />
                        </div>
                        <div class="col-md-7">
                            <table class="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td class="fw-semibold text-muted">
                                            Target Plat
                                        </td>
                                        <td class="fw-bold">
                                            {{ statusData.targetPlate }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold text-muted">
                                            Status
                                        </td>
                                        <td>
                                            <span
                                                :class="
                                                    statusData.status ===
                                                    'MANUAL_OVERRIDE'
                                                        ? 'badge bg-warning text-dark'
                                                        : 'badge bg-success'
                                                "
                                            >
                                                {{ statusData.status }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold text-muted">
                                            Response Code
                                        </td>
                                        <td>
                                            <span
                                                :class="
                                                    statusData.responseCode ===
                                                    200
                                                        ? 'text-success'
                                                        : 'text-danger'
                                                "
                                                class="fw-bold"
                                            >
                                                {{ statusData.responseCode }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold text-muted">
                                            Similarity
                                        </td>
                                        <td>
                                            <div
                                                class="progress"
                                                style="height: 24px"
                                            >
                                                <div
                                                    class="progress-bar"
                                                    :class="
                                                        statusData.similarity >=
                                                        0.7
                                                            ? 'bg-success'
                                                            : statusData.similarity >=
                                                              0.4
                                                              ? 'bg-warning'
                                                              : 'bg-danger'
                                                    "
                                                    role="progressbar"
                                                    :style="
                                                        'width: ' +
                                                        (
                                                            statusData.similarity *
                                                            100
                                                        ).toFixed(1) +
                                                        '%'
                                                    "
                                                    :aria-valuenow="
                                                        statusData.similarity *
                                                        100
                                                    "
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    {{
                                                        (
                                                            statusData.similarity *
                                                            100
                                                        ).toFixed(1)
                                                    }}%
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div v-else class="text-center text-muted py-4">
                        <div class="spinner-border spinner-border-sm me-2"></div>
                        Memuat status...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.live-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #fff;
    animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.3;
    }
}
.camera-img {
    display: block;
    max-height: 500px;
    object-fit: contain;
    background: #000;
}
.status-img {
    max-height: 300px;
    object-fit: contain;
    background: #000;
}
</style>
