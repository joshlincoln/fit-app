import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { commonStyles } from '../styles';
import { useNavigation } from '@react-navigation/native';

const workouts = [
  { id: '1', name: 'Chest Day', date: '2025-02-02', exercises: 5 },
  { id: '2', name: 'Back Day', date: '2025-02-01', exercises: 4 }
];

export default function WorkoutScreen() {
  const navigation = useNavigation();

  const handleWorkoutClick = (workout) => {
    navigation.navigate('WorkoutEdit', { workout });
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>Workouts</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleWorkoutClick(item)} style={commonStyles.card}>
            <View>
              <Text style={commonStyles.cardTitle}>{item.name}</Text>
              <Text style={commonStyles.cardText}>{item.date} • {item.exercises} exercises</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
