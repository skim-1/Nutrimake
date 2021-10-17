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
  const [codes, setCodes] = useState([]);
  const [scanning, setScanning] = useState(false);
  var data = [];
  const [food, setFood] = useState([]);
  const [form, setForm] = useState(false);
  const [cCode, setcurrent] = useState();
  const [cbcode, setcurrentcode] = useState();
  const [codesj, setCodesj] = useState([]);

  if(navigation.getParam('data') !== undefined) {
    var datajson = navigation.getParam('data');
    var codelist = []
    datajson.map((item, index) => {
      codelist.push(item.code);
    })
    // setCodes(codelist);
    // setCodesj(datajson);
    console.log(codelist);
  }

  //console.log(codes);
  const handleAddFoodItem = () => {
    (async () => {
      let codee = codes[codes.length-1];
      console.log(codee);
      await axios
        .get('https://api.nal.usda.gov/fdc/v1/foods/search?query=' + codee + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1')
        .then(d => data = d).then(d => {
          const objecct = data;
          //console.log(objecct);
          const objeccct = objecct.data.foods[0];
          setFood(dat => [...dat, objeccct]);
        })
    })();
  }

  const completeFoodItem = (index) => {
    let foodCopy = [...codes];
    foodCopy.splice(index, 1);
    setCodes(foodCopy)
  }


  useEffect( () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      // if (codes.length != 0 && codes[0].length >6) {
      //   for (let i = 0; i < codes.length; i++) {
      //     let cod = codes[i];
      //     //console.log(cod);
      //     await axios
      //       .get('https://api.nal.usda.gov/fdc/v1/foods/search?query=' + cod + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1')
      //       .then(d => data = d).then(d => {
      //         const objecct = data;
      //         const objeccct = objecct.data.foods[0];
      //         setFood(dat => [...dat, objeccct]);
      //         //console.log(food);
      //       })
      //   }
      // }
    })();
  }, []);

  async function FetchJson(bcode) {
    const api_url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=' + bcode + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1';
    const response = await fetch(api_url);
    const data = await response.json();
    return data;
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
    console.log(food[0])
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
          <AntDesign name="leftcircle" size={32} color="black"/>
        </TouchableOpacity>

        <View style={styles.camcontainer}>

          <Text style={styles.camtitle}>Scan a barcode</Text>

          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={styles.camera}
          />

          <Text style={styles.camtext}>This scanner will work better in good lighting conditions</Text>
        </View>
      </View>
    )
  } else if(form) {
    return (
      <View style={styles.container}>
        <Text style={styles.tboxtext}>How many grams?</Text>
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
  } else {
    return (
      <View style={styles.listcontainer}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}


        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
          <Text>{"Calories: " + Math.round(getNutrient( 1008 ) * 100) / 100 + " KCAL"}</Text>
          <Text>{"Protein: " + Math.round(getNutrient( 1003 ) * 100) / 100 + " grams"}</Text>
          <Text>{"Total Lipid (fat): " + Math.round(getNutrient( 1004 ) * 100) / 100 + " grams"}</Text>
          <Text>{"Carbohydrates: " + Math.round(getNutrient( 1005 ) * 100) / 100 + " grams"}</Text>
          <Text>{"Total Sugars: " + Math.round(getNutrient( 2000 ) * 100) / 100 + " grams"}</Text>
          <Text>{"Fiber: " + Math.round(getNutrient( 1079 ) * 100) / 100 + " grams"}</Text>
          {/* Added this scroll view to enable scrolling when list gets longer than the page */}
          <Text style={styles.sectionTitle}>Your Ingredients</Text>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>

          <View style={styles.tasksWrapper}>

              <View style={styles.items}>
              {checkempty()}

              {

                food.map((item, index) => {
                  console.log(item);
                  return (
                    <TouchableOpacity key={index}  onPress={() => completeFoodItem(index)}>
                      <FoodItem text={item.slice(1, -1) + ", " + codesj[index].grams + " Grams"} />
                    </TouchableOpacity>
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

const styles = StyleSheet.create({
  containerscan: {
    flex: 1,
  },
  camcontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
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
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 15
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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
  camera: {
    height: '20%',
    width: '80%',
  },
  camtitle: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20
  },
  camtext: {
    width: '75%',
    textAlign: 'center',
    color : '#7a7a7a',
    marginTop: 15,
    fontSize: 14,
    marginBottom: 85
  },
  backtext: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  back: {
    marginTop: 50,
    marginLeft: 20,
    justifyContent: 'center',
    borderRadius: 5
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
    borderWidth: 2,
  },
  addWrapperQR: {
    marginTop: 5,
    height: 47,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  homebutton: {
    width: '20%',
    height: 35,
    backgroundColor: '#7a7a7a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  header: {
    paddingBottom: 5
  },
  addTextBar: {
    fontSize: 30,
    fontFamily: "Courier New",
    fontWeight: 'bold',
  },
  addTextQR: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
