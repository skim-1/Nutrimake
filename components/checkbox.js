import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Checked = (checked) => {
  if(checked.checked) {
    console.log(checked);
    return (
      <View style={styles.frameclicked}/>
    )
  } else  {
    return(
      <View />
    )
  }

}

const Checkbox = () => {
  const [checked, setChecked] = useState(false);

  const pressHandler = () => {
    setChecked(!checked);
  }

  const testhandler = () => {
    console.log(checked);
  }

  return (
    <View>
    <TouchableOpacity style={styles.frame} onPress={pressHandler}>
      <Checked checked={checked}/>
    </TouchableOpacity>
    <TouchableOpacity style={styles.frameclicked} onPress={testhandler}>
    </TouchableOpacity>
    </View>
)
}

const styles = StyleSheet.create({
  frame: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',

  },
  frameclicked: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  }
});

export default Checkbox;
