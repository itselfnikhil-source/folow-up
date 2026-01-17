import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import authService from '../services/authService';

export default function SettingsScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const u = await authService.getStoredUser();
      console.log('Stored user loaded in SettingsScreen:', u);
      setUser(u);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {user?.role === 'member' && (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Invitations')}>
          <Text style={styles.itemText}>Workspace Invitations</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.itemText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={async () => {
        try {
          await authService.logout();
          navigation.dispatch({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (e: any) {
          console.warn('Logout failed', e);
        }
      }}>
        <Text style={styles.itemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  header: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 16 },
  item: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  itemText: { color: '#fff', fontSize: 16 },
});
