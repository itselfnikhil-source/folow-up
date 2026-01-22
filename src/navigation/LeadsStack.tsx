import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LeadsScreen from '../screens/LeadsScreen';
import LeadDetailScreen from '../screens/leads/LeadDetailScreen';
import CreateLeadScreen from '../screens/leads/CreateLeadScreen';

const Stack = createNativeStackNavigator();

export default function LeadsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LeadsList" component={LeadsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LeadDetail" component={LeadDetailScreen} options={{ title: 'Lead Detail' }} />
      <Stack.Screen
        name="CreateLead"
        component={CreateLeadScreen}
        options={{ title: 'Create Lead', headerStyle: { height: 56 }, headerTitleStyle: { marginTop: 0 } }}
      />
    </Stack.Navigator>
  );
}
