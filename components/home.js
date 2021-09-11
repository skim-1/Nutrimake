import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';

import Pillwidget from './widgets/Pillwidget';
import Dietwidget from './widgets/Dietwidget';
import Bojo from './widgets/bojowidget';
import Mentwidget from './widgets/mentwidget.js';
import Muscle from './widgets/musclewidget.js';
import Skin from './widgets/skinwidget.js';
import TaskItem from './task';

export default function Home({navigation}) {

  const HomePressHandler = () => {
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <ScrollView style={styles.scrollView}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome</Text>
        </View>

        <View style={styles.taskContainer}>

          <TouchableOpacity>
              <View style={styles.taskwidget}>
                <Pillwidget />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.taskwidget}>
                <Mentwidget />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.taskwidget}>
                <Dietwidget />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.taskwidget}>
                <Bojo />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.taskwidget}>
                <Skin />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.taskwidget}>
                <Muscle />
            </View>
          </TouchableOpacity>
          
        </View>

      </ScrollView>

      <View style={styles.footer}>

        <View style={styles.TaskBar}>

          <View style={styles.iconContainer}>

            <TouchableOpacity styles={styles.icons} onPress={HomePressHandler}>
              <Text> test </Text>
            </TouchableOpacity>

          </View>

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
    paddingTop: 50,
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
    borderTopColor: '#636363',
    paddingBottom: 45,
    paddingLeft: 30,
  },
  iconContainer: {
    paddingTop: 25
  },
  icons: {

  },
});
