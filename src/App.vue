<script setup lang="ts">
import { RouterView } from "vue-router";
import TheSideBar from "./components/TheSideBar.vue";
</script>

<template>
    <div class="d-flex">
        <TheSideBar />
        <main class="flex-grow-1 bg-light" style="min-height: 100vh;">
            <div class="container-fluid px-4">
                <router-view />
            </div>
        </main>
    </div>
</template>

<style>
body {
    background-color: #f8f9fc;
}
</style>
