import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from '../styles';

export default function HomeScreen() {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>Dashboard</Text>

      {/* Recent Workout Summary */}
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Recent Workout</Text>
        <Text style={commonStyles.cardText}>Chest & Triceps - 2025-02-02</Text>
        <Text style={commonStyles.cardText}>5 Exercises • 45 mins</Text>
      </View>

      {/* Progress Summary */}
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Overall Progress</Text>
        <Text style={commonStyles.cardText}>3 PRs this week</Text>
        <Text style={commonStyles.cardText}>Volume: 12,300 lbs</Text>
      </View>
    </View>
  );
}
