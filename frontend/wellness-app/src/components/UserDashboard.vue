<template>
  <section class="dashboard-header">
    <nav>
      <ul>
        <li><RouterLink to="/home">Home</RouterLink></li>
        <li v-if="isAuthenticated"><RouterLink :to="`/dashboard/${displayName || username}`">Dashboard</RouterLink></li>
        <li v-if="!isAuthenticated"><RouterLink to="/login">Login</RouterLink></li>
        <li v-else><button class="link-button" type="button" @click="handleLogout">Logout</button></li>
      </ul>
      <span v-if="isAuthenticated" class="user-info">Welcome, {{ displayName || 'User' }}</span>
    </nav>
  </section>
  <section class="dashboard-content">
    <h1>User Dashboard</h1>
    <p>This is the dashboard for: </p>
    <dl>
      <dt>Name:</dt>
      <dd>{{ displayName || username }}</dd>
      <dt>Email:</dt>
      <dd>{{ email }}</dd>
      <dt>Bio:</dt>
      <dd>{{ bio }}</dd>
    </dl>
    <a class="link-button" href="/profile">Edit Profile</a>
    <!-- Add more user dashboard features here -->
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
.dashboard-content dl {
  display: grid;
  grid-template-columns: max-content auto;
  gap: 0.5rem 1rem;
}
.dashboard-content dt {
  font-weight: bold;
}
.dashboard-content dd {
  margin: 0;
}
.dashboard-content a.link-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
