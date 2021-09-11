import React, { useState } from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';

import TaskItem from './task.js';

export default function TodoList({ navigation }) {
  const [tasks, settask] = useState([
      {'name' : 'task1'},
      {'name' : 'task2'},
      {'name' : 'task3'},
      {'name' : 'task4'},
      {'name' : 'task5'},
      {'name' : 'task6'},
      {'name' : 'task7'},
      {'name' : 'task8'},
      {'name' : 'task9'},

    ]);

  const completetask = (index) => {
    let itemsCopy = [...tasks];
    itemsCopy.splice(index, 1);
    settask(itemsCopy)
  }

  const pressHandler = () => {
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>

      <StatusBar barStyle="dark-content"/>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Tasks</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.tasks}>

          {
            tasks.map((item, index) => {
              return (
                  <TouchableOpacity key={index}>
                    <View style={styles.item}>
                      <View style={styles.itemLeft}>
                        <View style={{paddingRight: 15}}>
                          <TouchableOpacity style={styles.dcontainer} onPress={() => completetask(index)}><View style={styles.dButton} /></TouchableOpacity>
                        </View>
                        <Text style={styles.taskText}>{item.name}</Text>
                      </View>
                      <View style={styles.circular}></View>
                    </View>
                  </TouchableOpacity>
              ) 
            })
          }

        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={pressHandler}>
          <Text style={styles.footerText}>Dismiss</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9'
  },
  titleContainer: {
    paddingTop: 60,
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 48,
    textAlign: 'auto',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 45,
  },
  footerButton: {
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: '#383838',
    borderWidth: 1
  },
  footerText: {
    fontSize: 20,
    color: '#383838'
  },
  tasks: {
    paddingTop: 15,
    alignItems: 'center'
  },
  taskitems: {
    paddingVertical: 0,
  },
  item: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 15,
    height: 55,
    width: 350,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  taskText: {
    maxWidth: '80%',
  },
  dButton: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#4EA3B0"
  },
  dcontainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }

});
