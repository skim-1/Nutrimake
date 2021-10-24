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
        <Text style={styles.tboxtext}>How many grams?</Text>

        <Text style={styles.tboxtext}>Edit</Text>
        <TextInput
        style={styles.input}
        onChangeText={setcurrent}
        value={cgram}
        keyboardType="numeric"
        placeholder="grams"
        />

        <Button title={"Enter"} onPress={() => handleFormSubmit()}/>
      </View>
    )
  } else {
    return (
    <View style={styles.container}>
      <Text style={styles.header}>Search for your food</Text>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 30
      }}>

      <Text style={{fontSize:16,padding:8}}>Search: </Text>

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
  header: {
    marginTop: 80,
    fontSize: 40,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    borderRadius: 5,
    width: '60%',
    marginBottom: 30
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
