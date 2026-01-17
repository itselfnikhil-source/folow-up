import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ===================== TYPES ===================== */

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export type GoogleLoginParams = {
  idToken: string;
};

/* ===================== SERVICE ===================== */

class AuthService {
  async socialLogin(
    params: GoogleLoginParams
  ): Promise<AuthResponse> {
    try {
      // Log a redacted payload for debugging (avoid printing full id_token)
      console.debug('POST /auth/google payload', {
        id_token: params.idToken ? `[REDACTED:${params.idToken.length}chars]` : null,
      });

      const response = await api.post<AuthResponse>('/auth/google', {
        id_token: params.idToken,
      });

      // Log a redacted response for debugging
      console.debug('POST /auth/google response', {
        status: response.status,
        token: response.data?.token ? `[REDACTED:${String(response.data.token).length}chars]` : null,
        user: response.data?.user
          ? { id: response.data.user.id, email: response.data.user.email, name: response.data.user.name }
          : null,
      });

      // Save token & user
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async createWorkspace(name: string) {
    try {
      const res = await api.post('/workspaces', { name });
      // persist newly created workspace as current workspace
      try {
        await AsyncStorage.setItem('currentWorkspace', JSON.stringify(res.data));
      } catch (e) {
        console.warn('Failed to persist current workspace', e);
      }
      return res.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async setCurrentWorkspace(workspace: any) {
    await AsyncStorage.setItem('currentWorkspace', JSON.stringify(workspace));
  }

  async getStoredWorkspace() {
    const w = await AsyncStorage.getItem('currentWorkspace');
    return w ? JSON.parse(w) : null;
  }

  async logout() {
    try {
      // attempt server-side logout (token will be attached by interceptor)
      await api.post('/auth/logout');
    } catch (e) {
      // ignore server errors — proceed to clear local state
      console.warn('Server logout failed', e);
    }

    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('currentWorkspace');
  }

  async getStoredUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async getStoredToken() {
    return AsyncStorage.getItem('authToken');
  }

  private handleError(error: any): Error {
    if (error?.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    return new Error('Authentication failed');
  }
}

/* ===================== EXPORT ===================== */

export default new AuthService();
