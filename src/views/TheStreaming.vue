<script setup lang="ts"></script>

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
                            src="http://127.0.0.1:3000/stream-in"
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
                            src="http://127.0.0.1:3000/stream-out"
                            class="camera-img w-100"
                            alt="Camera OUT"
                        />
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
</style>
