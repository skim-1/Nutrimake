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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan QR Code</Text>
      </View>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.barcodeScanner}
      />

      <View style={styles.footer}>
        <Text style={styles.text}>Only scan Nutrimake QR codes with this feature</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingBottom: 20,
  },
  footer: {
    paddingTop: 10,
  },
  barcodeScanner: {
    height: '40%',
    width: '80%',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
  }
});
