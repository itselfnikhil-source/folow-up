import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getLeads } from '../services/api';
import { Button } from 'react-native-paper';

export default function LeadsScreen({ navigation }: any) {
  const [leads, setLeads] = useState<any[]>([]);

  const load = async () => {
    try {
      const data = await getLeads();
      setLeads(data.data || data);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={styles.header}>Leads</Text>
        <Button mode="contained" onPress={() => navigation.navigate('CreateLead')}>+ Add</Button>
      </View>

      <FlatList
        data={leads}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.leadCard} onPress={() => navigation.navigate('LeadDetail', { id: item.id })}>
            <View>
              <Text style={styles.phone}>{item.name || item.phone}</Text>
              <Text style={styles.status}>{item.phone}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={26} color="#94A3B8" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16 },
  header: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 16 },
  leadCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phone: { color: '#fff', fontSize: 16, fontWeight: '600' },
  status: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
});
