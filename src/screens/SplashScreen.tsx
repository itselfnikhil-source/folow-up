import { View, Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import authService from '../services/authService';

export default function SplashScreen({ navigation }: any) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(async () => {
      try {
        const token = await authService.getStoredToken();

        // small delay so animation completes and UX feels smooth
        setTimeout(() => {
          navigation.replace(token ? 'Main' : 'Login');
        }, 600);
      } catch (err) {
        navigation.replace('Login');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { transform: [{ scale }] }]}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14213D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
});
