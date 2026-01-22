import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import WorkspaceDetailScreen from '../screens/workspace/WorkspaceDetailScreen';
import MemberLeadsScreen from '../screens/workspace/MemberLeadsScreen';
import LeadDetailScreen from '../screens/leads/LeadDetailScreen';
import CreateLeadScreen from '../screens/leads/CreateLeadScreen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} options={{ headerShown: false }} />

      <Stack.Screen name="WorkspaceDetail" component={WorkspaceDetailScreen} options={{ title: 'Workspace' }} />
      <Stack.Screen name="MemberLeads" component={MemberLeadsScreen} options={{ title: 'Member Leads' }} />
      <Stack.Screen name="LeadDetail" component={LeadDetailScreen} options={{ title: 'Lead Detail' }} />
      <Stack.Screen
        name="CreateLead"
        component={CreateLeadScreen}
        options={{ title: 'Create Lead', headerStyle: { height: 56 }, headerTitleStyle: { marginTop: 0 } }}
      />
    </Stack.Navigator>
  );
}
