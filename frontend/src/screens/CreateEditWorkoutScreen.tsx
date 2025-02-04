import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import commonStyles from '../styles/commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFitStore } from '../store/workout';
import { getExercises, createExercise, Exercise } from '../services/exercise';

interface SetInput {
  reps: string;
  weight: string;
}

interface ActivityInput {
  id: string;
  selectedExerciseId: string; // Existing exercise _id or "add_new"
  isNew: boolean; // True if user is adding a new exercise
  newExerciseName: string;
  newExerciseType: 'Lift' | 'Cardio';
  // For lifts:
  sets: SetInput[];
  // For cardio:
  defaultDuration: string;
  defaultUnit: string;
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

  // Preload existing workout data if editing
  useEffect(() => {
    if (workoutId) {
      const workout = templates.find((t) => t._id === workoutId);
      if (workout) {
        setWorkoutName(workout.name);
        setDescription(workout.description || '');
        const loadedActivities = workout.activities.map((act) => ({
          id: act.exercise, // stored exercise _id in the template
          selectedExerciseId: act.exercise,
          isNew: false,
          newExerciseName: '',
          newExerciseType: 'Lift', // default; actual type will be determined by the exercise lookup
          sets: act.defaultSets
            ? act.defaultSets.map(set => ({
                reps: set.reps.toString(),
                weight: set.weight.toString(),
              }))
            : [{ reps: '', weight: '' }],
          defaultDuration: act.defaultDuration ? act.defaultDuration.toString() : '',
          defaultUnit: act.defaultUnit || '',
        }));
        setActivities(loadedActivities);
      }
    }
  }, [workoutId, templates]);

  // Add a new activity entry; default to "add new"
  const addActivity = () => {
    const newActivity: ActivityInput = {
      id: 'act-' + Date.now(),
      selectedExerciseId: 'add_new',
      isNew: true,
      newExerciseName: '',
      newExerciseType: 'Lift',
      sets: [{ reps: '', weight: '' }],
      defaultDuration: '',
      defaultUnit: '',
    };
    setActivities([...activities, newActivity]);
  };

  const updateActivityField = (index: number, field: keyof ActivityInput, value: string | boolean | 'Lift' | 'Cardio') => {
    const newActivities = [...activities];
    newActivities[index][field] = value as any;
    setActivities(newActivities);
  };

  const updateSetField = (activityIndex: number, setIndex: number, field: keyof SetInput, value: string) => {
    const newActivities = [...activities];
    newActivities[activityIndex].sets[setIndex][field] = value;
    setActivities(newActivities);
  };

  const addSetToActivity = (activityIndex: number) => {
    const newActivities = [...activities];
    newActivities[activityIndex].sets.push({ reps: '', weight: '' });
    setActivities(newActivities);
  };

  // Handle exercise selection change in the dropdown
  const handleExerciseSelectionChange = (index: number, selectedValue: string) => {
    if (selectedValue === 'add_new') {
      updateActivityField(index, 'selectedExerciseId', 'add_new');
      updateActivityField(index, 'isNew', true);
      updateActivityField(index, 'newExerciseName', '');
    } else {
      updateActivityField(index, 'selectedExerciseId', selectedValue);
      updateActivityField(index, 'isNew', false);
      const found = availableExercises.find(ex => ex._id === selectedValue);
      if (found) {
        updateActivityField(index, 'newExerciseName', found.name);
        updateActivityField(index, 'newExerciseType', found.type);
        if (found.type === 'Lift' && found.defaultSets && found.defaultSets.length > 0) {
          const defaultSets = found.defaultSets.map(set => ({
            reps: set.reps.toString(),
            weight: set.weight.toString(),
          }));
          const newActivities = [...activities];
          newActivities[index].sets = defaultSets;
          setActivities(newActivities);
        } else if (found.type === 'Cardio') {
          updateActivityField(index, 'defaultDuration', found.defaultDuration ? found.defaultDuration.toString() : '');
          updateActivityField(index, 'defaultUnit', found.defaultUnit || '');
        }
      }
    }
  };

  // When saving, for each activity marked as new, create the exercise first and then build the workout template payload.
  const handleSaveWorkout = async () => {
    if (!workoutName || activities.length === 0) return;
    const convertedActivities = [];
    for (const act of activities) {
      let finalExerciseId = act.selectedExerciseId;
      if (act.selectedExerciseId === 'add_new' && act.isNew) {
        try {
          const created = await createExercise({
            name: act.newExerciseName,
            type: act.newExerciseType,
            defaultSets:
              act.newExerciseType === 'Lift'
                ? act.sets.map(set => ({
                    reps: parseInt(set.reps, 10) || 0,
                    weight: parseFloat(set.weight) || 0,
                  }))
                : undefined,
            defaultDuration:
              act.newExerciseType === 'Cardio'
                ? parseInt(act.defaultDuration, 10) || 0
                : undefined,
            defaultUnit:
              act.newExerciseType === 'Cardio'
                ? act.defaultUnit
                : undefined,
          });
          finalExerciseId = created._id;
        } catch (error) {
          console.error('Error creating exercise:', error);
        }
      }
      const activityObj: any = {
        exercise: finalExerciseId,
      };
      if (act.newExerciseType === 'Lift') {
        activityObj.defaultSets = act.sets.map(set => ({
          reps: parseInt(set.reps, 10) || 0,
          weight: parseFloat(set.weight) || 0,
        }));
      } else if (act.newExerciseType === 'Cardio') {
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
      <Text style={commonStyles.screenTitle}>
        {workoutId ? 'Edit Workout' : 'Create Workout'}
      </Text>
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
          <Text style={[commonStyles.itemText, { fontWeight: 'bold' }]}>
            Activity {idx + 1}
          </Text>
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
            <>
              <TextInput
                placeholder="Enter New Exercise Name"
                placeholderTextColor="#888"
                value={activity.newExerciseName}
                onChangeText={(text) => updateActivityField(idx, 'newExerciseName', text)}
                style={commonStyles.input}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}>
                <Button
                  title="Lift"
                  onPress={() => updateActivityField(idx, 'newExerciseType', 'Lift')}
                  color={activity.newExerciseType === 'Lift' ? '#4a90e2' : '#555'}
                />
                <Button
                  title="Cardio"
                  onPress={() => updateActivityField(idx, 'newExerciseType', 'Cardio')}
                  color={activity.newExerciseType === 'Cardio' ? '#4a90e2' : '#555'}
                />
              </View>
              {activity.newExerciseType === 'Lift' && (
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
              )}
              {activity.newExerciseType === 'Cardio' && (
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
            </>
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
