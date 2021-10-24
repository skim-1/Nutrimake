import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';


export default function ExportQR( { navigation } ) {
  let qrstring = navigation.getParam('json');

  console.log(qrstring);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan this QR code with the Simpliscan App to open your recipe</Text>

      <QRCode
        value={qrstring}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.butText}>Go Back</Text>
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
