import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Menu, ActivityIndicator } from 'react-native-paper';
import { createLead, getLeadTypes } from '../../services/api';

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
  const [leadType, setLeadType] = useState('home_loan');
  const [menuVisible, setMenuVisible] = useState(false);
  const [leadTypes, setLeadTypes] = useState<Array<{ key: string; label: string }>>([
    { key: 'home_loan', label: 'Home Loan' },
    { key: 'car_loan', label: 'Car Loan' },
    { key: 'personal_loan', label: 'Personal Loan' },
  ]);
  const [loadingTypes, setLoadingTypes] = useState(false);

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
        lead_type: leadType,
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

  useEffect(() => {
    let mounted = true;
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await getLeadTypes();
        // Expecting array like [{ key: 'home_loan', label: 'Home Loan' }, ...] or simple strings
        if (!mounted) return;
        if (Array.isArray(res)) {
          const normalized = res.map((r: any) =>
            typeof r === 'string' ? { key: r, label: r.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) } : { key: r.key ?? r.id ?? String(r), label: r.label ?? r.name ?? String(r) }
          );
          setLeadTypes(normalized);
          if (normalized.length > 0) setLeadType(normalized[0].key);
        }
      } catch (err) {
        // keep defaults
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
    return () => { mounted = false; };
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 8, padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Create Lead</Text>

        <View style={{ marginBottom: 10 }}>
          {loadingTypes ? (
            <ActivityIndicator animating />
          ) : (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.input}>
                  {leadTypes.find(t => t.key === leadType)?.label ?? leadType}
                </Button>
              }
            >
              {leadTypes.map(t => (
                <Menu.Item key={t.key} onPress={() => { setLeadType(t.key); setMenuVisible(false); }} title={t.label} />
              ))}
            </Menu>
          )}
        </View>

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
