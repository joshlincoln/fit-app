import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFitStore } from '../store/workout';
import { getExercises } from '../services/exercise';
import { Exercise } from '../models/exercise';

const SessionScreen = () => {
  const { params } = useRoute();
  const { templateId } = params || {};
  const { templates, sessions, createSession } = useFitStore();
  const navigation = useNavigation();
  const [sessionData, setSessionData] = useState<{
    [exerciseId: string]: { sets: { reps: string; weight: string }[] };
  }>({});
  const [timer, setTimer] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    getExercises().then(setExercises);
  }, []);

  // Start timer on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const workout = templates.find((t) => t._id === templateId);
  // Find the most recent session for this template (if any)
  const lastSession = sessions
    .filter((s) => s.templateId === templateId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  useEffect(() => {
    if (workout) {
      const initialData: { [key: string]: { sets: { reps: string; weight: string }[] } } = {};
      workout.activities.forEach((activity) => {
        // Try to prefill with values from last session if available
        const prevActivity =
          lastSession && lastSession.activities.find((a: any) => a.id === activity.exercise);
        initialData[activity.exercise] = {
          sets:
            prevActivity && prevActivity.sets && prevActivity.sets.length > 0
              ? prevActivity.sets.map((set: any) => ({
                  reps: set.reps.toString(),
                  weight: set.weight.toString(),
                }))
              : // Otherwise, use the template default sets if available; if not, one blank set.
                activity.defaultSets
                ? activity.defaultSets.map((set) => ({
                    reps: set.reps.toString(),
                    weight: set.weight.toString(),
                  }))
                : [{ reps: '', weight: '' }],
        };
      });
      setSessionData(initialData);
    }
  }, [workout, lastSession]);

  const handleInputChange = (
    exerciseId: string,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string,
  ) => {
    setSessionData((prev) => ({
      ...prev,
      [exerciseId]: {
        sets: prev[exerciseId].sets.map((set, idx) =>
          idx === setIndex ? { ...set, [field]: value } : set,
        ),
      },
    }));
  };

  const handleFinishSession = async () => {
    if (!workout) return;
    const activities = workout.activities.map((activity) => {
      const data = sessionData[activity.exercise];
      // Look up exercise details for name and type
      const ex = exercises.find((e) => e._id === activity.exercise);
      return {
        id: activity.exercise,
        name: ex ? ex.name : activity.exercise,
        type: ex ? ex.type : '',
        sets: data.sets.map((set) => ({
          reps: parseInt(set.reps, 10) || 0,
          weight: parseFloat(set.weight) || 0,
        })),
      };
    });
    await createSession({
      userId: 1,
      templateId: workout._id,
      date: new Date().toISOString(),
      duration: timer,
      activities,
      notes: '',
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Session: {workout ? workout.name : ''}</Text>
      <Text style={commonStyles.itemText}>Timer: {timer} seconds</Text>
      {workout &&
        workout.activities.map((activity) => {
          const ex = exercises.find((e) => e._id === activity.exercise);
          const activityData = sessionData[activity.exercise];
          return (
            <View key={activity.exercise} style={commonStyles.item}>
              <Text style={commonStyles.itemText}>
                {ex ? ex.name : activity.exercise} ({ex ? ex.type : ''})
              </Text>
              {activityData &&
                activityData.sets.map((set, setIdx) => (
                  <View
                    key={`${activity.exercise}-${setIdx}`}
                    style={{ flexDirection: 'row', marginVertical: 4 }}
                  >
                    <TextInput
                      placeholder="Reps"
                      placeholderTextColor="#888"
                      value={set.reps}
                      onChangeText={(text) =>
                        handleInputChange(activity.exercise, setIdx, 'reps', text)
                      }
                      style={[commonStyles.input, { flex: 1, marginRight: 8 }]}
                      keyboardType="numeric"
                    />
                    <TextInput
                      placeholder="Weight"
                      placeholderTextColor="#888"
                      value={set.weight}
                      onChangeText={(text) =>
                        handleInputChange(activity.exercise, setIdx, 'weight', text)
                      }
                      style={[commonStyles.input, { flex: 1 }]}
                      keyboardType="numeric"
                    />
                  </View>
                ))}
            </View>
          );
        })}
      <View style={{ marginVertical: 20 }}>
        <Button title="Finish Session" onPress={handleFinishSession} color="#4a90e2" />
      </View>
    </ScrollView>
  );
};

export default SessionScreen;
