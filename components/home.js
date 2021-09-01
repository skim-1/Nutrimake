import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';

import Pillwidget from './Pillwidget';
import Dietwidget from './Dietwidget';

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <ScrollView style={styles.scrollView}>

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

      </ScrollView>

      <View styles={styles.footer}>

        <View styles={styles.TaskBar}>

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
  },
  scrollView: {
    marginHorizontal: 20,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#636363'
  }
});
