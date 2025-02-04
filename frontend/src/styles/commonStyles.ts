import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1e1e1e', // Dark background
  },
  screenTitle: {
    fontSize: 28,
    marginBottom: 16,
    fontWeight: '600',
    color: '#f0f0f0', // Light text
  },
  item: {
    padding: 16,
    backgroundColor: '#2a2a2a', // Slightly lighter dark grey
    borderRadius: 8,
    marginBottom: 12,
  },
  itemText: {
    fontSize: 18,
    color: '#f0f0f0',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
    marginBottom: 12,
    padding: 8,
    fontSize: 16,
    color: '#f0f0f0',
    backgroundColor: '#333',
  },
  buttonSpacing: {
    marginVertical: 8,
  },
  tabBar: {
    backgroundColor: '#1e1e1e',
    borderTopColor: '#444',
  },
  activeTabIcon: {
    color: '#4a90e2', // Blue accent
  },
  inactiveTabIcon: {
    color: '#888',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
