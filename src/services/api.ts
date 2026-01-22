import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/env';

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================= TOKEN INTERCEPTOR + REQUEST LOGGING ================= */

api.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Redact sensitive fields before logging
  let loggedData: any = undefined;
  try {
    if (config.data) {
      const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      if (data && data.id_token) {
        loggedData = { ...data, id_token: `[REDACTED:${String(data.id_token).length}chars]` };
      } else {
        loggedData = data;
      }
    }
  } catch (e) {
    loggedData = '[unserializable]';
  }

  console.debug('API Request', { method: config.method, url: config.url, data: loggedData });

  return config;
});

/* ================= AUTH HELPERS ================= */

// `googleLogin` helper removed — `authService.socialLogin()` is used instead

export const emailLogin = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  await AsyncStorage.setItem('authToken', res.data.token);
  await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

export const setPassword = async (
  password: string,
  password_confirmation: string
) => {
  const res = await api.post('/auth/set-password', {
    password,
    password_confirmation,
  });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/me');
  return res.data;
};

export const updateProfile = async (payload: { name?: string; email?: string }) => {
  const res = await api.patch('/me', payload);
  return res.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('user');
};

/* ================= LEADS ================= */

export const getLeads = async (params = {}) => {
  const res = await api.get('/leads', { params });
  return res.data;
};

export const createLead = async (payload: {
  name: string;
  phone: string;
  workspace_id?: number;
  lead_type?: string;
  deal_value?: number;
  meta?: object;
}) => {
  const res = await api.post('/leads', payload);
  return res.data;
};

export const getLead = async (id: number) => {
  const res = await api.get(`/leads/${id}`);
  return res.data;
};

export const getLeadNotes = async (leadId: number) => {
  const res = await api.get(`/leads/${leadId}/notes`);
  return res.data;
};

export const addLeadNote = async (leadId: number, note: { body: string }) => {
  const res = await api.post(`/leads/${leadId}/notes`, note);
  return res.data;
};

export const createLeadReminder = async (leadId: number, payload: { remind_at: string; note?: string }) => {
  const res = await api.post(`/leads/${leadId}/reminders`, payload);
  return res.data;
};

export const getLeadTypes = async () => {
  const res = await api.get('/masters/lead-types');
  return res.data;
};

export const getWorkspaces = async () => {
  const res = await api.get('/workspaces');
  return res.data;
};

export const getWorkspaceInvitations = async () => {
  const res = await api.get('/workspace-invitations');
  return res.data;
};

export const acceptWorkspaceInvitation = async (inviteId: number) => {
  const res = await api.post(`/workspace-invitations/${inviteId}/accept`);
  return res.data;
};

export const rejectWorkspaceInvitation = async (inviteId: number) => {
  const res = await api.post(`/workspace-invitations/${inviteId}/reject`);
  return res.data;
};

export const getWorkspaceMembers = async (workspaceId: number) => {
  const res = await api.get(`/workspaces/${workspaceId}/members`);
  return res.data;
};

export const inviteWorkspaceUser = async (
  workspaceId: number,
  payload: { email: string; role?: string }
) => {
  const res = await api.post(`/workspaces/${workspaceId}/invite`, payload);
  return res.data;
};

/* ================= EXPORT AXIOS INSTANCE ================= */

export default api;
