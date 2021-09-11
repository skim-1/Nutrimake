import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Bojo = () => {

  return (
    <View style={styles.widgetcon}>
        <View style={styles.tbox}>
          <Text style={styles.titletext}>Bones and Joints</Text>
        </View>
        <Text>asdflakjsdf</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  titlestyle: {},
  titletext: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  widgetcon: {
    backgroundColor: '#00ff00',
    borderRadius: 5,
    marginRight: 15,
    width: 345,
    height: 195,
    paddingLeft: 10,
  },
  tbox:{
    paddingTop: 5,
  },
})

export default Bojo;
