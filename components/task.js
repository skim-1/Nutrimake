import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskItem = () => {

  return (
    <View style={styles.task}>

    </View>
  )
}

const styles = StyleSheet.create({
  task: {
    width: 345,
    height: 55,
    backgroundColor: '#5E9EAC',
    borderRadius: 10,
  }
})

export default TaskItem;
