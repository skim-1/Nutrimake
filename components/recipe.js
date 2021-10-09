import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';


export default function Recipe({navigation}) {
  const getArticlesFromApi = async () => {
      let response = await fetch(
        'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=g2D1ukWeRuBExJfCviwMXBJOo9uycMRZ0UZ5JtZu'
      );
      return await response.json();
  }

  console.log('test');
  getArticlesFromApi().then(console.log);

  return (
    <Text>asdf;aklsdfa;dslkfj</Text>
  )
}
