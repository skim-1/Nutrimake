import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';

//chicken

export default function Home({navigation}) {

  const HomePressHandler = () => {
    navigation.navigate('Home')
  }

  const ScanPressHandler = () => {
    navigation.navigate('Scanner')
  }

  const RecipePressHandler = () => {
    navigation.navigate('Recipe')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome</Text>
        </View>


        <TouchableOpacity style={styles.taskbuttons} onPress={ScanPressHandler}>
            <Text style={styles.btxt}>New Recipe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.taskbuttons} onPress={RecipePressHandler}>
            <Text style={styles.btxt}>View Current Recipe</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15
  },
  titleContainer: {
    paddingTop: 50,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 48,
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
  taskbuttons: {
    backgroundColor: '#005470',
    width: '100%',
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
  },
  btxt: {
    color: 'white',
    padding: 5,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 15
  },
});
