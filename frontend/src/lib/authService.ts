import apiClient from './api';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User 
} from '@/types';

/**
 * Authentication service for user login and registration
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.removeToken();
  }

  /**
   * Get current user from token
   */
  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      this.removeToken();
      return null;
    }
  }

  /**
   * Store token in localStorage
   */
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Remove token from localStorage
   */
  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
