import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import commonStyles from '../styles/commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFitStore } from '../store/workout';
import { getExercises, createExercise } from '../services/exercise';
import { Exercise } from '../models/exercise';

export interface SetInput {
  reps: string;
  weight: string;
}

export interface ActivityInput {
  id: string;
  selectedExerciseId: string; // existing exercise _id or "add_new"
  isNew: boolean; // true if creating new exercise
  exerciseName: string; // effective name (from dropdown or manual entry)
  exerciseType: 'Lift' | 'Cardio'; // effective type
  sets: SetInput[]; // for lifts (allow multiple)
  defaultDuration: string; // for cardio
  defaultUnit: string; // for cardio
}

const CreateEditWorkoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { workoutId } = route.params || {};
  const { templates, createTemplate, fetchTemplates } = useFitStore();

  const [workoutName, setWorkoutName] = useState('');
  const [activities, setActivities] = useState<ActivityInput[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

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

  useEffect(() => {
    if (workoutId) {
      const workout = templates.find((t) => t._id === workoutId);
      if (workout) {
        setWorkoutName(workout.name);
        const loadedActivities = workout.activities.map((act) => ({
          id: act.exercise,
          selectedExerciseId: act.exercise,
          isNew: false,
          exerciseName: '',
          exerciseType: 'Lift' as 'Lift' | 'Cardio',
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
      }
    }
  }, [workoutId, templates]);

  useEffect(() => {
    if (availableExercises.length > 0) {
      setActivities((prevActivities) =>
        prevActivities.map((activity) => {
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
        }),
      );
    }
  }, [availableExercises]);

  const addActivity = () => {
    setActivities((prev) => [
      ...prev,
      {
        id: 'act-' + Date.now(),
        selectedExerciseId: 'add_new',
        isNew: true,
        exerciseName: '',
        exerciseType: 'Lift',
        sets: [{ reps: '', weight: '' }],
        defaultDuration: '',
        defaultUnit: '',
      },
    ]);
  };

  const updateActivityField = (
    index: number,
    field: keyof ActivityInput,
    value: string | boolean | 'Lift' | 'Cardio',
  ) => {
    setActivities((prev) => {
      const updated = [...prev];
      updated[index][field] = value as any;
      return updated;
    });
  };

  const updateSetField = (
    activityIndex: number,
    setIndex: number,
    field: keyof SetInput,
    value: string,
  ) => {
    setActivities((prev) => {
      const updated = [...prev];
      updated[activityIndex].sets[setIndex][field] = value;
      return updated;
    });
  };

  const addSetToActivity = (activityIndex: number) => {
    setActivities((prev) => {
      const updated = [...prev];
      updated[activityIndex].sets.push({ reps: '', weight: '' });
      return updated;
    });
  };

  const handleExerciseSelectionChange = (index: number, selectedValue: string) => {
    if (selectedValue === 'add_new') {
      updateActivityField(index, 'selectedExerciseId', 'add_new');
      updateActivityField(index, 'isNew', true);
      updateActivityField(index, 'exerciseName', '');
      updateActivityField(index, 'sets', [{ reps: '', weight: '' }]); // reset sets
      updateActivityField(index, 'defaultDuration', '');
      updateActivityField(index, 'defaultUnit', '');
    } else {
      updateActivityField(index, 'selectedExerciseId', selectedValue);
      updateActivityField(index, 'isNew', false);
      const found = availableExercises.find((ex) => ex._id === selectedValue);
      if (found) {
        updateActivityField(index, 'exerciseName', found.name);
        updateActivityField(index, 'exerciseType', found.type);
        if (found.type === 'Lift') {
          updateActivityField(index, 'sets', [{ reps: '', weight: '' }]); // reset to one blank set
        } else if (found.type === 'Cardio') {
          updateActivityField(index, 'defaultDuration', '');
          updateActivityField(index, 'defaultUnit', '');
        }
      }
    }
  };

  const isValidWorkout = () => {
    if (!workoutName.trim()) return false;
    if (activities.length === 0) return false;
    // Must have at least one activity with a nonzero rep value (for lifts)
    return activities.some((act) => {
      if (act.exerciseType === 'Lift') {
        return act.sets.some((set) => parseInt(set.reps, 10) > 0);
      } else if (act.exerciseType === 'Cardio') {
        return act.defaultDuration && parseInt(act.defaultDuration, 10) > 0;
      }
      return false;
    });
  };

  const handleSaveWorkout = async () => {
    if (!isValidWorkout()) {
      Alert.alert(
        'Validation',
        'Please enter a workout name and at least one activity with a valid rep value.',
      );
      return;
    }
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
      userId: 1,
      name: workoutName,
      activities: convertedActivities,
    });
    await fetchTemplates(); // refresh templates list
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
            <>
              <TextInput
                placeholder="Enter New Exercise Name"
                placeholderTextColor="#888"
                value={activity.exerciseName}
                onChangeText={(text) => updateActivityField(idx, 'exerciseName', text)}
                style={commonStyles.input}
              />
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}
              >
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
              {activity.exerciseType === 'Lift' && (
                <View>
                  <Text style={commonStyles.itemText}>Sets:</Text>
                  {activity.sets.map((set, setIdx) => (
                    <View
                      key={`${activity.id}-${setIdx}`}
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
              {activity.exerciseType === 'Cardio' && (
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
          {activity.selectedExerciseId !== 'add_new' && activity.exerciseType === 'Lift' && (
            <View>
              <Text style={commonStyles.itemText}>Sets:</Text>
              {activity.sets.map((set, setIdx) => (
                <View
                  key={`${activity.id}-${setIdx}`}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}
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
        </View>
      ))}
      <View style={{ marginVertical: 20 }}>
        <Button
          title="Save Workout"
          onPress={handleSaveWorkout}
          color="#4a90e2"
          disabled={!isValidWorkout()}
        />
      </View>
    </ScrollView>
  );
};

export default CreateEditWorkoutScreen;
