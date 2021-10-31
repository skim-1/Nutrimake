import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Button, ScrollView } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//
// await axios.post('https://nutriserver.azurewebsites.net/upload', {
//     firstName: 'Fred',
//     lastName: 'Flintstone'
//   })
//   .then(function (response) {
//     console.log(response);
//   })

export default function Cloudrecipes( { navigation } ) {
  const [recipes, setRecipes] = useState([]);
  const [rendert, rerender] = useState(false);

  useEffect( () => {
    (async () => {
      var object = {}
      await axios
        .get('http://nutriserver.azurewebsites.net/get')
        .then(d => setRecipes(d.data.recipes))
    })();
  }, [rendert])

  function checkrecipes() {
    if(recipes.length == 0) {
      return (
        <Text style={{color: '#787878', paddingTop: 5}}>{
          'no saved recipes'
        }</Text>
      )
    }
  }

  return (
    <View style={styles.container}>
        <View style = {styles.titleContainer}>
          <Text style={styles.title}>Community Recipes</Text>
        </View>

      <ScrollView>
      {checkrecipes()}

      {
        recipes.map((item, index) => {
          return(
            <TouchableOpacity style={styles.taskbuttons} onPress={() => navigation.navigate('Recipe', item)} key={index}>
              <View style = {styles.itemLeft}>
                <Text style={styles.btxt}>{item.name}</Text>
              </View>
              <View style = {styles.arrow}><AntDesign name="right" size={16} color="black"/></View>
            </TouchableOpacity>
          )
        })
      }

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  titleContainer: {
    paddingTop: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
    paddingBottom: 20,
    paddingTop: 10
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
    backgroundColor: '#00f95f',
    width: '100%',
    padding: 15,
    height: 60,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  btxt: {
    color: 'black',
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: "100%",
  },
  arrow: {
    width: 16,
    height: 16,
  },
  welcomecontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcometitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },
  welcomebutton: {
    width: '20%',
    marginTop: 30,
    height: '4%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  welcomeText: {
    textAlign: 'center'
  },
  sectiontitle: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 15
  }
});
