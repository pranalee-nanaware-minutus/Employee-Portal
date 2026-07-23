import { api } from './axios'
import { useAuthStore } from '../stores/authStore'
import type { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth'

export const authService = {
  
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials)
    const { token, user } = response.data
    
    useAuthStore.getState().setAuth(user, token)
    
    return response.data
  },
  
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/signup', credentials)
    const { token, user } = response.data
    
    useAuthStore.getState().setAuth(user, token)
    
    return response.data
  },
  
  logout() {
    useAuthStore.getState().logout()
  },
  
  async validateToken(): Promise<boolean> {
    try {
      const token = useAuthStore.getState().token
      
      if (!token) {
        return false
      }
      
      // Verify token with backend
      await api.get('/me')
      
      return true
    } catch (error) {
      useAuthStore.getState().logout()
      return false
    }
  }
}