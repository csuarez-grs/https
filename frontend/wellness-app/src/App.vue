<script setup lang="ts">
</script>

<template>
  <section class="header">
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
    </section>
    <section class="hero">
        <h1>Wellness With You</h1>
        <p>Your journey to wellness starts here.</p>
        <img src="/wellness.jpg" alt="Wellness Image">
    </section>
    <section class="content">
        <h2>Your Wellness Message</h2>
        <p id="message">{message}</p>
        <HelloWorld msg="Vite + Vue" />
    </section>

    <section class="posts">
        <h2>Posts</h2>
        <div id="posts-container">
            <!-- Posts will be dynamically loaded here -->
        </div>
    </section>
    <section class="footer">
        <p>&copy; 2025 Wellness With You. All rights reserved.</p>
    </section>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
