import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import FoodItem from './FoodItem';
import FetchJson from './fetchJson';

export default function Recipe({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [codes, setCodes] = useState([]);
  const [scanning, setScanning] = useState(false);
  var data = [];
  const [foodItem, setFoodItem] = useState();
  const [food, setFood] = useState([]);
  const [form, setForm] = useState(false);
  const [cCode, setcurrent] = useState();
  const [cbcode, setcurrentcode] = useState();

  const handleAddFoodItem = () => {
    (async () => {
      let codee = codes[codes.length - 1];
      await axios
        .get('https://api.nal.usda.gov/fdc/v1/foods/search?query=' + codee + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1')
        .then(d => data = d).then(d => {
          const objecct = data;
          const objeccct = JSON.stringify(objecct.data.foods[0].description);
          setFoodItem(objeccct);
          setFood([...food, foodItem]);
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
      for (let i = 0; i < codes.length; i++) {
        let code = codes[i];
        await axios
          .get('https://api.nal.usda.gov/fdc/v1/foods/search?query=' + code + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1')
          .then(d => data = d).then(d => {
            const objecct = data;
            const objeccct = JSON.stringify(objecct.data.foods[0].description);
            setFoodItem(objeccct);
            food.push(objeccct);
            console.log(food);
          })
      }
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
    setcurrentcode(data);
    handleScanFinished();
    console.log(codes);
    handleAddFoodItem();
  };

  const handleScanFinished = () => {
    setScanning(false);
    setScanned(true);
    setForm(true);
  }

  const handleFormSubmit = () => {
    setForm(false);
    setCodes(dat => [...dat, {"code": cbcode, "grams": cCode}]);
    setcurrent();
    console.log(codes)
  }

  const startScan = () => {
    setScanned(false);
    setScanning(true);
  }

  const genQR = () => {
    var obj = {"data": []};
    codes.map((item, index) => {
      obj['data'].push(item);
    });
    console.log(JSON.stringify(obj));
    navigation.navigate('ExportQR', {'json': JSON.stringify(obj)});
  }


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  if (scanning) {
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
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
        />
        <Button title={"Enter"} onPress={() => handleFormSubmit()}/>
      </View>
    )
  } else {
    return (
      <View style={styles.listcontainer}>
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


          <TouchableOpacity onPress={() => startScan()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => genQR()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>Export as QR Code</Text>
          </View>
          </TouchableOpacity>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.homebutton} onPress={() => navigation.navigate('Home')}>
            <Text>Home</Text>
          </TouchableOpacity>
        </View>

      </View>

    )

  }

}

const styles = StyleSheet.create({
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
    fontWeight: 'bold'
  },
  homebutton: {
    width: '20%',
    height: 60,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
