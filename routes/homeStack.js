import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Home from '../components/home';
import Scanner from '../components/scanner';

const screens = {
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  Scanner: {
    screen: Scanner,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
