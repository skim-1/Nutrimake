import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button, TextInput, KeyboardAvoidingView, Keyboard} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import axios from 'axios';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Donut from './Donut'

export default function Ilist({navigation}) {
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
  const [rname, setrname] = useState();
  var healthinfo = {age:0,weight:0,height:0}

  const [maxCals, setcals] = useState(2450);

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

        setcals(2450);
      } catch (e) {
        console.log('this part not working');
        console.log(e);
      }

      var datajson = JSON.parse(await AsyncStorage.getItem('@ingredients'));
      // var datajson = navigation.getParam('data');
      console.log(datajson);
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

  const searchStart = () => {
    navigation.navigate('PSearch', {data: exportJSON()})
  }

  function exportJSON() {
    console.log(taskItems);
    var obj = {"data": [], "name": rname, "recipe": taskItems};
    codesj.map((item, index) => {
      obj['data'].push(item);
    });
    return obj;
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

  const uploadrecipe = async () => {
    await axios.post('https://nutriserver.azurewebsites.net/upload', exportJSON())
      .then(function (response) {
        console.log(response);
      })
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
        }}>Click the plus to scan and add ingredients</Text>
      )
    }
  }

  const deleteItem = () => {
    console.log(cEdit);
    setCodes(codes.filter((item, index) => index !== cEdit));
    setFood(food.filter((item, index) => index !== cEdit));
    setCodesj(codesj.filter((item, index) => index !== cEdit));
    setEdit(false);
  }

  const checkemptyrecipelist = () => {
    if(food[0] == undefined) {
      return(
        <Text style={{
          color: '#787878'
        }}>You have nothing scanned!</Text>
      )
    }
  }

  const goBack = () => {
    AsyncStorage.setItem('@ingredients', JSON.stringify(exportJSON().data));
    navigation.navigate('Pantry');
  }

  const Task = (props) => {

    return (
      <View style={recipeliststyles.item}>
        <View style={recipeliststyles.itemLeft}>
          <View style={ItemStyle.square}></View>
          <Text style={recipeliststyles.itemText}>{props.text}</Text>
        </View>
      </View>
    )
  }


  if (hasPermission === null) {
    return <Text>{'Requesting for camera permission'}</Text>;
  }
  if (hasPermission === false) {
    return <Text>{'No access to camera'}</Text>;
  }

  if (recipePage) {
    return (
      <View style={recipestyles.container}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}
        <View style={{flexDirection: 'row', marginTop: 40, padding: 10, alignSelf: 'center'}}>
          <TouchableOpacity style={{height: 47,
                                borderRadius: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: '#C0C0C0',
                                borderWidth: 1,
                                paddingLeft: 15,
                                paddingRight: 15,
                                width: 330,
                                marginTop: 1,
                                backgroundColor: 'white'
                                }} onPress={() => setRecipePage(false)}>
            <Text style={styles.backtext}>{"Back to Ingredient List"}</Text>
          </TouchableOpacity>

        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1
          }}
          keyboardShouldPersistTaps='handled'
        >
        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 20}}>
            <Text style={{fontSize: 24,
                          fontWeight: 'bold',
                          marginBottom: -20}}>{'Instructions'}</Text>
        </View>

        <View style={recipestyles.tasksWrapper}>
          <View style={recipestyles.items}>
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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={recipestyles.writeTaskWrapper}
        >
          <TextInput style={recipestyles.input} placeholder={'Write Instructions'} value={task} onChangeText={text => setTask(text)} />
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={{
                          width: 45,
                          height: 45,
                          borderRadius: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#C0C0C0',
                          borderWidth: 1,
                          marginLeft: -30
                        }}>
              <Feather name="plus" size={30} style={{marginLeft:1}} color="black" />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
  else if (scanning) {
    return (
      <View style={styles.containerscan}>
        <View style = {styles.rowContatiner}>
          <TouchableOpacity style={{height: 47,
                                borderRadius: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: '#C0C0C0',
                                borderWidth: 1,
                                paddingLeft: 15,
                                paddingRight: 15,
                                width: 330,
                                marginTop: 40,
                                marginBottom: -16}} onPress={() => setScanning(false)}>
            <Text style={styles.backtext}>{"Back to Ingredient List"}</Text>
          </TouchableOpacity>
        </View>

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

          <Text style={styles.camtext}>{'This scanner will work better in good lighting conditions'}</Text>
        </View>

        <View style = {styles.rowContatiner}>
          <TouchableOpacity style={{height: 47,
                                borderRadius: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: '#C0C0C0',
                                borderWidth: 1,
                                paddingLeft: 15,
                                paddingRight: 15,
                                width: 330,
                                marginTop: 8,
                                marginBottom: 20}} onPress={() => searchStart()}>
            <Text style={styles.backtext}>{"Add Manually"}</Text>
          </TouchableOpacity>
        </View>
      </View>

    )
  } else if(form) {
    return (
      <View style={styles.container}>
        <Text style={styles.tboxtext}>{"Mass in Grams of Ingredient"}</Text>

        <TextInput
        style={styles.input}
        onChangeText={setcurrent}
        value={cCode}
        keyboardType="numeric"
        placeholder="grams"
        />
        <TouchableOpacity onPress={() => handleFormSubmit()}>
            <View style={{height: 47,
                          borderRadius: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#C0C0C0',
                          borderWidth: 1,
                          paddingLeft: 15,
                          paddingRight: 15,
                          width: 300,
                          marginTop: 20
                          }}>
              <Text style={styles.addTextQR}>{"Finish"}</Text>
            </View>
          </TouchableOpacity>
      </View>
    )
  } else if (editpage) {
    return (
      <View style={styles.container}>
        <Text style = {{fontWeight: 'bold', fontSize: 40, marginBottom: 10}}>{"Edit"}</Text>
        <Text style = {{fontWeight: 'bold', fontSize: 20}}>{"Mass of Ingredient:"}</Text>
        <TextInput
        style={styles.input}
        onChangeText={setegram}
        value={egrams}
        keyboardType="numeric"
        placeholder="grams"
        />
        <Text style = {{fontWeight: 'bold', fontSize: 20}}>{"Ingredient Description:"}</Text>
        <TextInput
        style={styles.input}
        onChangeText={setetitle}
        value={etitle}
        placeholder="Name"
        />
        <View style = {{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => handleEdit()}>
            <View style={{height: 47,
                          borderRadius: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#C0C0C0',
                          borderWidth: 1,
                          paddingLeft: 15,
                          paddingRight: 15,
                          width: 300,
                          marginTop: 20
                          }}>
              <Text style={styles.addTextQR}>{"Finish Edits"}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteItem()}><AntDesign name="delete" size={24} color="black" /></TouchableOpacity>

        </View>
      </View>
    )
  } else {
    return (
      <View style={styles.listcontainer}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}

        <View style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 10,
          flexGrow: 1,
        }}>

        <TouchableOpacity style={styles.backButt} onPress={() => goBack()}>
          <Text>Done</Text>
        </TouchableOpacity>

        <View style = {{height: '80%', maxHeight: '80%'}}>
          <ScrollView >
            {/* Added this scroll view to enable scrolling when list gets longer than the page */}

            <Text style={styles.sectionTitle}>Your Foods</Text>


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

              </View>
            </ScrollView>
          </View>

            <TouchableOpacity style={styles.addButtons} onPress={() => startScan()}>
                <Text style={styles.addTextBar}>
                Add Item
                </Text>
            </TouchableOpacity>
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
  rowContatiner: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  tboxtext: {
    color: 'black',
    maxWidth: '80%',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center'
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
    height: '92%',
    maxHeight: '92%'
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
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    paddingRight: 15,
    maxWidth: 100
  },
  addTextBar: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: -20,
    textAlign: 'center'
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
    backgroundColor: "white",
    width: 85,
    marginTop: 50,
    borderWidth: 1,
    height: 35,
    marginLeft: 8,
    justifyContent: 'center',
    borderRadius: 5,
  },
  addManually: {
    backgroundColor: "white",
    borderWidth: 1,
    width: 95,
    marginTop: 50,
    height: 35,
    marginLeft: '23%',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 8,
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
    width: 20,
    height: 20,
    backgroundColor: '#00F95F',
    borderWidth: 2,
    borderColor: 'black',
    opacity: 0.8,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
});

const recipestyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
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
    borderRadius: 8,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: '75%',
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

const recipeliststyles = StyleSheet.create({
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
});
