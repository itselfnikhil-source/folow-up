import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { createLead } from '../../services/api';

export default function CreateLeadScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    if (!firstName || !phone) {
      Alert.alert('Validation', 'First name and phone are required');
      return;
    }

    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const payload: any = {
        name,
        phone,
        meta: { email, price, address, country, state, city, pincode },
      };

      await createLead(payload);
      setLoading(false);
      navigation.goBack();
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Create lead failed', err?.message || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Create Lead</Text>

        <TextInput label="First name" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <TextInput label="Last name" value={lastName} onChangeText={setLastName} style={styles.input} />
      <TextInput label="Phone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput label="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
      <TextInput label="Address" value={address} onChangeText={setAddress} style={styles.input} />
      <TextInput label="Country" value={country} onChangeText={setCountry} style={styles.input} />
      <TextInput label="State" value={state} onChangeText={setState} style={styles.input} />
      <TextInput label="City" value={city} onChangeText={setCity} style={styles.input} />
      <TextInput label="Pincode" value={pincode} onChangeText={setPincode} style={styles.input} keyboardType="numeric" />

        <Button mode="contained" onPress={onCreate} loading={loading} style={{ marginTop: 12, marginBottom: 24 }}>
          Create Lead
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { marginBottom: 10 },
});
