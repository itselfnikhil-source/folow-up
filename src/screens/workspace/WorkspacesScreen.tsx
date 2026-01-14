import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, TextInput, List } from 'react-native-paper';
import { getWorkspaces } from '../../services/api';
import authService from '../../services/authService';

export default function WorkspacesScreen({ navigation }: any) {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const load = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!name.trim()) return Alert.alert('Validation', 'Workspace name required');
    setCreating(true);
    try {
      const created = await authService.createWorkspace(name.trim());
      setName('');
      setCreating(false);
      await load();
      Alert.alert('Workspace created');
      // navigate to workspace detail for further actions
      navigation.navigate('WorkspaceDetail', { workspaceId: created.id });
    } catch (e: any) {
      setCreating(false);
      Alert.alert('Create failed', e?.message || 'Error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workspaces</Text>

      <Card style={{ marginBottom: 12 }}>
        <Card.Content>
          <Text style={{ marginBottom: 6 }}>Create a new workspace to organize leads and teams.</Text>
          <TextInput placeholder="Workspace name" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
          <Button mode="contained" onPress={onCreate} loading={creating}>Create Workspace</Button>
        </Card.Content>
      </Card>

      {workspaces.map((w) => (
        <List.Item
          key={w.id}
          title={w.name}
          description={`${w.members_count ?? 0} members`}
          left={(props) => <List.Icon {...props} icon="office-building" />}
          onPress={() => navigation.navigate('WorkspaceDetail', { workspaceId: w.id })}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
