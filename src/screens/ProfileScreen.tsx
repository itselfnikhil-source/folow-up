import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { getCurrentUser, updateProfile } from '../services/api';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;
        setName(user.name ?? '');
        setEmail(user.email ?? '');
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ name, email });
      setLoading(false);
      Alert.alert('Success', 'Profile updated');
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Update failed', err?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <Button mode="contained" onPress={onSave} loading={loading} style={{ marginTop: 12 }}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  header: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 16 },
  input: { marginBottom: 12, backgroundColor: 'transparent' },
});
