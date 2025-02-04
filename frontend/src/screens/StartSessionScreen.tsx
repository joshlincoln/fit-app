import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useFitStore } from '../store/workout';
import { useNavigation, useRoute } from '@react-navigation/native';

const StartSessionScreen = () => {
  const { params } = useRoute();
  const { templateId } = params || {};
  const { templates, createSession } = useFitStore();
  const navigation = useNavigation();

  const workout = templates.find((t) => t._id === templateId);
  const [sessionData, setSessionData] = useState({});

  useEffect(() => {
    if (workout) {
      const initialData = {};
      workout.activities.forEach((activity) => {
        initialData[activity.id] = { reps: '', weight: '' };
      });
      setSessionData(initialData);
    }
  }, [workout]);

  const handleInputChange = (activityId, field, value) => {
    setSessionData((prev) => ({
      ...prev,
      [activityId]: { ...prev[activityId], [field]: value },
    }));
  };

  const handleFinishSession = async () => {
    if (!workout) return;
    const activities = workout.activities.map((activity) => {
      const data = sessionData[activity.id];
      return {
        id: activity.id,
        type: activity.type,
        name: activity.name,
        sets: [
          {
            reps: parseInt(data.reps, 10) || 0,
            weight: parseFloat(data.weight) || 0,
          },
        ],
      };
    });
    // For simplicity, use a fixed duration (e.g. 1 hour)
    const duration = 3600;
    await createSession({
      userId: 1,
      templateId: workout._id,
      date: new Date().toISOString(),
      duration,
      activities,
      notes: '',
    });
    navigation.goBack();
  };

  if (!workout) {
    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.itemText}>Workout template not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Start Session: {workout.name}</Text>
      {workout.activities.map((activity) => (
        <View key={activity.id} style={commonStyles.item}>
          <Text style={commonStyles.itemText}>
            {activity.name} ({activity.type})
          </Text>
          <TextInput
            placeholder="Reps"
            value={sessionData[activity.id]?.reps}
            onChangeText={(text) => handleInputChange(activity.id, 'reps', text)}
            style={commonStyles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Weight"
            value={sessionData[activity.id]?.weight}
            onChangeText={(text) => handleInputChange(activity.id, 'weight', text)}
            style={commonStyles.input}
            keyboardType="numeric"
          />
        </View>
      ))}
      <View style={commonStyles.buttonSpacing}>
        <Button title="Finish Session" onPress={handleFinishSession} color="#4a90e2" />
      </View>
    </ScrollView>
  );
};

export default StartSessionScreen;
