import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Pillwidget = () => {

  return (
    <View style={styles.widgetcon}>
        <View style={styles.tbox}>
          <Text style={styles.titletext}>Pills and Medication</Text>
        </View>
        <Text style={styles.bodytext}>asdflakjsdf</Text>
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
    paddingLeft: 10
  },
  tbox:{
    paddingTop: 5,
  },
  bodytext:{
  }
})

export default Pillwidget;
