/**
 * Authentication Service
 * Handles user authentication, JWT token management, and API calls
 */

const API_URL = import.meta.env.VITE_API_URL; //|| 'http://localhost:3000/api';

class AuthService {
  /**
   * Login user with credentials
   * @param {string} username - User name
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and token
   */
  async register(username, password) {
    try {
      const response = await fetch(`/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Register failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  //login user
  async login(username, password) {
    try {
      const response = await fetch(`/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();

      // Store JWT token and user data
      if (data.token) {
        this.setToken(data.token);
        //this.setUser(data.user);
        this.setUser({ username });
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }



  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  }

  /**
   * Store JWT token
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Get stored JWT token
   * @returns {string|null} JWT token
   */
  getToken() {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Store user data
   * @param {Object} user - User data
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired (decode JWT)
    try {
      const payload = this.decodeToken(token);
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        // Token expired
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get authorization header for API requests
   * @returns {Object} Headers with authorization
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Make authenticated API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  async apiRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized - token might be invalid
      this.logout();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }
}

export default new AuthService();
