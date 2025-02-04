// src/screens/CreateSessionScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useFitStore } from '../store/workout';

interface SessionActivityInput {
  id: string;
  type: 'Lift' | 'Cardio';
  name: string;
  sets: { reps: number; weight: number }[];
}

const CreateSessionScreen = () => {
  const { createSession } = useFitStore();
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState<SessionActivityInput[]>([]);
  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState<'Lift' | 'Cardio'>('Lift');

  const addActivity = () => {
    if (!activityName) return;
    const newActivity: SessionActivityInput = {
      id: 'a-' + Date.now(),
      name: activityName,
      type: activityType,
      // For lift activities, default to one set
      sets: activityType === 'Lift' ? [{ reps: 10, weight: 100 }] : [],
    };
    setActivities([...activities, newActivity]);
    setActivityName('');
  };

  const handleCreateSession = async () => {
    if (!duration || activities.length === 0) return;
    await createSession({
      userId: 1, // Replace with actual user ID when available
      date: new Date().toISOString(),
      duration: parseInt(duration, 10),
      activities,
      notes,
    });
    // Reset form
    setDuration('');
    setNotes('');
    setActivities([]);
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Create Workout Session</Text>
      <TextInput
        placeholder="Duration (seconds)"
        value={duration}
        onChangeText={setDuration}
        style={commonStyles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        style={commonStyles.input}
      />

      <Text style={{ fontSize: 18, marginBottom: 8 }}>Add Activity</Text>
      <TextInput
        placeholder="Activity Name"
        value={activityName}
        onChangeText={setActivityName}
        style={commonStyles.input}
      />

      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Button
          title="Lift"
          onPress={() => setActivityType('Lift')}
          color={activityType === 'Lift' ? '#E94560' : '#ccc'}
        />
        <Button
          title="Cardio"
          onPress={() => setActivityType('Cardio')}
          color={activityType === 'Cardio' ? '#E94560' : '#ccc'}
        />
      </View>
      <Button title="Add Activity" onPress={addActivity} color="#E94560" />

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={commonStyles.item}>
            <Text style={commonStyles.itemText}>
              {item.name} ({item.type})
            </Text>
          </View>
        )}
      />

      <Button title="Create Session" onPress={handleCreateSession} color="#E94560" />
    </View>
  );
};

export default CreateSessionScreen;
