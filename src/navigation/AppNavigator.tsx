import React, {useMemo} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./props";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import JobFinderScreen from "../screens/JobFinderScreen";

import { useTheme } from "../contexts/ThemeContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    const navigationTheme = useMemo(
      () => ({
        ...(isDarkMode ? DarkTheme : DefaultTheme),
        colors: {
          ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
        },
      }),
      [isDarkMode, colors],
    );

    return (
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator>
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          <Stack.Screen name="JobFinder" component={JobFinderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default AppNavigator;