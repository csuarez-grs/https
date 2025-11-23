<template>
    <section class="dashboard-header">
        <nav>
            <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/admin-dashboard">Admin Dashboard</a></li>
            </ul>
            <span v-if="username" class="user-info">Welcome, {{ username }} (Admin)</span>
        </nav>
    </section>
    <section class="dashboard-content">
        <h1>Admin Dashboard</h1>
        <p>This is the <strong>admin-only</strong> dashboard for user: {{ username }}</p>
        <!-- Add more admin dashboard features here -->
    </section>
</template>

<script setup lang="ts">
defineProps<{ username?: string }>();
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

.dashboard-content {
    padding: 2rem;
}
</style>
