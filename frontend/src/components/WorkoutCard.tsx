import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WorkoutCardProps {
  name: string;
  date: string;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ name, date }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
});

export default WorkoutCard;
