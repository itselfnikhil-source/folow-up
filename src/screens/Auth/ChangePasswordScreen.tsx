import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { setPassword } from '../../services/api';

export default function ChangePasswordScreen({ navigation }: any) {
  const [password, setPasswordState] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (password.length < 8) {
      Alert.alert('Validation', 'Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await setPassword(password, confirm);
      setLoading(false);
      Alert.alert('Password updated');
      navigation.goBack();
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Update failed', e?.message || 'Error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>
      <TextInput label="New password" secureTextEntry value={password} onChangeText={setPasswordState} style={{ marginBottom: 10 }} />
      <TextInput label="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm} style={{ marginBottom: 10 }} />
      <Button mode="contained" onPress={onSave} loading={loading}>Save</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
