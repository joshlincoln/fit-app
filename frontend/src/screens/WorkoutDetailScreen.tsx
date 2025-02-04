import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useFitStore } from '../store/workout';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExercises } from '../services/exercise';
import { Exercise } from '../models/exercise';

const WorkoutDetailScreen = () => {
  const { params } = useRoute();
  const { workoutId } = params || {};
  const { templates, sessions, fetchSessions, loadingSessions, error } = useFitStore();
  const navigation = useNavigation();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    fetchSessions();
    getExercises().then(setExercises);
  }, []);

  const workout = templates.find((t) => t._id === workoutId);
  const workoutSessions = sessions.filter((s) => s.templateId === workoutId);

  const lastSessionDate = useMemo(() => {
    if (workoutSessions.length === 0) return 'Never';
    return new Date(
      workoutSessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0].date,
    ).toLocaleDateString();
  }, [workoutSessions]);

  const totalVolume = useMemo(() => {
    if (workoutSessions.length === 0) return 0;
    // Use the most recent session for volume
    const recent = workoutSessions[0];
    let vol = 0;
    recent.activities.forEach((act: any) => {
      if (act.sets) {
        act.sets.forEach((set: any) => {
          vol += set.reps * set.weight;
        });
      }
    });
    return vol;
  }, [workoutSessions]);

  if (!workout) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.itemText}>Workout not found.</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>{workout.name}</Text>
      <Text style={commonStyles.itemText}>Activities: {workout.activities.length}</Text>
      <Text style={commonStyles.itemText}>Last Done: {lastSessionDate}</Text>
      <Text style={commonStyles.itemText}>Total Volume: {totalVolume}</Text>
      <Text style={{ fontSize: 18, marginTop: 16, color: '#f0f0f0' }}>Activities:</Text>
      {workout.activities.map((activity) => {
        const ex = exercises.find((e) => e._id === activity.exercise);
        return (
          <View key={activity.exercise} style={commonStyles.item}>
            <Text style={commonStyles.itemText}>
              {ex ? ex.name : activity.exercise} ({ex ? ex.type : ''})
            </Text>
            {activity.defaultSets &&
              activity.defaultSets.map((set, index) => (
                <Text key={`${activity.exercise}-${index}`} style={commonStyles.itemText}>
                  Set {index + 1}: {set.reps} reps @ {set.weight} lbs
                </Text>
              ))}
            {activity.defaultDuration !== undefined && (
              <Text style={commonStyles.itemText}>
                Duration: {activity.defaultDuration} {activity.defaultUnit}
              </Text>
            )}
          </View>
        );
      })}
      <View style={{ marginVertical: 16 }}>
        <Button
          title="Session"
          onPress={() => navigation.navigate('Session', { templateId: workout._id })}
          color="#4a90e2"
        />
      </View>
      <Text style={{ fontSize: 18, marginTop: 16, color: '#f0f0f0' }}>Session History:</Text>
      {loadingSessions ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : workoutSessions.length === 0 ? (
        <Text style={commonStyles.itemText}>No sessions recorded yet.</Text>
      ) : (
        <FlatList
          data={workoutSessions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={commonStyles.item}>
              <Text style={commonStyles.itemText}>
                Date: {new Date(item.date).toLocaleString()}
              </Text>
              <Text style={commonStyles.itemText}>
                Duration: {Math.floor(item.duration / 60)} min
              </Text>
              {item.activities.map((activity) => (
                <View key={`${item._id}-${activity.id}`} style={{ marginLeft: 8 }}>
                  <Text style={commonStyles.itemText}>{activity.name}</Text>
                  {activity.sets &&
                    activity.sets.map((set, index) => (
                      <Text
                        key={`${item._id}-${activity.id}-${index}`}
                        style={commonStyles.itemText}
                      >
                        Set {index + 1}: {set.reps} reps @ {set.weight} lbs
                      </Text>
                    ))}
                </View>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default WorkoutDetailScreen;
