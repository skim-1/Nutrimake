import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';


export default function ViewQr( { navigation } ) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      const datajson = JSON.parse(data.replace(/(\r\n|\n|\r)/gm, ""));
        console.log(datajson);
        navigation.navigate('Recipe', datajson);
    } catch {
      console.log(69)
    } finally {
      //console.log('ran')
      //setScanned(false);
    }


  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.containerscan}>
        <Text style={styles.title}>Scan QR Code</Text>

      <View style = {styles.container}>
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

        <Text style={styles.camtext}>This scanner will work better in good lighting conditions and only scan Nutrimake QR codes with this feature</Text>
      </View>
    </View>
  );
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  containerscan: {
    flex: 1,
  },
  camtext: {
    width: '75%',
    textAlign: 'center',
    color : 'white',
    marginTop: 15,
    fontSize: 14,
    marginBottom: 200
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
  header: {
    paddingBottom: 20,
    marginTop: 20
  },
  footer: {
    paddingTop: 10,
  },
  barcodeScanner: {
    height: '40%',
    width: '80%',
  },
  title: {
    marginLeft: 20,
    marginTop: 45,
    marginBottom: -15,
    fontSize: 40,
    fontWeight: 'bold',
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
