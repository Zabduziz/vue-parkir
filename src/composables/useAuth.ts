import { ref, computed } from "vue";

const API_BASE = "http://127.0.0.1:3000";

const token = ref<string | null>(localStorage.getItem("jwt"));

export function useAuth() {
    const isAuthenticated = computed(() => token.value !== null);

    function setToken(newToken: string | null) {
        token.value = newToken;
        if (newToken) {
            localStorage.setItem("jwt", newToken);
        } else {
            localStorage.removeItem("jwt");
        }
    }

    async function login(username: string, password: string) {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: "Login failed" }));
            throw new Error(err.message || "Login failed");
        }
        const data = await res.json();
        setToken(data.token ?? data.accessToken ?? data.jwt);
        return data;
    }

    async function register(
        name: string,
        username: string,
        password: string,
        role: string,
    ) {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, password, role }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: "Register failed" }));
            throw new Error(err.message || "Register failed");
        }
        return await res.json();
    }

    function logout() {
        setToken(null);
    }

    async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
        const headers = new Headers(options.headers);
        if (token.value) {
            headers.set("Authorization", `Bearer ${token.value}`);
        }
        return fetch(url, { ...options, headers });
    }

    return { token, isAuthenticated, login, register, logout, authFetch };
}
