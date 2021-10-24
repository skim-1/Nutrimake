import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

//chicken

export default function Home({navigation}) {
  const [recipes, setRecipes] = useState([]);
  const [newuser, setnewuser] = useState(false);
  const [reciepesloaded, setloaded] = useState(false);

  const continueHandler = () => {
    navigation.navigate('Setup');
    setnewuser(false);
  }

  async function loadRecipe() {
    try {
      const value = await AsyncStorage.getItem('@recipes');

      if(value !== null && !reciepesloaded) {
        var recipeJSON = await JSON.parse(value);
        var recipelist = [];
        recipeJSON.recipes.map((item, index) => {
          recipelist.push(item);
        })
        setRecipes(recipelist);
        setloaded(true);
      }
      console.log(recipelist);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect( () => {
    (async () => {
      //for checking if stuff has happened
      try {
        const value = await AsyncStorage.getItem('@healthinfo');

        if(value == null) {
          setnewuser(true);
        }
      } catch (e) {
        console.log(e);
      }


      //for loading saved recipes
      try {
        const value = await AsyncStorage.getItem('@recipes');

        if(value !== null) {
          var recipeJSON = await JSON.parse(value);
          var recipelist = [];
          recipeJSON.recipes.map((item, index) => {
            recipelist.push(item);
          })
          setRecipes(recipelist);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  if(navigation.getParam('new') == true) {
    loadRecipe();
  }

  const HomePressHandler = () => {
    navigation.navigate('Home')
  }

  const RecipePressHandler = () => {
    navigation.navigate('Recipe')
  }

  const QrPressHandler = () => {
    navigation.navigate('ViewQr')
  }

  function checkrecipes() {
    if(recipes.length == 0) {
      return (
        <Text style={{color: '#787878', paddingTop: 5}}>{
          'no saved recipes'
        }</Text>
      )
    }
  }

  if(newuser) {
    return (
      <View style={styles.welcomecontainer}>
        <StatusBar barStyle="dark-content"/>

        <Text style={styles.welcometitle}>Welcome to Simpliscan</Text>

        <TouchableOpacity style={styles.welcomebutton} onPress={() => continueHandler()}>
          <Text style={styles.welcomeText}>Continue</Text>
        </TouchableOpacity>
      </View>
    )
  } else {
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

          <TouchableOpacity style={styles.taskbuttons} onPress={() => AsyncStorage.clear()}>
            <View style = {styles.itemLeft}>
              <Text style={styles.btxt}>Test</Text>
            </View>
            <View style = {styles.arrow}><AntDesign name="right" size={16} color="white"/></View>
          </TouchableOpacity>

          <Text style={styles.sectiontitle}>Stored Recipes:</Text>

          <ScrollView>
          {checkrecipes()}

          {
            recipes.map((item, index) => {
              return(
                <TouchableOpacity style={styles.taskbuttons} onPress={() => navigation.navigate('Recipe', item)} key={index}>
                  <View style = {styles.itemLeft}>
                    <Text style={styles.btxt}>{item.name}</Text>
                  </View>
                  <View style = {styles.arrow}><AntDesign name="right" size={16} color="white"/></View>
                </TouchableOpacity>
              )
            })
          }

          </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
