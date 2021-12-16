import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import JobHelperMainScreen from './components/JobHelperMainScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#1d292f'} barStyle='light-content'/>
      <JobHelperMainScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121b22'
  },
});
