import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, List } from 'react-native-paper';
import { getWorkspaceInvitations, acceptWorkspaceInvitation, rejectWorkspaceInvitation } from '../../services/api';

export default function WorkspaceInvitationsScreen() {
  const [invites, setInvites] = useState<any[]>([]);

  const load = async () => {
    try {
      const data = await getWorkspaceInvitations();
      setInvites(data);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => { load(); }, []);

  const onAccept = async (id: number) => {
    try {
      await acceptWorkspaceInvitation(id);
      Alert.alert('Joined workspace');
      await load();
    } catch (e: any) {
      Alert.alert('Accept failed', e?.message || 'Error');
    }
  };

  const onReject = async (id: number) => {
    try {
      await rejectWorkspaceInvitation(id);
      Alert.alert('Invitation rejected');
      await load();
    } catch (e: any) {
      Alert.alert('Reject failed', e?.message || 'Error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workspace Invitations</Text>
      {invites.map((inv) => (
        <Card key={inv.id} style={{ marginBottom: 10 }}>
          <Card.Title title={inv.workspace?.name || 'Workspace'} subtitle={inv.message || ''} />
          <Card.Actions>
            <Button onPress={() => onAccept(inv.id)}>Accept</Button>
            <Button onPress={() => onReject(inv.id)}>Reject</Button>
          </Card.Actions>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
