import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList, RootTabParamList } from "./props";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import JobFinderScreen from "../screens/JobFinderScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen"; 
import SavedJobsScreen from "../screens/SavedJobsScreen";
import AppliedJobsScreen from "../screens/AppliedJobsScreen";
import ApplicationDetailsScreen from "../screens/ApplicationDetailsScreen";

import { useTheme } from "../contexts/ThemeContext";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: keyof RootTabParamList } }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, elevation: 0, shadowOpacity: 0, paddingVertical: 4 },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
            Find: "search",
            Saved: "bookmark-outline",
            Applied: "checkmark-done-outline",
          };
          const name = icons[route.name];
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Find" component={JobFinderScreen} options={{ title: "Find" }} />
      <Tab.Screen name="Saved" component={SavedJobsScreen} options={{ title: "Saved" }} />
      <Tab.Screen name="Applied" component={AppliedJobsScreen} options={{ title: "Applied" }} />
    </Tab.Navigator>
  );
};

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
        border: 'transparent',
        primary: colors.primary,
      },
    }),
    [isDarkMode, colors],
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
          options={({ route, navigation }) => ({
            title: route.params.job.title,
            headerShadowVisible: false,
          })}
        />
        <Stack.Screen
          name="ApplicationDetails"
          component={ApplicationDetailsScreen}
          options={() => ({
            title: "Application",
            headerShadowVisible: false,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
