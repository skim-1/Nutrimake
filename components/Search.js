import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity  } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';


export default function Search( { navigation } ) {
  const [searchitem, setsearch] = useState('');
  const [fooditems, setfoods] = useState([]);
  const [form, setform] = useState(false);
  const [cgram, setcurrent] = useState();
  const [ccode, setccode] = useState();

  const getSearch = ( text ) => {
    (async () => {
      var object = {};
      await axios
        .get('https://api.nal.usda.gov/fdc/v1/foods/search?query=' + text + '&pageSize=15&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1')
        .then(d => object = d)
      setfoods(object.data.foods)
    })();
  }

  const handleFormSubmit = () => {
    if(cgram != undefined && ccode !== 0) {
      var toOut = navigation.getParam('data');
      toOut.data.push({"code": ccode, "grams": cgram});
      console.log(toOut);
      setform(false);
      navigation.push('Recipe', toOut);
    } else {
      alert("Please type in the amount of grams!")
    }
  }

  const handleInChange = ( text ) => {
    getSearch(text);
    setsearch(text);
  }

  const selectItemHandler = (upc) => {
    setccode(upc);
    setform(true);
  }

  if(form) {
    return (
      <View style={styles.container}>
        <Text style={styles.tboxtext}>Mass in Grams of Ingredient</Text>

        <TextInput
        style={styles.input}
        onChangeText={setcurrent}
        value={cgram}
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
            <Text style={styles.addTextQR}>Finish</Text>
          </View>
        </TouchableOpacity>
    </View>
    )
  } else {
    return (
    <View style={styles.container}>
      <Text style={styles.header}>Search for your food</Text>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 15
      }}>

      <Text style={{fontSize:16,paddingTop:22}}>Search: </Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInChange(text)}
        value={searchitem}
        placeholder="search"
      />

      </View>

      <ScrollView>
      {
        fooditems.map((item, index) => {
          return(
            <TouchableOpacity style={styles.searchterm} onPress={() => selectItemHandler(item.gtinUpc)} key={index}>
              <Text style={styles.itemtext}>{item.description + ', ' + item.brandName + ' ' + item.foodCategory}</Text>
            </TouchableOpacity>
          )
        })
      }
      </ScrollView>

    </View>
  )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tboxtext: {
    color: 'black',
    maxWidth: '80%',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  header: {
    marginTop: 80,
    fontSize: 40,
    fontWeight: 'bold'
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
  searchterm: {
    width: '100%',
    height: 50,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#636363',
    justifyContent: 'center'
  },
  itemtext: {
    paddingLeft: 25,
    paddingRight: 25,
  }
});
