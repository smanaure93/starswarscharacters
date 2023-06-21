/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CharacterList from './CharacterList';
import CharacterDetail from './CharacterDetail';

export type RootStackParamList = {
  List: undefined;
  Detail: {id?: number};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="List"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="List" component={CharacterList} />
        <Stack.Screen name="Detail" component={CharacterDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
