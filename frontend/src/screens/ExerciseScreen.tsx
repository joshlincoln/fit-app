import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';
import { useCommonStyles } from '../styles';

const exercises = [
  { id: '1', name: 'Bench Press' },
  { id: '2', name: 'Squat' },
  { id: '3', name: 'Deadlift' },
];

export default function ExerciseScreen() {
  const [workout, setWorkout] = useState(exercises.map(e => ({ ...e, reps: '', weight: '' })));
  const styles = useCommonStyles();

  const updateExercise = (index, field, value) => {
    const updatedWorkout = [...workout];
    updatedWorkout[index][field] = value;
    setWorkout(updatedWorkout);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exercises</Text>
      <FlatList
        data={workout}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.name}</Text>
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              onChangeText={(value) => updateExercise(index, 'reps', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight"
              keyboardType="numeric"
              onChangeText={(value) => updateExercise(index, 'weight', value)}
            />
          </View>
        )}
      />
      <Button title="Save Workout" onPress={() => console.log(workout)} />
    </View>
  );
}
