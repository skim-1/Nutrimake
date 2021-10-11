import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button } from 'react-native';

import FetchJson from './fetchJson'

export default function Recipe({navigation}) {
  var data = [];

  FetchJson('carrot').then(d => data = d);
  const print = () => {
      console.log(navigation.getParam('upclist'));
  }




  // data.foods.foreach(value => {console.log(value)});

  return (
    <View style={styles.container}>
      <Button title={'asfdasdf'} onPress={() => print()}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 45
  },
});
