import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskItem = (text) => {
  console.log(text);
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={{paddingRight: 15}}>
          <TouchableOpacity style={styles.dButton} />
        </View>
        <Text style={styles.taskText}>{text.text}</Text>
      </View>
      <View style={styles.circular}></View>
    </View>
)
}

const styles = StyleSheet.create({
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
  }
});

export default TaskItem;
