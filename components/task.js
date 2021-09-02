import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Checkbox from './checkbox';

const TaskItem = () => {

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={{paddingRight: 15}}>
          <Checkbox/>
        </View>
        <Text style={styles.taskText}>asdff</Text>
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
});

export default TaskItem;
