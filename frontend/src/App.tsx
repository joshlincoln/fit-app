import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../src/navigation/AppNavigator';
import LoginScreen from '../src/screens/LoginScreen';
import { useAuthStore } from '../src/store/auth';

export default function App() {
  const { token } = useAuthStore();

  return <NavigationContainer>{token ? <AppNavigator /> : <LoginScreen />}</NavigationContainer>;
}
