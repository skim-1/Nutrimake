import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

//chicken

export default function Home({navigation}) {

  const HomePressHandler = () => {
    navigation.navigate('Home')
  }

  const RecipePressHandler = () => {
    navigation.navigate('Recipe')
  }

  const QrPressHandler = () => {
    navigation.navigate('ViewQr')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome</Text>
        </View>


        <TouchableOpacity style={styles.taskbuttons} onPress={RecipePressHandler}>
          <View style = {styles.itemLeft}>
              <Text style={styles.btxt}>New Recipe</Text>
          </View>
          <View style = {styles.arrow}><AntDesign name="right" size={16} color="white"/></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.taskbuttons} onPress={QrPressHandler}>
          <View style = {styles.itemLeft}>
            <Text style={styles.btxt}>Import Recipe from QR Code</Text>
          </View>
          <View style = {styles.arrow}><AntDesign name="right" size={16} color="white"/></View>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfe4eb',
    padding: 15
  },
  titleContainer: {
    paddingTop: 50,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  iconContainer: {
    paddingTop: 25
  },
  taskbuttons: {
    backgroundColor: '#005470',
    width: '100%',
    padding: 15,
    height: 60,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  btxt: {
    color: 'white',
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: "100%",
  },
  arrow: {
    width: 16,
    height: 16,
  }
});
