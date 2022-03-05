import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";
import StackNavigator from "./StackNavigator";
import Profile from "../screens/Profile";
import Logout from "../screens/Logout";
import CustomSlideBarMenu from "../screens/CustomSlideBarMenu";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: "black",
        inactiveTintColor: "white",
        itemStyle: {
          marginVertical: 5,
        },
      }}
      drawerContent={(props) => <CustomSlideBarMenu {...props} />}
    >
      <Drawer.Screen
        name='Home'
        component={StackNavigator}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name='Profile'
        component={Profile}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name='Logout'
        component={Logout}
        options={{ unmountOnBlur: true }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
