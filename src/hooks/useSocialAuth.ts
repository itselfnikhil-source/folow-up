import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import authService from '../services/authService';
import { OAUTH_CONFIG } from '../config/oauth.config';

interface AuthState {
  loading: boolean;
  error: string | null;
  user: any | null;
}

export function useSocialAuth() {
  const [state, setState] = useState<AuthState>({ loading: false, error: null, user: null });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: OAUTH_CONFIG.google.clientId,
      scopes: OAUTH_CONFIG.google.scopes,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const loginWithGoogle = async (options?: { isManager?: boolean; workspaceName?: string }) => {
    setState({ loading: true, error: null, user: null });

    try {
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      const userInfo = await GoogleSignin.signIn();

      // Ensure we have an idToken; prefer userInfo.idToken and fallback to getTokens() when available
      let idToken: string | undefined = (userInfo as any)?.idToken;

      if (!idToken && typeof (GoogleSignin as any).getTokens === 'function') {
        const tokens: any = await (GoogleSignin as any).getTokens();
        idToken = tokens?.idToken;
      }

      if (!idToken) throw new Error('No idToken returned from Google (check client configuration)');

      const result = await authService.socialLogin({ idToken });

      // If manager provided a workspace name, create workspace after login
      if (options?.isManager && options?.workspaceName) {
        try {
          const created = await authService.createWorkspace(options.workspaceName);
          // created workspace persisted in authService.createWorkspace
          // ensure stored workspace is set (redundant but explicit)
          await authService.setCurrentWorkspace(created);
        } catch (e) {
          // Non-fatal: workspace creation failed, but user is logged in
          console.warn('Create workspace failed', e);
        }
      }

      setState({ loading: false, error: null, user: result.user });
    } catch (err: any) {
      let message = err?.message || 'Google sign-in failed';

      if (err.code === statusCodes.SIGN_IN_CANCELLED) message = 'Sign in cancelled';
      if (err.code === statusCodes.IN_PROGRESS) message = 'Sign in already in progress';
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) message = 'Play services not available or outdated';

      setState({ loading: false, error: message, user: null });
    }
  };

  return { loading: state.loading, error: state.error, user: state.user, loginWithGoogle };
}
