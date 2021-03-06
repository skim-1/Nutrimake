import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Setup( { navigation } ) {
  const [age, setage] = useState();
  const [weight, setweight] = useState();
  const [height, setheight] = useState();

  const confirmHandler = () => {
    try {
      AsyncStorage.setItem('@healthinfo', JSON.stringify({age: age, weight: weight, height: height}))
    } catch (e) {
      console.log(e)
    }

    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set your information</Text>


      <View style={styles.inputswrap}>
        <View style={styles.inputwrapper}>
          <Text style={styles.titles}>Age:</Text>

          <TextInput
          style={styles.input}
          onChangeText={setage}
          value={age}
          keyboardType="numeric"
          placeholder="age"
          returnKeyType={'done'}
          />
        </View>


        <View style={styles.inputwrapper}>
          <Text style={styles.titles}>Weight:</Text>

          <TextInput
          style={styles.input}
          onChangeText={setweight}
          value={weight}
          keyboardType="numeric"
          placeholder="lbs"
          returnKeyType={'done'}
          />
          </View>

        <View style={styles.inputwrapper}>

          <Text style={styles.titles}>Height:</Text>

          <TextInput
          style={styles.input}
          onChangeText={setheight}
          value={height}
          keyboardType="numeric"
          placeholder="in"
          returnKeyType={'done'}
          />
        </View>

      </View>

      <TouchableOpacity onPress={() => confirmHandler()}>
            <View style={{height: 47,
                          borderRadius: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: 'black',
                          borderWidth: 1,
                          paddingLeft: 15,
                          paddingRight: 15,
                          width: 300,
                          marginTop: 20,
                          }}>
              <Text style={styles.conText}>Continue</Text>
            </View>
          </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 100,
    alignItems: 'center',
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold'
  },
  inputwrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10
  },
  confirmbutton: {
    width: '20%',
    marginTop: 30,
    height: '4%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  conText: {
    textAlign: 'center'
  },
  inputswrap: {
    alignItems: 'flex-end'
  },
  titles: {
    textAlign: 'left',
    marginRight: 10,
    marginTop: 9,
    marginBottom: 15,
    fontSize: 13,
  },
  input: {
    width: 80,
    maxWidth: 80,
    borderWidth: 1,
    borderColor: 'black',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    height: 35,
  }
});
