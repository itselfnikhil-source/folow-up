import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LeadsStack from './LeadsStack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import SettingsScreen from '../screens/SettingsScreen';
import WorkspaceInvitationsScreen from '../screens/workspace/WorkspaceInvitationsScreen';
import ChangePasswordScreen from '../screens/Auth/ChangePasswordScreen';
import WorkspacesScreen from '../screens/workspace/WorkspacesScreen';
import WorkspaceDetailScreen from '../screens/workspace/WorkspaceDetailScreen';
import MemberLeadsScreen from '../screens/workspace/MemberLeadsScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <MaterialCommunityIcons name="chart-line" size={42} color="#FCA311" />
        <Text style={styles.appName}>FollowUp Pro</Text>
        <Text style={styles.subTitle}>Sales • Loan • BPO</Text>
      </View>

      {/* ✅ Correct way */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      const u = await (await import('../services/authService')).default.getStoredUser();
      setUser(u);
    })();
  }, []);
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#14213D' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#0F172A', width: 260 },
        drawerActiveTintColor: '#FCA311',
        drawerInactiveTintColor: '#94A3B8',
        drawerLabelStyle: { fontSize: 14, marginLeft: -8 },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Leads"
        component={LeadsStack}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="phone" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={22} color={color} />
          ),
        }}
      />
      {user?.role === 'member' && (
        <Drawer.Screen
          name="Invitations"
          component={WorkspaceInvitationsScreen}
          options={{ drawerLabel: 'Invitations', drawerIcon: ({ color }) => (<MaterialCommunityIcons name="email" size={22} color={color} />) }}
        />
      )}

      {user?.role !== 'member' && (
        <Drawer.Screen
          name="Workspaces"
          component={WorkspacesScreen}
          options={{ drawerLabel: 'Workspaces', drawerIcon: ({ color }) => (<MaterialCommunityIcons name="office-building" size={22} color={color} />) }}
        />
      )}
      {/* WorkspaceDetail and MemberLeads are handled in the MainStack to preserve back navigation */}
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ drawerLabel: 'Change Password', drawerIcon: ({ color }) => (<MaterialCommunityIcons name="lock" size={22} color={color} />) }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 24,
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FCA311',
    marginTop: 10,
  },
  subTitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
