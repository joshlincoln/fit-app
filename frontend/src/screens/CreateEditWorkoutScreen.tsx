import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import commonStyles from '../styles/commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFitStore } from '../store/workout';
import { getExercises, createExercise } from '../services/exercise';
import { Exercise } from '../models/exercise';

// These interfaces are used internally on the CreateEditWorkoutScreen
// to manage user input before converting the data into a CreateWorkoutTemplateRequest.
export interface SetInput {
  reps: string; // Stored as string so that TextInput values work directly
  weight: string;
}

export interface ActivityInput {
  id: string; // local unique id (for UI tracking)
  selectedExerciseId: string; // either an existing Exercise _id or the special value "add_new"
  isNew: boolean; // true if the user is creating a new exercise
  exerciseName: string; // effective name (either from the dropdown or entered manually)
  exerciseType: 'Lift' | 'Cardio'; // effective type
  sets: SetInput[]; // if the exercise type is Lift; user can add multiple sets
  defaultDuration: string; // if Cardio
  defaultUnit: string; // if Cardio
}

const CreateEditWorkoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workoutId } = route.params || {}; // if editing an existing workout
  const { templates, createTemplate } = useFitStore();

  const [workoutName, setWorkoutName] = useState('');
  const [description, setDescription] = useState('');
  const [activities, setActivities] = useState<ActivityInput[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

  // Load available exercises from API
  const loadExercises = async () => {
    setLoadingExercises(true);
    try {
      const data = await getExercises();
      setAvailableExercises(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingExercises(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  // If editing, preload the existing workout data
  useEffect(() => {
    if (workoutId) {
      const workout = templates.find((t) => t._id === workoutId);
      if (workout) {
        setWorkoutName(workout.name);
        setDescription(workout.description || '');
        const loadedActivities = workout.activities.map((act) => ({
          id: act.exercise, // stored exercise _id
          selectedExerciseId: act.exercise,
          isNew: false,
          exerciseName: '', // will be filled from availableExercises later
          exerciseType: 'Lift' as 'Lift' | 'Cardio', // default, then update after lookup
          sets: act.defaultSets
            ? act.defaultSets.map((set) => ({
                reps: set.reps.toString(),
                weight: set.weight.toString(),
              }))
            : [{ reps: '', weight: '' }],
          defaultDuration: act.defaultDuration ? act.defaultDuration.toString() : '',
          defaultUnit: act.defaultUnit || '',
        }));
        setActivities(loadedActivities);
        // Update exerciseName and exerciseType for each activity based on availableExercises
        // (Delayed lookup: once availableExercises are loaded, update each activity.)
      }
    }
  }, [workoutId, templates]);

  // When available exercises load, update activities that are not "add_new"
  useEffect(() => {
    if (availableExercises.length > 0) {
      const newActivities = activities.map((activity) => {
        if (activity.selectedExerciseId !== 'add_new') {
          const found = availableExercises.find((ex) => ex._id === activity.selectedExerciseId);
          if (found) {
            return {
              ...activity,
              exerciseName: found.name,
              exerciseType: found.type,
            };
          }
        }
        return activity;
      });
      setActivities(newActivities);
    }
  }, [availableExercises]);

  // Add a new activity entry; default is "add_new"
  const addActivity = () => {
    const newActivity: ActivityInput = {
      id: 'act-' + Date.now(),
      selectedExerciseId: 'add_new',
      isNew: true,
      exerciseName: '',
      exerciseType: 'Lift',
      sets: [{ reps: '', weight: '' }],
      defaultDuration: '',
      defaultUnit: '',
    };
    setActivities([...activities, newActivity]);
  };

  const updateActivityField = (
    index: number,
    field: keyof ActivityInput,
    value: string | boolean | 'Lift' | 'Cardio',
  ) => {
    const newActivities = [...activities];
    newActivities[index][field] = value as any;
    setActivities(newActivities);
  };

  const updateSetField = (
    activityIndex: number,
    setIndex: number,
    field: keyof SetInput,
    value: string,
  ) => {
    const newActivities = [...activities];
    newActivities[activityIndex].sets[setIndex][field] = value;
    setActivities(newActivities);
  };

  const addSetToActivity = (activityIndex: number) => {
    const newActivities = [...activities];
    newActivities[activityIndex].sets.push({ reps: '', weight: '' });
    setActivities(newActivities);
  };

  // Handle exercise selection change
  const handleExerciseSelectionChange = (index: number, selectedValue: string) => {
    if (selectedValue === 'add_new') {
      updateActivityField(index, 'selectedExerciseId', 'add_new');
      updateActivityField(index, 'isNew', true);
      updateActivityField(index, 'exerciseName', '');
    } else {
      updateActivityField(index, 'selectedExerciseId', selectedValue);
      updateActivityField(index, 'isNew', false);
      const found = availableExercises.find((ex) => ex._id === selectedValue);
      if (found) {
        updateActivityField(index, 'exerciseName', found.name);
        updateActivityField(index, 'exerciseType', found.type);
        if (found.type === 'Lift' && found.defaultSets && found.defaultSets.length > 0) {
          const defaultSets = found.defaultSets.map((set) => ({
            reps: set.reps.toString(),
            weight: set.weight.toString(),
          }));
          updateActivityField(index, 'sets', defaultSets);
        } else if (found.type === 'Cardio') {
          updateActivityField(
            index,
            'defaultDuration',
            found.defaultDuration ? found.defaultDuration.toString() : '',
          );
          updateActivityField(index, 'defaultUnit', found.defaultUnit || '');
        }
      }
    }
  };

  // When saving, for each activity marked as new, call createExercise API first.
  const handleSaveWorkout = async () => {
    if (!workoutName || activities.length === 0) return;
    const convertedActivities = [];
    for (const act of activities) {
      let finalExerciseId = act.selectedExerciseId;
      if (act.selectedExerciseId === 'add_new' && act.isNew) {
        try {
          const created = await createExercise({
            name: act.exerciseName,
            type: act.exerciseType,
            defaultSets:
              act.exerciseType === 'Lift'
                ? act.sets.map((set) => ({
                    reps: parseInt(set.reps, 10) || 0,
                    weight: parseFloat(set.weight) || 0,
                  }))
                : undefined,
            defaultDuration:
              act.exerciseType === 'Cardio' ? parseInt(act.defaultDuration, 10) || 0 : undefined,
            defaultUnit: act.exerciseType === 'Cardio' ? act.defaultUnit : undefined,
          });
          finalExerciseId = created._id;
        } catch (error) {
          console.error('Error creating exercise:', error);
        }
      }
      const activityObj: any = {
        exercise: finalExerciseId,
      };
      if (act.exerciseType === 'Lift') {
        activityObj.defaultSets = act.sets.map((set) => ({
          reps: parseInt(set.reps, 10) || 0,
          weight: parseFloat(set.weight) || 0,
        }));
      } else if (act.exerciseType === 'Cardio') {
        activityObj.defaultDuration = parseInt(act.defaultDuration, 10) || 0;
        activityObj.defaultUnit = act.defaultUnit;
      }
      convertedActivities.push(activityObj);
    }
    await createTemplate({
      userId: 1, // Replace with actual user id
      name: workoutName,
      description,
      activities: convertedActivities,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>{workoutId ? 'Edit Workout' : 'Create Workout'}</Text>
      <TextInput
        placeholder="Workout Name"
        placeholderTextColor="#888"
        value={workoutName}
        onChangeText={setWorkoutName}
        style={commonStyles.input}
      />
      <TextInput
        placeholder="Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        style={[commonStyles.input, { marginBottom: 20 }]}
      />
      <Button title="Add Activity" onPress={addActivity} color="#4a90e2" />
      {activities.map((activity, idx) => (
        <View key={activity.id} style={[commonStyles.item, { marginTop: 16 }]}>
          <Text style={[commonStyles.itemText, { fontWeight: 'bold' }]}>Activity {idx + 1}</Text>
          {loadingExercises ? (
            <Text style={commonStyles.itemText}>Loading exercises...</Text>
          ) : (
            <Picker
              selectedValue={activity.selectedExerciseId}
              onValueChange={(itemValue) => handleExerciseSelectionChange(idx, itemValue)}
              style={{ color: '#f0f0f0', backgroundColor: '#333', marginBottom: 8 }}
            >
              <Picker.Item label="-- Select Exercise --" value="" />
              {availableExercises.map((ex) => (
                <Picker.Item key={ex._id} label={ex.name} value={ex._id} />
              ))}
              <Picker.Item label="Add new exercise" value="add_new" />
            </Picker>
          )}
          {activity.selectedExerciseId === 'add_new' && activity.isNew && (
            <TextInput
              placeholder="Enter New Exercise Name"
              placeholderTextColor="#888"
              value={activity.exerciseName}
              onChangeText={(text) => updateActivityField(idx, 'exerciseName', text)}
              style={commonStyles.input}
            />
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}>
            <Button
              title="Lift"
              onPress={() => updateActivityField(idx, 'exerciseType', 'Lift')}
              color={activity.exerciseType === 'Lift' ? '#4a90e2' : '#555'}
            />
            <Button
              title="Cardio"
              onPress={() => updateActivityField(idx, 'exerciseType', 'Cardio')}
              color={activity.exerciseType === 'Cardio' ? '#4a90e2' : '#555'}
            />
          </View>
          {activity.exerciseType === 'Lift' ? (
            <View>
              <Text style={commonStyles.itemText}>Sets:</Text>
              {activity.sets.map((set, setIdx) => (
                <View
                  key={setIdx}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <TextInput
                    placeholder="Reps"
                    placeholderTextColor="#888"
                    value={set.reps}
                    onChangeText={(text) => updateSetField(idx, setIdx, 'reps', text)}
                    style={[commonStyles.input, { flex: 1, marginRight: 8 }]}
                    keyboardType="numeric"
                  />
                  <TextInput
                    placeholder="Weight"
                    placeholderTextColor="#888"
                    value={set.weight}
                    onChangeText={(text) => updateSetField(idx, setIdx, 'weight', text)}
                    style={[commonStyles.input, { flex: 1 }]}
                    keyboardType="numeric"
                  />
                </View>
              ))}
              <Button title="Add Set" onPress={() => addSetToActivity(idx)} color="#4a90e2" />
            </View>
          ) : (
            <View>
              <TextInput
                placeholder="Default Duration (sec)"
                placeholderTextColor="#888"
                value={activity.defaultDuration}
                onChangeText={(text) => updateActivityField(idx, 'defaultDuration', text)}
                style={commonStyles.input}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Default Unit (e.g., min)"
                placeholderTextColor="#888"
                value={activity.defaultUnit}
                onChangeText={(text) => updateActivityField(idx, 'defaultUnit', text)}
                style={commonStyles.input}
              />
            </View>
          )}
        </View>
      ))}
      <View style={{ marginVertical: 20 }}>
        <Button title="Save Workout" onPress={handleSaveWorkout} color="#4a90e2" />
      </View>
    </ScrollView>
  );
};

export default CreateEditWorkoutScreen;
