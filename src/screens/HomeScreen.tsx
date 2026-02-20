import React from "react";
import { View, StyleSheet } from "react-native";
import { Props } from "../navigation/props";
import WelcomeMessage from "../components/Home/WelcomeMessage";

const HomeScreen: React.FC<Props> = () => {
    return (
        <View style={styles.container}>
            <WelcomeMessage />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default HomeScreen;