import React, { useState } from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, Text, View } from 'react-native';

export default function TodoList() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  return (
    <Text>this should be the todo list</Text>
  );
}
