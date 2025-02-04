import React, { useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useFitStore } from '../store/workout';
import { useNavigation } from '@react-navigation/native';

const WorkoutsScreen = () => {
  const { templates, loadingTemplates, error, fetchTemplates, sessions } = useFitStore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTemplates();
  }, []);

  // For each template, compute details: number of activities, last session date, and total volume.
  const templatesWithDetails = useMemo(() => {
    return templates.map((template) => {
      const relatedSessions = sessions.filter((s) => s.templateId === template._id);
      const lastSessionDate = relatedSessions.length
        ? new Date(
            relatedSessions.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )[0].date,
          ).toLocaleDateString()
        : 'Never';
      // Total volume: for each session, sum up (reps*weight) for lift activities.
      const totalVolume = relatedSessions.reduce((vol, session) => {
        session.activities.forEach((act: any) => {
          if (act.defaultSets) {
            act.defaultSets.forEach((set: any) => {
              vol += set.reps * set.weight;
            });
          }
        });
        return vol;
      }, 0);
      return {
        ...template,
        activityCount: template.activities.length,
        lastSessionDate,
        totalVolume,
      };
    });
  }, [templates, sessions]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={commonStyles.item}
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item._id })}
    >
      <Text style={commonStyles.itemText}>Name: {item.name}</Text>
      <Text style={commonStyles.itemText}>Activities: {item.activityCount}</Text>
      <Text style={commonStyles.itemText}>Last Done: {item.lastSessionDate}</Text>
      <Text style={commonStyles.itemText}>Total Volume: {item.totalVolume}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Workouts</Text>
      {loadingTemplates ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : templates.length === 0 ? (
        <Text style={commonStyles.itemText}>No workouts found.</Text>
      ) : (
        <FlatList
          data={templatesWithDetails}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
      <View style={{ marginVertical: 16 }}>
        <Button
          title="Add Workout"
          onPress={() => navigation.navigate('CreateEditWorkout')}
          color="#4a90e2"
        />
      </View>
    </View>
  );
};

export default WorkoutsScreen;
