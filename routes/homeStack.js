import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Home from '../components/home';
import Recipe from '../components/recipe';
import ViewQr from '../components/ViewQR';
import ExportQR from '../components/ExportAsQR';
import Setup from '../components/Setup';
import Search from '../components/Search';
import Cloudrecipes from '../components/Cloudrecipes';
import QuickScan from '../components/QuickScan';
import Pantry from '../components/Pantry';
import Ilist from '../components/Ilist';
import PSearch from '../components/PSearch';


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
  },
  Cloudrecipes: {
    screen: Cloudrecipes,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  QuickScan: {
    screen: QuickScan,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  Pantry: {
    screen: Pantry,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  Ilist: {
    screen: Ilist,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  PSearch: {
    screen: PSearch,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
