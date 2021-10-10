import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';


export default function Recipe({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&pageSize=2&api_key=g2D1ukWeRuBExJfCviwMXBJOo9uycMRZ0UZ5JtZu')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  console.log(data.foods);

  data.foods.foreach(value => {console.log(value)});

  return (
    <Text>asdf;aklsdfa;dslkfj</Text>
  )
}
