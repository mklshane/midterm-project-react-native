import "react-native-get-random-values";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { JobsProvider } from "./src/contexts/JobsContext";
import { SavedJobsProvider } from "./src/contexts/SavedJobContext";
import { ApplicationsProvider } from "./src/contexts/ApplicationsContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <JobsProvider>
          <SavedJobsProvider>
            <ApplicationsProvider>
              <ThemeProvider>
                <AppNavigator />
              </ThemeProvider>
            </ApplicationsProvider>
          </SavedJobsProvider>
        </JobsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
