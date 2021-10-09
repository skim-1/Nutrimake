import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';



export default function Home({navigation}) {

  const HomePressHandler = () => {
    navigation.navigate('Home')
  }

  const ScanPressHandler = () => {
    navigation.navigate('Scanner')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <ScrollView style={styles.scrollView}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome</Text>
        </View>


        <TouchableOpacity style={styles.taskbuttons} onPress={ScanPressHandler}>
            <Text style={styles.btxt}>New Recipe</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>

        <View style={styles.TaskBar}>

          <View style={styles.iconContainer}>

            <TouchableOpacity styles={styles.icons} onPress={HomePressHandler}>
              <Text> test </Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>

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
  },
  btxt: {
    color: 'white',
    padding: 5,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 15
  },
});
