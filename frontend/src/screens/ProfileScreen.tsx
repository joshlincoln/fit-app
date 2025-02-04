import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import commonStyles from '../styles/commonStyles';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    age: '30',
    weight: '180 lbs',
    height: '5\'10"',
  });

  return (
    <View style={[commonStyles.container, commonStyles.centerContent]}>
      <Text style={commonStyles.screenTitle}>Profile</Text>
      <View style={{ width: '100%', padding: 16 }}>
        <Text style={commonStyles.itemText}>Name:</Text>
        <TextInput
          style={commonStyles.input}
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
        />
        <Text style={commonStyles.itemText}>Email:</Text>
        <TextInput
          style={commonStyles.input}
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
        />
        <Text style={commonStyles.itemText}>Age:</Text>
        <TextInput
          style={commonStyles.input}
          value={profile.age}
          onChangeText={(text) => setProfile({ ...profile, age: text })}
        />
        <Text style={commonStyles.itemText}>Weight:</Text>
        <TextInput
          style={commonStyles.input}
          value={profile.weight}
          onChangeText={(text) => setProfile({ ...profile, weight: text })}
        />
        <Text style={commonStyles.itemText}>Height:</Text>
        <TextInput
          style={commonStyles.input}
          value={profile.height}
          onChangeText={(text) => setProfile({ ...profile, height: text })}
        />
        <View style={commonStyles.buttonSpacing}>
          <Button title="Save Profile" onPress={() => {}} color="#4a90e2" />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
