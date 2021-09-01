import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Home from '../components/home';
import TodoList from '../components/TodoList'

const screens = {
  TodoList: {
    screen: TodoList,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => {
      return {
        headerShown: false
      }
    }
  },
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
