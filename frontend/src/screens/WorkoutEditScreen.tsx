import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { exerciseList } from '../exercises';
import { useWorkoutStore } from '../store';
import { commonStyles } from '../styles';

export default function WorkoutEditScreen({ route, navigation }) {
  const { workout } = route.params;
  const [workoutName, setWorkoutName] = useState(workout.name);
  const [exercises, setExercises] = useState(workout.exercises || []);
  const { addWorkout } = useWorkoutStore();

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, setDetails: Array(3).fill({ reps: '', weight: '' }) }]);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].setDetails[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  const saveWorkout = () => {
    const updatedWorkout = { ...workout, name: workoutName, exercises };
    addWorkout(updatedWorkout);
    navigation.goBack();
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>Edit Workout</Text>

      {/* Workout Name Input */}
      <TextInput
        style={[commonStyles.input, localStyles.workoutInput]}
        placeholder="Workout Name"
        value={workoutName}
        placeholderTextColor="#AAAAAA"
        onChangeText={setWorkoutName}
      />

      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={commonStyles.card}>
            <Picker
              selectedValue={item.name}
              style={localStyles.picker}
              onValueChange={(value) => {
                const updatedExercises = [...exercises];
                updatedExercises[index].name = value;
                setExercises(updatedExercises);
              }}
            >
              <Picker.Item label="Select Exercise" value="" />
              {exerciseList.map((exercise) => (
                <Picker.Item key={exercise.id} label={exercise.name} value={exercise.name} />
              ))}
            </Picker>

            {item.setDetails.map((set, setIndex) => (
              <View key={setIndex} style={localStyles.setRow}>
                <Text style={localStyles.setLabel}>Set {setIndex + 1}</Text>
                <TextInput
                  style={[commonStyles.input, localStyles.smallInput]}
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={set.reps}
                  placeholderTextColor="#AAAAAA"
                  onChangeText={(text) => handleSetChange(index, setIndex, 'reps', text)}
                />
                <TextInput
                  style={[commonStyles.input, localStyles.smallInput]}
                  placeholder="Weight"
                  keyboardType="numeric"
                  value={set.weight}
                  placeholderTextColor="#AAAAAA"
                  onChangeText={(text) => handleSetChange(index, setIndex, 'weight', text)}
                />
              </View>
            ))}
          </View>
        )}
      />

      <Button title="Add Exercise" color="#1E3A8A" onPress={addExercise} />
      <Button title="Save Workout" color="#1E3A8A" onPress={saveWorkout} />
    </View>
  );
}

const localStyles = {
  workoutInput: {
    marginBottom: 16
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#ffffff',
    marginBottom: 8
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  setLabel: {
    fontSize: 16,
    color: '#cccccc',
    marginRight: 10
  },
  smallInput: {
    flex: 1,
    marginRight: 10
  }
};
