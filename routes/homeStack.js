import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Home from '../components/home';
import Scanner from '../components/scanner';
import Recipe from '../components/recipe';

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
  Recipe: {
    screen: Recipe,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
