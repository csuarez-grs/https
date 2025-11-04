<template>
    <div class="login-register">
        <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
        <form @submit.prevent="handleSubmit">
            <div>
                <label>Email:</label>
                <input type="email" v-model="form.email" required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" v-model="form.password" required />
            </div>
            <div v-if="!isLogin">
                <label>Username:</label>
                <input type="text" v-model="form.username" required />
            </div>
            <div v-if="!isLogin">
                <label>Role:</label>
                <input type="text" v-model="form.role" required />
            </div>
            <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
        </form>
        <button @click="loginWithGoogle" class="google-btn">Login with Google</button>
        <button @click="toggleMode">
            {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'LoginRegister',
    emits: ['login-success'],
    setup(_, { emit }) {
        const isLogin = ref(true);
        const form = ref({
            email: '',
            password: '',
            username: '',
            role: ''
        });
        const error = ref('');
        const router = useRouter();

        const toggleMode = () => {
            isLogin.value = !isLogin.value;
            error.value = '';
            form.value = { email: '', password: '', username: '', role: '' };
        };


        const handleSubmit = async () => {
            error.value = '';
            if (!form.value.email || !form.value.password || (!isLogin.value && !form.value.username) || (!isLogin.value && !form.value.role)) {
                error.value = 'Please fill in all required fields.';
                return;
            }
            try {
                let response;
                if (isLogin.value) {
                    response = await fetch('http://localhost:2022/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: form.value.email,
                            password: form.value.password
                        })
                    });
                } else {
                    response = await fetch('http://localhost:2022/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: form.value.email,
                            password: form.value.password,
                            username: form.value.username,
                            role: form.value.role
                        })
                    });
                }
                const data = await response.json();
                if (!response.ok) {
                    error.value = data.message || 'Authentication failed.';
                    return;
                }
                const username = data.user?.username || data.user?.email;
                emit('login-success', username);
                router.push({ name: 'Home', params: { username } });
            } catch (err) {
                error.value = 'Server error. Please try again.';
            }
        };

        const loginWithGoogle = () => {
            window.location.href = "http://localhost:2022/auth/google";
        };

        return { isLogin, form, error, toggleMode, handleSubmit, loginWithGoogle };
    }
});
</script>

<style scoped>
.login-register {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
}

.login-register h2 {
    margin-bottom: 1rem;
}

.login-register form>div {
    margin-bottom: 1rem;
}

.login-register label {
    display: block;
    margin-bottom: 0.5rem;
}

.login-register input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
}

.login-register button {
    margin-top: 1rem;
    width: 100%;
    padding: 0.75rem;
    background: #42b983;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.login-register .error {
    color: #d32f2f;
    margin-top: 1rem;
}

.google-btn {
    background: #4285f4;
    color: #fff;
    margin-bottom: 1rem;
}
</style>
