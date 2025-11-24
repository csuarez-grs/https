<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../stores/auth';

const props = defineProps<{ username?: string }>();

const router = useRouter();
const isAuthenticated = authStore.isAuthenticated;
const displayName = computed(() => authStore.state.user?.name || authStore.state.user?.username || props.username || '');

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

<template>
  <section class="header">
    <nav>
      <ul>
        <li><RouterLink to="/home">Home</RouterLink></li>
        <li v-if="isAuthenticated"><RouterLink :to="`/dashboard/${displayName || username}`">Dashboard</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
        <li v-if="!isAuthenticated"><RouterLink to="/login">Login</RouterLink></li>
        <li v-else><button class="link-button" type="button" @click="handleLogout">Logout</button></li>
      </ul>
      <span v-if="isAuthenticated" class="user-info">Logged in as: {{ displayName || 'User' }}</span>
    </nav>
  </section>
  <section class="hero">
      <h1>Wellness With You</h1>
      <p>Your journey to wellness starts here.</p>
      <img src="/wellness.jpg" alt="Wellness Image">
  </section>
  <section class="content">
      <h2>Your Wellness Message</h2>
      <p id="message"><span v-if="isAuthenticated" class="user-info">Welcome {{ displayName || 'User' }}</span></p>
  </section>

  <section class="posts">
      <h2>Posts</h2>
      <div id="posts-container">
          <!-- Posts will be dynamically loaded here -->
      </div>
  </section>
</template>

<style scoped>
logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.user-info {
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
</style>
