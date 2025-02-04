import React, { useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useFitStore } from '../store/workout';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { sessions, templates, fetchSessions, loadingSessions, error } = useFitStore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchSessions();
  }, []);

  const lastSession = sessions[sessions.length - 1];

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Last Workout</Text>
      {loadingSessions ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : lastSession ? (
        <View style={commonStyles.item}>
          <Text style={commonStyles.itemText}>
            Date: {new Date(lastSession.date).toLocaleString()}
          </Text>
          <Text style={commonStyles.itemText}>
            Duration: {Math.floor(lastSession.duration / 60)} min
          </Text>
          {lastSession.activities.map((activity) => (
            <View key={activity.id} style={{ marginLeft: 8 }}>
              <Text style={commonStyles.itemText}>
                {activity.name} {/* Should show exercise name */}
              </Text>
              {activity.sets &&
                activity.sets.map((set, index) => (
                  <Text key={`${activity.id}-${index}`} style={commonStyles.itemText}>
                    Set {index + 1}: {set.reps} reps @ {set.weight} lbs
                  </Text>
                ))}
            </View>
          ))}
        </View>
      ) : (
        <Text style={commonStyles.itemText}>No workout session recorded yet.</Text>
      )}
      {templates.length > 0 && (
        <View style={{ marginVertical: 16 }}>
          <Button
            title="Start Session"
            onPress={() => navigation.navigate('Session')}
            color="#4a90e2"
          />
        </View>
      )}
      <View
        style={{
          height: 150,
          backgroundColor: '#2a2a2a',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <Text style={{ color: '#f0f0f0' }}>Chart Placeholder</Text>
      </View>
    </View>
  );
};

export default HomeScreen;
