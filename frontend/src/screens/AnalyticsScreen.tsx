import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useFitStore } from '../store/workout';

const AnalyticsScreen = () => {
  const { analytics, loadingAnalytics, error, fetchAnalytics } = useFitStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Analytics</Text>
      {loadingAnalytics ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <>
          <View style={commonStyles.item}>
            <Text style={commonStyles.itemText}>Average Reps per Workout</Text>
            <Text style={commonStyles.itemText}>12 reps</Text>
          </View>
          <View style={commonStyles.item}>
            <Text style={commonStyles.itemText}>Max Weight Lifted</Text>
            <Text style={commonStyles.itemText}>200 lbs</Text>
          </View>
          <View style={commonStyles.item}>
            <Text style={commonStyles.itemText}>Total Workout Duration (This Week)</Text>
            <Text style={commonStyles.itemText}>300 min</Text>
          </View>
          <View style={commonStyles.item}>
            <Text style={commonStyles.itemText}>Workouts Per Week</Text>
            <Text style={commonStyles.itemText}>3 workouts</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default AnalyticsScreen;
