import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useFitStore } from '../store/workout';
import { useNavigation, useRoute } from '@react-navigation/native';

const WorkoutDetailScreen = () => {
  const { params } = useRoute();
  const { workoutId } = params || {};
  const { templates, sessions, fetchSessions, loadingSessions, error } = useFitStore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchSessions();
  }, []);

  const workout = templates.find((t) => t._id === workoutId);
  const workoutSessions = sessions.filter((s) => s.templateId === workoutId);

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
      <Text style={commonStyles.itemText}>{workout.description}</Text>
      <Text style={{ fontSize: 18, marginTop: 16, color: '#f0f0f0' }}>Activities:</Text>
      {workout.activities.map((activity) => (
        <View key={activity.id} style={commonStyles.item}>
          <Text style={commonStyles.itemText}>
            {activity.name} ({activity.type})
          </Text>
          {activity.defaultSets &&
            activity.defaultSets.map((set, index) => (
              <Text key={index} style={commonStyles.itemText}>
                Set {index + 1}: {set.reps} reps @ {set.weight} lbs
              </Text>
            ))}
        </View>
      ))}
      <View style={commonStyles.buttonSpacing}>
        <Button
          title="Start Session"
          onPress={() => navigation.navigate('StartSession', { templateId: workout._id })}
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
                <View key={activity.id} style={{ marginLeft: 8 }}>
                  <Text style={commonStyles.itemText}>
                    {activity.name} ({activity.type})
                  </Text>
                  {activity.sets.map((set, index) => (
                    <Text key={index} style={commonStyles.itemText}>
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
