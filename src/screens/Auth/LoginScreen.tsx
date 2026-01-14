import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { Text, Button, Card, TextInput, Switch } from 'react-native-paper';
import SocialButton from '../../components/SocialButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useSocialAuth } from '../../hooks/useSocialAuth';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    loading,
    error,
    user,
    loginWithGoogle,
  } = useSocialAuth();

  const [isManager, setIsManager] = useState(false);
  const [showWorkspaceInput, setShowWorkspaceInput] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ✅ Navigate after successful login
  useEffect(() => {
    if (user) {
      navigation.replace('Main');
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#14213D', '#1B2A52']}
        style={styles.header}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>
            Smart follow-ups. Stronger connections.
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Continue with Google to get started
          </Text>

          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ marginRight: 8, color: '#6B7280' }}>Manager account?</Text>
              <Switch value={isManager} onValueChange={setIsManager} />
            </View>

            {!showWorkspaceInput && isManager && (
              <Button
                mode="outlined"
                onPress={() => setShowWorkspaceInput(true)}
                style={{ marginBottom: 8 }}
              >
                Add workspace
              </Button>
            )}

            {showWorkspaceInput && isManager && (
              <TextInput
                placeholder="Enter workspace name"
                value={workspaceName}
                onChangeText={setWorkspaceName}
                style={{ width: '100%', marginBottom: 8 }}
                mode="outlined"
              />
            )}

            <SocialButton
              loading={loading}
              onPress={() => loginWithGoogle({ isManager, workspaceName: isManager ? workspaceName : undefined })}
              disabled={loading}
            />
          </View>
        </Card.Content>
      </Card>

      <Text style={styles.footerText}>
        By continuing, you agree to our Terms & Privacy Policy
      </Text>
    </View>
  );
}


/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14213D',
  },

  header: {
    height: height * 0.42,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 14,
  },

  tagline: {
    fontSize: 15,
    color: '#E5E5E5',
    textAlign: 'center',
  },

  card: {
    width: '88%',
    alignSelf: 'center',
    marginTop: -60,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.96)',

    // Android shadow
    elevation: Platform.OS === 'android' ? 8 : 0,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },

  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14213D',
    textAlign: 'center',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
  },

  socialButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 18,
    paddingVertical: 8,
    marginVertical: 10,
  },

  socialLabel: {
    color: '#14213D',
    fontSize: 16,
    fontWeight: '600',
  },

  footerText: {
    marginTop: 28,
    fontSize: 12,
    color: '#E5E5E5',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
