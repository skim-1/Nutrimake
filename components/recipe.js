import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import FoodItem from './FoodItem';
import FetchJson from './fetchJson';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

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

  // if(navigation.getParam('data') !== undefined) {
  //   var datajson = navigation.getParam('data');
  //   var codelist = []
  //   datajson.map((item, index) => {
  //     codelist.push(item.code);
  //   })
  //   const [codes, setCodes] = useState(codelist);
  //   const [codesj, setCodesj] = useState(datajson);
  //   //console.log(codelist);
  // }
  //console.log(codes);
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

  const delItem = (index) => {
    let foodCopy = [...codes];
    foodCopy.splice(index, 1);
    setCodes(foodCopy)
  }


  useEffect( () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      var datajson = navigation.getParam('data');
      if (datajson !== undefined && !imported) {
        setImported(true);
        let codelist = [];
        datajson.map((item, index) => {
          codelist.push(item.code);
        });
        setCodes(codelist);
        setCodesj(datajson);
        for (let i = 0; i < datajson.length; i++) {
          let cod = datajson[i].code;
          console.log(cod);
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

  async function FetchJson(bcode) {
    const api_url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=' + bcode + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1';
    const response = await fetch(api_url);
    const data = await response.json();
    return data;
  }

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

    console.log(cEdit);
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

  const genQR = () => {
    var obj = {"data": []};
    codesj.map((item, index) => {
      obj['data'].push(item);
    });
    //console.log(JSON.stringify(obj));
    navigation.navigate('ExportQR', {'json': JSON.stringify(obj)});
  }

  //get nutrition fact functions

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

  const checkempty = () => {
    if(food[0] == undefined) {
      return(
        <Text>Click the plus to add ingredients</Text>
      )
    }
  }


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  if (scanning) {
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



        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          {/* Added this scroll view to enable scrolling when list gets longer than the page */}

          <Text>{"Calories: " + Math.round(getNutrient( 1008 ) * 100) / 100 + " KCAL"}</Text>
          <Text>{"Protein: " + Math.round(getNutrient( 1003 ) * 100) / 100 + " grams"}</Text>
          <Text>{"Total Lipid (fat): " + Math.round(getNutrient( 1004 ) * 100) / 100 + " grams"}</Text>
          <Text>{"Carbohydrates: " + Math.round(getNutrient( 1005 ) * 100) / 100 + " grams"}</Text>
          <Text>{"Total Sugars: " + Math.round(getNutrient( 2000 ) * 100) / 100 + " grams"}</Text>
          <Text>{"Fiber: " + Math.round(getNutrient( 1079 ) * 100) / 100 + " grams"}</Text>


          <Text style={styles.sectionTitle}>Your Ingredients</Text>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>

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

          <View style = {styles.addButtons}>
            <TouchableOpacity onPress={() => startScan()}>
              <View style={styles.addWrapperBar}>
                <Text style={styles.addTextBar}>+</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => genQR()}>
            <View style={styles.addWrapperQR}>
              <Text style={styles.addTextQR}>Export as QR Code</Text>
            </View>
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
  task: {
    backgroundColor: '#005470',
    width: '100%',
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 10,
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
    fontSize: 40,
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
  header: {
    paddingBottom: 5
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
    backgroundColor: '#FFF',
    paddingLeft: 15,
    paddingRight: 15,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  addWrapperBar: {
    width: 45,
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addWrapperQR: {
    marginTop: 5,
    width: 90,
    height: 47,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addTextBar: {
    fontSize: 40,
    fontFamily: "Courier New",
    fontWeight: '400',
  },
  addTextQR: {
    fontSize: 12,
    fontWeight: '500'
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
