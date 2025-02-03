import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16
  },
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8
  },
  cardText: {
    fontSize: 14,
    color: '#cccccc'
  },
  input: {
    backgroundColor: '#1E1E1E',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    color: '#ffffff'
  }
});
