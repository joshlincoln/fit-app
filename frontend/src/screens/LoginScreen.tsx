import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { googleSignIn, appleSignIn } from '../services/auth';
import { useAuthStore } from '../store/auth';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // In a production app, use expo-auth-session or similar to get a real token.
      const idToken = "DUMMY_GOOGLE_ID_TOKEN"; // Replace with real token retrieval
      const response = await googleSignIn({ idToken });
      setAuth(response);
    } catch (error) {
      console.error("Google sign in error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const identityToken = "DUMMY_APPLE_ID_TOKEN"; // Replace with real token retrieval
      const response = await appleSignIn({ identityToken });
      setAuth(response);
    } catch (error) {
      console.error("Apple sign in error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={commonStyles.container}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Please Sign In</Text>
      <View style={{ marginVertical: 16 }}>
        <Button title="Sign in with Google" onPress={handleGoogleSignIn} color="#4a90e2" />
      </View>
      <View style={{ marginVertical: 16 }}>
        <Button title="Sign in with Apple" onPress={handleAppleSignIn} color="#4a90e2" />
      </View>
    </View>
  );
};

export default LoginScreen;
