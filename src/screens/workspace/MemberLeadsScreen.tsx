import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { getLeads } from '../../services/api';

export default function MemberLeadsScreen({ route }: any) {
  const { workspaceId, memberId } = route.params;
  const [leads, setLeads] = useState<any[]>([]);

  const load = async () => {
    try {
      const data = await getLeads({ workspace_id: workspaceId, owner_id: memberId });
      setLeads(data.data || data);
    } catch (e) { console.warn(e); }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Member Leads</Text>
      <FlatList
        data={leads}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10 }}>
            <Card.Title title={item.name} subtitle={item.phone} />
            <Card.Content>
              <Text>{item.lead_type} • {item.deal_value}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
