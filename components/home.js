import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

  const QuickScanHandler = () => {
    navigation.navigate('QuickScan')
  }

  const CloudrecipesHandler = () => {
    navigation.navigate('Cloudrecipes')
  }

  function checkrecipes() {
    if(recipes.length == 0) {
      return (
        <Text style={{color: '#787878', paddingTop: 5, marginLeft: 8}}>{
          'no saved recipes'
        }</Text>
      )
    }
  }

  if(newuser) {
    return (
      <View style={styles.welcomecontainer}>
        <StatusBar barStyle="dark-content"/>

        <Text style={styles.welcometitle}>Welcome to Nutrimake</Text>

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
            <Text style={styles.title}>Home</Text>
          </View>

          <View style={styles.itemContainerRowOne}>
            <TouchableOpacity style={styles.taskbuttons} onPress={RecipePressHandler}>
              <View style = {styles.itemLeft}>
                  <Text style={styles.btxt}>New Recipe</Text>
              </View>
              <View style = {styles.arrow}><AntDesign name="right" size={16} color="black"/></View>
            </TouchableOpacity>



            <TouchableOpacity style={styles.taskbuttons} onPress={QrPressHandler}>
              <View style = {styles.itemLeft}>
                <Text style={styles.btxt}>Import Recipe from QR Code</Text>
              </View>
              <View style = {styles.arrow}><AntDesign name="right" size={16} color="black"/></View>
            </TouchableOpacity>
          </View>

          <View style={styles.itemContainerRowOne}>
            <TouchableOpacity style={styles.taskbuttons} onPress={() => CloudrecipesHandler()}>
              <View style = {styles.itemLeft}>
                <Text style={styles.btxt}>Recipe MRKT</Text>
              </View>
              <View style = {styles.arrow}><AntDesign name="right" size={16} color="black"/></View>
            </TouchableOpacity>



            <TouchableOpacity style={styles.taskbuttons} onPress={() => QuickScanHandler()}>
              <View style = {styles.itemLeft}>
                <Text style={styles.btxt}>Nutrients    Quick Scan</Text>
              </View>
              <View style = {styles.arrow}><AntDesign name="right" size={16} color="black"/></View>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectiontitle}>Stored Recipes:</Text>

          <ScrollView>
          {checkrecipes()}

          {
            recipes.map((item, index) => {
              return(
                <TouchableOpacity style={styles.recipeButtons} onPress={() => navigation.navigate('Recipe', item)} key={index}>
                  <View style = {styles.itemLeftRecipes}>
                    <Text style={styles.btxtRecipes}>{item.name}</Text>
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
}

const styles = StyleSheet.create({
  itemLeftRecipes: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  recipeButtons: {
    backgroundColor: '#00F95F',
    width: '95%',
    padding: 15,
    height: 60,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'center',
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  btxtRecipes: {
    color: 'black',
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: "100%",
  },
  container: {
    flex: 1,
    padding: 15
  },
  titleContainer: {
    paddingTop: 50,
    marginLeft: 8
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
  itemContainerRowOne: {
    flexDirection: "row",
    maxWidth: "100%",
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'space-evenly'
  },
  taskbuttons: {
    backgroundColor: '#00F95F',
    width: '45%',
    padding: 15,
    height: 120,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5
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
    width: '30%',
    marginTop: 30,
    height: '6%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 18
  },
  sectiontitle: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 15,
    marginLeft: 8
  }
});
