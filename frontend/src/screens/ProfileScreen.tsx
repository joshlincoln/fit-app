import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from '../styles';

export default function ProfileScreen() {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>Profile</Text>

      {/* User Info */}
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>User Info</Text>
        <Text style={commonStyles.cardText}>Name: John Doe</Text>
        <Text style={commonStyles.cardText}>Email: johndoe@example.com</Text>
      </View>

      {/* Membership Info */}
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Membership</Text>
        <Text style={commonStyles.cardText}>Pro Member</Text>
        <Text style={commonStyles.cardText}>Renewal: 2025-03-15</Text>
      </View>
    </View>
  );
}
