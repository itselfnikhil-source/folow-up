import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Card, List } from 'react-native-paper';
import { getLead, getLeadNotes, addLeadNote, createLeadReminder } from '../../services/api';

export default function LeadDetailScreen({ route }: any) {
  const { id } = route.params;
  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await getLead(id);
      setLead(data);
      const n = await getLeadNotes(id);
      setNotes(n);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAddNote = async () => {
    if (!noteText.trim()) return;
    setLoading(true);
    try {
      await addLeadNote(id, { body: noteText });
      setNoteText('');
      await load();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Add note failed', e?.message || 'Error');
    }
  };

  const onCreateReminder = async () => {
    // For simplicity, create a reminder 24 hours later
    try {
      const remindAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await createLeadReminder(id, { remind_at: remindAt, note: 'Follow up' });
      Alert.alert('Reminder created');
    } catch (e: any) {
      Alert.alert('Create reminder failed', e?.message || 'Error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Lead Detail</Text>
      {lead && (
        <Card style={{ marginBottom: 12 }}>
          <Card.Title title={lead.name} subtitle={lead.phone} />
          <Card.Content>
            <Text>{lead.meta?.email}</Text>
            <Text>{lead.meta?.address}</Text>
          </Card.Content>
        </Card>
      )}

      <Card style={{ marginBottom: 12 }}>
        <Card.Title title="Activity" />
        <Card.Content>
          {notes.length === 0 && <Text>No activity yet</Text>}
          {notes.map((n: any) => (
            <List.Item key={n.id} title={n.body} description={new Date(n.created_at).toLocaleString()} />
          ))}
        </Card.Content>
      </Card>

      <TextInput label="Add note" value={noteText} onChangeText={setNoteText} multiline />
      <Button mode="contained" onPress={onAddNote} loading={loading} style={{ marginTop: 8 }}>
        Add Note
      </Button>

      <Button mode="outlined" onPress={onCreateReminder} style={{ marginTop: 12 }}>
        Create Reminder (24h)
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
});
