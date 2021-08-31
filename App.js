import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Pillwidget from './components/Pillwidget';
import Dietwidget from './components/Dietwidget';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome</Text>
      </View>
      <View style={styles.taskContainer}>
        <View style={styles.taskwidget}>
          <Pillwidget />
        </View>
        <View style={styles.taskwidget}>
          <Dietwidget />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  titleContainer: {
    paddingTop: 60,
    paddingLeft: 35,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 48,
  },
  taskContainer: {
    alignItems: 'center',
    paddingTop: 5,
  },
  taskwidget: {
    paddingTop: 10,
  }
});
