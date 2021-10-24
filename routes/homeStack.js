import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Home from '../components/home';
import Recipe from '../components/recipe';
import ViewQr from '../components/ViewQR';
import ExportQR from '../components/ExportAsQR';
import Setup from '../components/Setup';
import Search from '../components/Search';


const screens = {
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  Search: {
    screen: Search,
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
  ViewQr: {
    screen: ViewQr,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  ExportQR: {
    screen: ExportQR,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  Setup: {
    screen: Setup,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
