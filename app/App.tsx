import React from 'react';
import {
    SafeAreaView,
    StatusBar,
} from 'react-native';
import {layoutStyles} from './styles/layout.tsx';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './routes.tsx';
import {NavigationContainer} from '@react-navigation/native';
import MealList from './components/screens/meal/MealList.tsx';
import {Screens} from './domain/screens.ts';
import {FoodList} from './components/screens/food/FoodList.tsx';
import {MealEdit} from './components/screens/meal/MealEdit.tsx';
import {FoodEdit} from './components/screens/food/FoodEdit.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
      <SafeAreaView style={layoutStyles.container}>
          <StatusBar />
          <NavigationContainer>
              <Stack.Navigator initialRouteName={Screens.MealList}>
                  <Stack.Screen
                      name={Screens.MealList}
                      component={MealList}
                      options={{headerShown: false}}
                  />
                  <Stack.Screen
                      name={Screens.FoodList}
                      component={FoodList}
                      options={{headerShown: false}}
                  />
                  <Stack.Screen
                      name={Screens.MealEdit}
                      component={MealEdit}
                      options={{headerShown: false}}
                  />
                  <Stack.Screen
                      name={Screens.FoodEdit}
                      component={FoodEdit}
                      options={{headerShown: false}}
                  />
              </Stack.Navigator>
          </NavigationContainer>
      </SafeAreaView>
  );
}

export default App;
