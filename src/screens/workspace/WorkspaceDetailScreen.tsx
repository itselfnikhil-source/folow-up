import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, TextInput, List } from 'react-native-paper';
import { getWorkspaceMembers, inviteWorkspaceUser } from '../../services/api';

export default function WorkspaceDetailScreen({ route, navigation }: any) {
  const { workspaceId } = route.params;
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await getWorkspaceMembers(workspaceId);
      setMembers(Array.isArray(data) ? data : data.data || []);
    } catch (e) { console.warn(e); }
  };

  useEffect(() => { load(); }, []);

  const onInvite = async () => {
    if (!email.trim()) return Alert.alert('Validation', 'Email required');
    setLoading(true);
    try {
      await inviteWorkspaceUser(workspaceId, { email: email.trim(), role });
      setEmail('');
      setLoading(false);
      Alert.alert('Invitation sent');
      await load();
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Invite failed', e?.message || 'Error');
    }
  };

  const onSearch = () => {
    // client-side filter; in real app we'd call user search API
    const q = searchEmail.trim().toLowerCase();
    const results = members.filter((m) => (m.email || '').toLowerCase().includes(q) || (m.name || '').toLowerCase().includes(q));
    console.log('WorkspaceDetail search for', searchEmail, 'results:', results);
    if (results.length === 0) Alert.alert('No matches found');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workspace Members</Text>

      <Card style={{ marginBottom: 12 }}>
        <Card.Content>
          <TextInput placeholder="Search member by name or email" value={searchEmail} onChangeText={setSearchEmail} style={{ marginBottom: 8 }} keyboardType="email-address" />
          <Button mode="outlined" onPress={onSearch} style={{ marginBottom: 8 }}>Search</Button>

          <TextInput placeholder="Invite by email" value={email} onChangeText={setEmail} style={{ marginBottom: 8 }} keyboardType="email-address" />
          <Button mode="contained" onPress={onInvite} loading={loading}>Send Invite</Button>
        </Card.Content>
      </Card>

      {members.map((m) => (
        <List.Item
          key={m.id}
          title={m.name || m.email}
          description={m.email}
          left={(p) => <List.Icon {...p} icon="account" />}
          onPress={() => navigation.navigate('MemberLeads', { workspaceId, memberId: m.id })}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
