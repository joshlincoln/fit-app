import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { createWorkout } from '../services/api';
import Button from '../components/Button';

const CreateWorkoutScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    await createWorkout({ name, date: new Date().toISOString(), exercises: [] });
    navigation.goBack();
  };

  return (
    <View>
      <TextInput placeholder="Workout Name" value={name} onChangeText={setName} />
      <Button title="Save Workout" onPress={handleCreate} />
    </View>
  );
};

export default CreateWorkoutScreen;
