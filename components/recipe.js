import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button, TextInput, KeyboardAvoidingView, Keyboard} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import axios from 'axios';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Donut from './Donut'
import Task from './task';

export default function Recipe({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [imported, setImported] = useState(false);
  var data = [];
  const [food, setFood] = useState([]);
  const [form, setForm] = useState(false);
  const [cCode, setcurrent] = useState();
  const [cbcode, setcurrentcode] = useState();
  const [codes, setCodes] = useState([]);
  const [codesj, setCodesj] = useState([]);
  const [editpage, setEdit] = useState(false);
  const [cEdit, setcedit] = useState();
  const [egrams, setegram] = useState();
  const [etitle, setetitle] = useState();
  const [rname, setrname] = useState("Untitled Recipe");
  var healthinfo = {age:0,weight:0,height:0}

  const [recipePage, setRecipePage] = useState(false);
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);


  const handleAddFoodItem = () => {
    (async () => {
      let codee = codes[codes.length-1];
      await axios
        .get('https://api.nal.usda.gov/fdc/v1/foods/search?query=' + codee + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1')
        .then(d => data = d).then(d => {
          const objecct = data;
          const objeccct = objecct.data.foods[0];
          if(objeccct !== undefined || objecct.totalHits === 0) {
            setFood(dat => [...dat, objeccct]);
          } else {
            setCodes(codes.filter((item, index) => index !== codes.length - 1));
            setCodesj(codesj.filter((item, index) => index !== codesj.length - 1));
            alert("Not in the database!");

          }
        })
    })();
  }

  function getColor(value){
    if(value > .35) {
      return 'red';
    } else if(value > .28) {
      return '#e8f000';
    } else {
      return 'green';
    }
  }

  const calcCals = () => {
    if (gender) {
      maxCals = 10*healthinfo.weight + 6.25*healthinfo.height - 5*healthinfo.age - 161;
    }
    else {
      maxCals = 10*healthinfo.weight + 6.25*healthinfo.height - 5*healthinfo.age + 5;
    }
  }
  let maxCals = 2450;

  const piedata = [{
    percentage: 500,
    color: 'tomato',
    max: maxCals
  },]

  const delItem = (index) => {
    let foodCopy = [...codes];
    foodCopy.splice(index, 1);
    setCodes(foodCopy);
  }


  useEffect( () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      try {
        var infojson = JSON.parse(await AsyncStorage.getItem('@healthinfo'));
        healthinfo.age = parseInt(infojson.age);
        healthinfo.weight = parseInt(infojson.weight);
        healthinfo.height = parseInt(infojson.height);
      } catch (e) {
        console.log('this part not working');
        console.log(e);
      }

      var datajson = navigation.getParam('data');
      if (datajson !== undefined && !imported) {
        setrname(navigation.getParam('name'));
        setTaskItems(navigation.getParam('recipe'));
        setImported(true);
        let codelist = [];
        datajson.map((item, index) => {
          codelist.push(item.code);
        });
        setCodes(codelist);
        setCodesj(datajson);
        for (let i = 0; i < datajson.length; i++) {
          let cod = datajson[i].code;
          await axios
            .get('https://api.nal.usda.gov/fdc/v1/foods/search?query=' + cod + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1')
            .then(d => data = d).then(d => {
              const objecct = data;
              const objeccct = objecct.data.foods[0];
              setFood(dat => [...dat, objeccct]);
              //console.log(food);
            })
        }
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => { //this runs when barcode is scanned (alert that it was scanned used to be here
    setScanned(true);
    let ddata = data;
    ddata = ddata.substring(1);
    setcurrentcode(ddata);
    setCodes(dat => [...dat, ddata]);
    handleScanFinished();
    //console.log(codes);
    //handleAddFoodItem();
  };

  const handleScanFinished = () => {
    setScanning(false);
    setScanned(true);
    setForm(true);
  }

  const handleFormSubmit = () => {
    if(cCode != undefined) {
      setForm(false);
      setCodesj(dat => [...dat, {"code": cbcode, "grams": cCode}]);
      setcurrent();
      handleAddFoodItem();
    } else {
      alert("Please type in the amount of grams!")
    }
  }

  const handleEdit = () => {
    var editFoods = food;
    var editcodesj = codesj;

    editFoods[cEdit].description = etitle;
    editcodesj[cEdit].grams = egrams;

    setFood(editFoods);
    setCodesj(editcodesj);
    setEdit(false);
  }

  const handleStartEdit = (index) => {
    setEdit(true);
    setcedit(index);
    setegram(codesj[index].grams)
    setetitle(food[index].description.replace(/['"]+/g, ''));
  }

  const startScan = () => {
    setScanned(false);
    setScanning(true);
  }

  const saveRecipe = async () => {
    try {
      const value = await AsyncStorage.getItem('@recipes');
      if(value !== null) { //if recipes already exists (there are already saved recipes)
        var recipelist = await JSON.parse(value);

        recipelist.recipes = recipelist.recipes.filter(item => item.name !== rname);

        recipelist.recipes.push(exportJSON());

        try {
          await AsyncStorage.setItem('@recipes', JSON.stringify(recipelist));
        } catch (e) {
          // saving error
          console.log(e);
        }
      } else { //no saved recipes
        try {
          var jsonout = {recipes: []};
          jsonout.recipes.push(exportJSON());
          await AsyncStorage.setItem('@recipes', JSON.stringify(jsonout));
        } catch (e) {
          // saving error
          console.log(e);
        }
      }
    } catch(e) {
      // error reading value
      console.log(e);
    }

    navigation.navigate('Home', {'new': true});
  }

  const searchStart = () => {
    navigation.navigate('Search', {data: exportJSON()})
  }

  function exportJSON() {
    console.log(taskItems);
    var obj = {"data": [], "name": rname, "recipe": taskItems};
    codesj.map((item, index) => {
      obj['data'].push(item);
    });
    return obj;
  }

  const genQR = () => {
    //console.log(JSON.stringify(obj));
    navigation.navigate('ExportQR', {'json': JSON.stringify(exportJSON())});
  }

  //get nutrition fact functions

  const handleRecipePage = () => {
    setRecipePage(true);
  }

  const getNutrient = ( id ) => {
    var val = 0;


    food.map((item, index) => {
      if( item.foodNutrients.find(x => x.nutrientId === id) !== undefined) {
        val += item.foodNutrients.find(x => x.nutrientId === id).value * (codesj[index].grams / 100);
      } else {
        val += 0;
      }
    })

    return val;
  }

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    setTask(null);
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  const checkempty = () => {
    if(food[0] == undefined) {
      return(
        <Text style={{
          color: '#787878'
        }}>Click the plus to add ingredients</Text>
      )
    }
  }


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (recipePage) {
    return (
      <View style={recipestyles.container}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1
          }}
          keyboardShouldPersistTaps='handled'
        >
        <View style={{flexDirection: 'row', marginTop: 50, marginLeft: 20}}>
            <TouchableOpacity style={styles.backRecipe} onPress={() => setRecipePage(false)}>
              <Text style={styles.backtext}>{"< Go Back"}</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Recipe List</Text>
        </View>

        {/* Today's Tasks */}
        <View style={recipestyles.tasksWrapper}>
          <Text style={recipestyles.sectionTitle}>Today's tasks</Text>
          <View style={recipestyles.items}>
            {/* This is where the tasks will go! */}
            {
              taskItems.map((item, index) => {
                return (
                  <TouchableOpacity key={index}  onPress={() => completeTask(index)}>
                    <Task text={item} />
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>

        </ScrollView>

        {/* Write a task */}
        {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={recipestyles.writeTaskWrapper}
        >
          <TextInput style={recipestyles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={recipestyles.addWrapper}>
              <Text style={recipestyles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>

      </View>
    );
  }
  else if (scanning) {
    return (
      <View style={styles.containerscan}>

        <TouchableOpacity style={styles.back} onPress={() => setScanning(false)}>
          <Text style={styles.backtext}>{"< Go Back"}</Text>
        </TouchableOpacity>

        <Text style={styles.camtitle}>Scan a barcode</Text>

        <View style={styles.container}>

          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={[StyleSheet.absoluteFill, styles.camcontainer]}
          >
            <View style={styles.layerTop} />
            <View style={styles.layerCenter}>
              <View style={styles.layerLeft} />
              <View style={styles.focused} />
              <View style={styles.layerRight} />
            </View>
            <View style={styles.layerBottom} />
          </BarCodeScanner>

          <Text style={styles.camtext}>This scanner will work better in good lighting conditions</Text>
        </View>
      </View>
    )
  } else if(form) {
    return (
      <View style={styles.container}>
        <Text style={styles.tboxtext}>How many grams?</Text>

        <Text style={styles.tboxtext}>Edit</Text>
        <TextInput
        style={styles.input}
        onChangeText={setcurrent}
        value={cCode}
        keyboardType="numeric"
        placeholder="grams"
        />

        <Button title={"Enter"} onPress={() => handleFormSubmit()}/>
      </View>
    )
  } else if (editpage) {
    return (
      <View style={styles.container}>

        <TextInput
        style={styles.input}
        onChangeText={setegram}
        value={egrams}
        keyboardType="numeric"
        placeholder="grams"
        />
        <TextInput
        style={styles.input}
        onChangeText={setetitle}
        value={etitle}
        placeholder="Name"
        />
        <Button title={"Enter"} onPress={() => handleEdit()}/>
      </View>
    )
  } else {
    return (
      <View style={styles.listcontainer}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}

        <TextInput
          style={styles.titlein}
          onChangeText={setrname}
          value={rname}
          placeholder={"name of recipe"}
        />
        <View style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          flexGrow: 1,
        }}>

          <ScrollView >

          <Text style={styles.sectionTitle}>Nutrition Facts</Text>
            {/* Added this scroll view to enable scrolling when list gets longer than the page */}

            <View style={styles.infoGraphs}>
              <View>
                <Text>{"Protein: " + Math.round(getNutrient( 1003 ) * 100) / 100 + " grams"}</Text>
                <Text>{"Total Lipids (fat): " + Math.round(getNutrient( 1004 ) * 100) / 100 + " grams"}</Text>
                <Text>{"Carbohydrates: " + Math.round(getNutrient( 1005 ) * 100) / 100 + " grams"}</Text>
                <Text>{"Total Sugars: " + Math.round(getNutrient( 2000 ) * 100) / 100 + " grams"}</Text>
                <Text>{"Fiber: " + Math.round(getNutrient( 1079 ) * 100) / 100 + " grams"}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', alignItems: 'center'}}>
                <Donut
                  percentage={Math.round(getNutrient( 1008 ) * 100) / 100}
                  color={getColor((Math.round(getNutrient( 1008 ) * 100) / 100)/maxCals)}
                  delay={500}
                  max={maxCals}/>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Your Ingredients</Text>


            <View style={styles.tasksWrapper}>

                <View style={styles.items}>
                {checkempty()}

                {
                  food.map((item, index) => {
                    return (
                      <View key={index} style={ItemStyle.item}>
                        <View style={ItemStyle.itemLeft}>
                          <View style={ItemStyle.square}></View>
                          <Text style={ItemStyle.itemText}>{item.description.replace(/['"]+/g, '') + ", " + codesj[index].grams + " Grams"}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleStartEdit(index)}><AntDesign name="edit" size={24} color="black" /></TouchableOpacity>
                      </View>
                    )
                  })
                }
                </View>

                <TouchableOpacity onPress={() => handleRecipePage()}>
                  <View style={styles.addWrapperQR}>
                    <Text style={styles.addTextQR}>Recipe Page</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </ScrollView>


            <View style = {styles.addButtons}>
              <TouchableOpacity onPress={() => startScan()}>
                <View style={styles.addWrapperBar}>
                  <Feather name="plus" size={30} style={{marginLeft:1}} color="black" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => searchStart()}>
                <View style={styles.addWrapperBar}>
                  <Text style={styles.addTextQR}>Add Manually</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => saveRecipe()}>
                <View style={styles.addWrapperQR}>
                  <Text style={styles.addTextQR}>Save Locally</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => genQR()}>
                <View style={styles.addWrapperQR}>
                  <Text style={styles.addTextQR}>Export as QR Code</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
      </View>

    )

  }

}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  containerscan: {
    flex: 1,
  },
  camcontainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 25
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tboxtext: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  enterButton: {
    width: '20%',
    height: 35,
    padding: 8,
    backgroundColor: '#00F95F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  listcontainer: {
    paddingTop: 45,
    marginHorizontal: 15,
    marginTop: 15,
    height: '92%'
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 10
  },
  homebutton: {
    width: '20%',
    height: 35,
    backgroundColor: '#00F95F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    width: '50%',
    borderRadius: 10,
  },
  addButtons: {
    backgroundColor: '#F2F2F2',
    paddingLeft: 15,
    paddingRight: 15,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  addWrapperBar: {
    width: 45,
    height: 45,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addWrapperQR: {
    height: 47,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 15
  },
  addTextBar: {
    fontSize: 40,
    fontWeight: '400',
  },
  addTextQR: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center'
  },
  camera: {
    height: '20%',
    width: '80%',
  },
  camtitle: {
    fontSize: 45,
    fontWeight: 'bold',
    marginLeft: 20
  },
  camtext: {
    width: '75%',
    textAlign: 'center',
    color : 'white',
    marginTop: 15,
    fontSize: 14,
    marginBottom: 200
  },
  backtext: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
  },
  back: {
    backgroundColor: "#00F95F",
    width: 85,
    marginTop: 50,
    height: 35,
    marginLeft: 20,
    justifyContent: 'center',
    borderRadius: 5
  },
  backRecipe: {
    backgroundColor: "#00F95F",
    width: 85,
    height: 35,
    marginLeft: 0,
    marginRight: 15,
    justifyContent: 'center',
    borderRadius: 5,
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
  titlein: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 15,
    padding: 5,
    paddingLeft: 15,
  },
  infoGraphs: {
    backgroundColor: '#F2F2F2',
    paddingLeft: 15,
    paddingRight: 15,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

const ItemStyle = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});

const recipestyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
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
