<template>
    <div class="profile-form">
        <h2>Update Profile</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" counter="50" v-model="form.name" required />
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="form.email" required />
            </div>
            <div class="form-group">
                <label for="bio">Biography:</label>
                <textarea id="bio" rows="5" cols="40" counter="500" v-model="form.bio" required></textarea>
            </div>
            <button type="submit">Update Profile</button>
            <p v-if="error" class="error">{{ error }}</p>   
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../stores/auth';

export default defineComponent({
    name: 'ProfileForm',
    setup() {
        const form = ref({
            name: '',
            email: '',
            bio: ''
        });
        const error = ref('');
        const router = useRouter();

        // read existing user data to pre-fill the form
        const user = authStore.state.user;
        if (user) {
            form.value.name = user.name || '';
            form.value.email = user.email || '';
            form.value.bio = user.bio || '';
        }

        const handleSubmit = async () => {
            error.value = '';
            if (!form.value.name || !form.value.email || !form.value.bio) {
                error.value = 'Please fill in all required fields.';
                return;
            }

            try {
                let response = await fetch('http://locahost:2022/api/user/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form.value)
                });
                router.push('/dashboard');
            } catch (err) {
                error.value = 'An error occurred while updating the profile.';
            }
        };

        return {
            form,
            error,
            handleSubmit
        };
    }
});
</script>

<style scoped>
.profile-form {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
}

.profile-form h2 {
    margin-bottom: 1rem;
}

.profile-form form>div {
    margin-bottom: 1rem;
}

.profile-form label {
    display: block;
    margin-bottom: 0.5rem;
}

.profile-form input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
}

.profile-form button {
    margin-top: 1rem;
    width: 100%;
    padding: 0.75rem;
    background: #42b983;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.profile-form .error {
    color: #d32f2f;
    margin-top: 1rem;
}


</style>
