import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button } from 'react-native';

import FetchJson from './fetchJson'

import FoodItem from './FoodItem'

export default function Recipe({navigation}) {
  var data = [];
  const [foodItem, setFoodItem] = useState();
  const [food, setFood] = useState([]);

  const handleAddFoodItem = () => {
    //swap the 070796400087 for the passable variable that contains the UPC code from the BarCodeScanner
    FetchJson('070796400087').then(d => data = d);
    setTimeout(function(){setFoodItem(data.foods[0].description) }, 600);
    setTimeout(function(){setFood([...food, foodItem]) }, 200);
    setTimeout(function(){setFoodItem(null); }, 200);
  }

  const completeFoodItem = (index) => {
    let foodCopy = [...food];
    foodCopy.splice(index, 1);
    setFood(foodCopy)
  }

  /* This chunk of code is for testing purposes
  FetchJson('070796400087').then(d => data = d);
  const print = () => {
      // logs the kilocalories per serving of the food scanned
      setTimeout(function(){console.log(data.foods[0].foodNutrients[3].value); }, 1000);
  }*/

  const gotoscan = () => {
      navigation.goBack('Scanner')
  }

  // data.foods.foreach(value => {console.log(value)});

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
      >

      <View style={styles.tasksWrapper}>

        <Text style={styles.sectionTitle}>Your Ingredients</Text>
        <View style={styles.items}>
          {
            food.map((item, index) => {
              return (
                <TouchableOpacity key={index}  onPress={() => completeFoodItem(index)}>
                  <FoodItem text={item} />
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>

      </ScrollView>
        <TouchableOpacity onPress={() => handleAddFoodItem()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 45
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});
