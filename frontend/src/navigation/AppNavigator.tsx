// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import CreateEditWorkoutScreen from '../screens/CreateEditWorkoutScreen'; 
import StartSessionScreen from '../screens/StartSessionScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import commonStyles from '../styles/commonStyles';

const HomeStack = createStackNavigator();
const WorkoutsStack = createStackNavigator();

const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="StartSession" component={StartSessionScreen} options={{ title: 'Start Session' }} />
  </HomeStack.Navigator>
);

const WorkoutsStackNavigator = () => (
  <WorkoutsStack.Navigator>
    <WorkoutsStack.Screen name="WorkoutsMain" component={WorkoutsScreen} options={{ headerShown: false }} />
    <WorkoutsStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: 'Workout Detail' }} />
    {/* Add the CreateEditWorkout route so that the "Add Workout" button can navigate here */}
    <WorkoutsStack.Screen name="CreateEditWorkout" component={CreateEditWorkoutScreen} options={{ title: 'Create/Edit Workout' }} />
    <WorkoutsStack.Screen name="StartSession" component={StartSessionScreen} options={{ title: 'Start Session' }} />
  </WorkoutsStack.Navigator>
);

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: commonStyles.activeTabIcon.color,
        tabBarInactiveTintColor: commonStyles.inactiveTabIcon.color,
        tabBarStyle: commonStyles.tabBar,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Workouts':
              iconName = 'barbell';
              break;
            case 'Analytics':
              iconName = 'stats-chart';
              break;
            case 'Profile':
              iconName = 'person';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Workouts" component={WorkoutsStackNavigator} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
