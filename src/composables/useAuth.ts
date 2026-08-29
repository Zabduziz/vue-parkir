import { ref, computed } from "vue";

export const API_BASE = import.meta.env.VITE_API_BASE;

export interface User {
    id: number;
    nama: string;
    username: string;
    role: "admin" | "petugas";
}

const token = ref<string | null>(localStorage.getItem("jwt"));
const user = ref<User | null>(loadUser());

function loadUser(): User | null {
    try {
        const raw = localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

export function useAuth() {
    const isAuthenticated = computed(() => token.value !== null);
    const isAdmin = computed(() => user.value?.role === "admin");

    function setToken(newToken: string | null) {
        token.value = newToken;
        if (newToken) {
            localStorage.setItem("jwt", newToken);
        } else {
            localStorage.removeItem("jwt");
        }
    }

    function setUser(newUser: User | null) {
        user.value = newUser;
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
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
        setUser(data.user ?? null);
        return data;
    }

    async function register(
        name: string,
        username: string,
        password: string,
        role: string,
    ) {
        const res = await authFetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama: name, username, password, role }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: "Register failed" }));
            throw new Error(err.message || "Register failed");
        }
        return await res.json();
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
        const headers = new Headers(options.headers);
        if (token.value) {
            headers.set("Authorization", `Bearer ${token.value}`);
        }
        return fetch(url, { ...options, headers });
    }

    return { token, user, isAuthenticated, isAdmin, login, register, logout, authFetch, setUser };
}
