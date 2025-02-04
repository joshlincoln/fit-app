import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import commonStyles from '../styles/commonStyles';
import { useFitStore } from '../store/workout';
import { useNavigation } from '@react-navigation/native';

const WorkoutsScreen = () => {
  const { templates, loadingTemplates, error, fetchTemplates } = useFitStore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={commonStyles.item}
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item._id })}
    >
      <Text style={commonStyles.itemText}>Name: {item.name}</Text>
      <Text style={commonStyles.itemText}>Description: {item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.screenTitle}>Workouts</Text>
      {loadingTemplates ? (
        <ActivityIndicator size="large" color="#4a90e2" />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
      <View style={commonStyles.buttonSpacing}>
        <Button
            title="Add Workout"
            onPress={() => navigation.navigate('CreateEditWorkout')}
            color="#4a90e2"
            />
      </View>
    </View>
  );
};

export default WorkoutsScreen;
