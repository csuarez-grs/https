<template>
    <section class="dashboard-header">
        <nav>
            <ul>
                <li><RouterLink to="/home">Home</RouterLink></li>
                <li v-if="isAuthenticated"><RouterLink to="/admin-dashboard">Admin Dashboard</RouterLink></li>
                <li v-if="!isAuthenticated"><RouterLink to="/login">Login</RouterLink></li>
                <li v-else><button class="link-button" type="button" @click="handleLogout">Logout</button></li>
            </ul>
            <span v-if="isAuthenticated" class="user-info">Welcome, {{ displayName || 'Admin' }} (Admin)</span>
        </nav>
    </section>
    <section class="dashboard-content">
        <h1>Admin Dashboard</h1>
        <p>This is the <strong>admin-only</strong> dashboard for user:</p>
        <dl>
            <dt>Username:</dt>
            <dd>{{ displayName || username }}</dd>
            <dt>Email:</dt>
            <dd>{{ email }}</dd>
            <dt>Bio:</dt>
            <dd>{{ bio }}</dd>
        </dl>

        
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../stores/auth';

const props = defineProps<{ username?: string }>();

const router = useRouter();
const isAuthenticated = authStore.isAuthenticated;
const displayName = computed(() => authStore.state.user?.name || authStore.state.user?.username || props.username || '');
const email = computed(() => authStore.state.user?.email || '');
const bio = computed(() => authStore.state.user?.bio || 'No biography available.');

const handleLogout = async () => {
    try {
        await fetch('http://localhost:2022/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Logout failed', error);
    } finally {
        authStore.logout();
        router.push({ name: 'Login' });
    }
};
</script>

<style scoped>
.dashboard-header {
    background: #f5f5f5;
    padding: 1rem;
    border-bottom: 1px solid #ccc;
}

.dashboard-header nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    padding: 0;
}

.dashboard-header .user-info {
    float: right;
    font-weight: bold;
    margin-left: 2rem;
}
.link-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
}

.dashboard-content {
    padding: 2rem;
}
</style>
