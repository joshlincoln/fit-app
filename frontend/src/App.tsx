import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import WorkoutEditScreen from './screens/WorkoutEditScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const WorkoutStack = createStackNavigator();

// Stack navigator for the Workouts tab
function WorkoutStackNavigator() {
  return (
    <WorkoutStack.Navigator>
      <WorkoutStack.Screen name="WorkoutsMain" component={WorkoutScreen} options={{ headerShown: false }} />
      <WorkoutStack.Screen name="WorkoutEdit" component={WorkoutEditScreen} />
    </WorkoutStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Workouts') iconName = 'barbell';
            else if (route.name === 'Analytics') iconName = 'analytics';
            else if (route.name === 'Profile') iconName = 'person';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1E3A8A',
          tabBarInactiveTintColor: 'gray'
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Workouts" component={WorkoutStackNavigator} options={{ headerShown: false }} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
