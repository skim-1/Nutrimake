import React, { useState } from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';

export default function TodoList({ navigation }) {

  const pressHandler = () => {
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Tasks</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>as;dklfjas;dflkajsd;lfkjasd;flkajsd;bovcsjhbiluo;xbhliudfhalisdufhasldiufhasdliubhadvls;iubxcjvlkbhxkldjfahdlsifuhasdfulibsdvjkhbsldfjkgh</Text>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={pressHandler}>
          <Text style={styles.footerText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  titleContainer: {
    paddingTop: 60,
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 48,
    textAlign: 'auto',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 45,
  },
  footerButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: '#636363',
    borderWidth: 1
  },
  footerText: {
    fontSize: 20,
    color: '#636363'
  }
});
