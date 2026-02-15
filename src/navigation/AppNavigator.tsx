import React, { useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./props"; 
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import JobFinderScreen from "../screens/JobFinderScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import { useTheme } from "../contexts/ThemeContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isDarkMode, colors } = useTheme();

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
        <Stack.Screen
          name="Find"
          component={JobFinderScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
          options={({ route }) => ({
            title: route.params.job.title, 
            headerBackVisible: true, 
            headerShadowVisible: false, 
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
