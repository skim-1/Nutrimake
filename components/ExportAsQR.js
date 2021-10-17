import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';


export default function ExportQR( { navigation } ) {
  let qrstring = navigation.getParam('json');

  console.log(qrstring);

  return (
    <View style={styles.container}>
      <QRCode
        value={qrstring}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
