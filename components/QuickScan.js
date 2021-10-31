import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Button, TextInput, KeyboardAvoidingView, Keyboard} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import axios from 'axios';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Donut from './Donut'

export default function QuickScan({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scanning, setScanning] = useState(true);
    const [imported, setImported] = useState(false);
    var data = [];
    const [food, setFood] = useState([]);
    const [form, setForm] = useState(false);
    const [cCode, setcurrent] = useState(100);
    const [cbcode, setcurrentcode] = useState();
    const [codes, setCodes] = useState([]);
    const [codesj, setCodesj] = useState([]);
    const [editpage, setEdit] = useState(false);
    const [cEdit, setcedit] = useState();
    const [egrams, setegram] = useState(100);
    const [etitle, setetitle] = useState();
    const [rname, setrname] = useState("Change Title");
    var healthinfo = {age:0,weight:0,height:0}
    const [title, setTitle] = useState("");

    const [recipePage, setRecipePage] = useState(false);
    const [task, setTask] = useState();
    const [taskItems, setTaskItems] = useState([]);

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

    const handleAddFoodItem = (upc) => {
        (async () => {
            let codee = upc;
            let chicken = "";
            await axios
            .get('https://api.nal.usda.gov/fdc/v1/foods/search?query=' + codee + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1')
            .then(d => data = d).then(d => {
                const objecct = data;
                const objeccct = objecct.data.foods[0];
                if(objeccct !== undefined || objecct.totalHits === 0) {
                setFood(dat => [...dat, objeccct]);
                chicken = objeccct.description.replace(/['"]+/g, '');
                setTitle(chicken);
                } else {
                setCodes(codes.filter((item, index) => index !== codes.length - 1));
                setCodesj(codesj.filter((item, index) => index !== codesj.length - 1));
                alert("Not in the database!");

                }
            })
        })();
    }

    const handleBarCodeScanned = ({ type, data }) => { //this runs when barcode is scanned (alert that it was scanned used to be here
        setScanned(true);
        let ddata = data;
        ddata = ddata.substring(1);
        //setcurrentcode(ddata);
        //setCodes(dat => [...dat, ddata]);
        handleScanFinished();
        handleFormSubmit(ddata);
        //console.log(codes);
        //handleAddFoodItem();
      };

    const handleScanFinished = () => {
        setScanning(false);
        setScanned(true);
        setForm(true);
    }

    const completeFood = (index) => {
        let itemsCopy = [...food];
        itemsCopy.splice(index, 1);
        setFood[itemsCopy]
      }

    const handleFormSubmit = (upc) => {
        if(cCode != undefined) {
            setForm(false);
            setCodesj(dat => [...dat, {"code": cbcode, "grams": cCode}]);
            setcurrent();
            handleAddFoodItem(upc);
            completeFood();
        } else {
            alert("Please type in the amount of grams!")
        }
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
    const checkempty = () => {
    if(food[0] == undefined) {
        return(
        <Text style={{
            color: '#787878'
        }}>Click the plus to scan and see nutrition facts</Text>
        )
    }
    }

    /*const searchStart = () => {
        navigation.navigate('Search', {data: exportJSON()})
    }

    function exportJSON() {
        console.log(taskItems);
        var obj = {"data": [], "name": rname, "recipe": taskItems};
        codesj.map((item, index) => {
          obj['data'].push(item);
        });
        return obj;
      }*/

    useEffect( () => {
    (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    if (scanning) {
        return (
          <View style={styles.containerscan}>

            <Text style={styles.camtitle}>Scan a Barcode</Text>

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
      } else {
        return (
          <View style={styles.listcontainer}>
            {/* Added this scroll view to enable scrolling when list gets longer than the page */}


            <View style={{
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 10,
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>



              <Text style={styles.sectionTitle}>{title}</Text>
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

                <Text style={{textAlign: 'center'}}>*Nutrition based on 100 grams of the item scanned</Text>

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
        fontSize: 25,
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
        fontSize: 40,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: -20,
        paddingTop: 50
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
        borderRadius: 5,
        marginRight: 150
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
