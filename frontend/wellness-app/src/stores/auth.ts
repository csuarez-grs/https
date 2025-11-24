import { computed, reactive } from 'vue'

type User = {
  name?: string
  username?: string
  email: string
  role?: string
  bio?: string
}

type RegisteredUser = User & { password: string }

const getStoredUser = (): User | null => {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem('auth_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

const persistUser = (user: User | null) => {
  if (typeof localStorage === 'undefined') return
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('auth_user')
  }
}

const state = reactive<{
  user: User | null
  registered: RegisteredUser | null
}>({
  user: getStoredUser(),
  registered: null,
})

const sanitizeInput = (value: string) => value.replace(/[<>]/g, '').trim()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isAuthenticated = computed(() => !!state.user)

const setUser = (user: User | null) => {
  state.user = user
  persistUser(user)
}

const register = (name: string, email: string, password: string) => {
  const cleanName = sanitizeInput(name)
  const cleanEmail = sanitizeInput(email).toLowerCase()
  const cleanPassword = sanitizeInput(password)

  if (cleanName.length < 3 || cleanName.length > 50) {
    return { ok: false, error: 'Name must be between 3 and 50 characters.' }
  }

  if (!emailPattern.test(cleanEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  if (cleanPassword.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' }
  }

  state.registered = { name: cleanName, email: cleanEmail, password: cleanPassword }
  setUser({ name: cleanName, email: cleanEmail })
  return { ok: true }
}

const login = (email: string, password: string) => {
  const cleanEmail = sanitizeInput(email).toLowerCase()
  const cleanPassword = sanitizeInput(password)

  if (!emailPattern.test(cleanEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  if (cleanPassword.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' }
  }

  if (state.registered) {
    if (state.registered.email !== cleanEmail) {
      return { ok: false, error: 'Email is not registered.' }
    }
    if (state.registered.password !== cleanPassword) {
      return { ok: false, error: 'Invalid credentials.' }
    }
    setUser({ name: state.registered.name, email: state.registered.email, role: state.registered.role })
    return { ok: true }
  }

  // Fallback login when no registered user exists yet.
  setUser({ name: 'Member', email: cleanEmail })
  return { ok: true }
}

const logout = () => {
  setUser(null)
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('role')
  }
}

export const authStore = {
  state,
  isAuthenticated,
  setUser,
  register,
  login,
  logout,
}
