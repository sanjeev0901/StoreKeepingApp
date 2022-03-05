import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./TabNavigator";
import ProductScreen from "../screens/ProductScreen";
import AddQuantity from "../screens/AddQuantity";
import "react-native-gesture-handler";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName='ProductHome'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='ProductHome' component={BottomTabNavigator} />
      <Stack.Screen name='ProductScreen' component={ProductScreen} />
      <Stack.Screen name='AddQuantityScreen' component={AddQuantity} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
