import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';


export default function ExportQR( { navigation } ) {
  let qrstring = navigation.getParam('json');

  console.log(qrstring);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan this QR code with the Nutrimake App to open your recipe</Text>

      <QRCode
        value={qrstring}
      />

      <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{height: 47,
                          borderRadius: 60,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#C0C0C0',
                          borderWidth: 1,
                          paddingLeft: 15,
                          paddingRight: 15,
                          width: 300,
                          marginTop: 50
                          }}>
              <Text style={styles.addTextQR}>Back to Ingredient List</Text>
            </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  text: {
    paddingBottom: 45,
    width: '80%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  button: {
    width: '20%',
    marginTop: 30,
    height: '4%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  butText: {
    textAlign: 'center'
  },
});
