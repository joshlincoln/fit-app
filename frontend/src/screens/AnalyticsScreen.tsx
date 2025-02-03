import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from '../styles';

export default function AnalyticsScreen() {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>Analytics</Text>

      {/* Card for PR Tracking */}
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Personal Records</Text>
        <Text style={commonStyles.cardText}>Bench Press: 225 lbs</Text>
        <Text style={commonStyles.cardText}>Squat: 315 lbs</Text>
        <Text style={commonStyles.cardText}>Deadlift: 405 lbs</Text>
      </View>

      {/* Card for Volume Summary */}
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Weekly Volume</Text>
        <Text style={commonStyles.cardText}>Total Volume: 15,400 lbs</Text>
        <Text style={commonStyles.cardText}>Workouts: 4 this week</Text>
      </View>
    </View>
  );
}
