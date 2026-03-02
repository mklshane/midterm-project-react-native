import React from "react";
import { View } from "react-native";
import { Props } from "../../navigation/props";
import WelcomeMessage from "../../components/Home/WelcomeMessage";
import { styles } from "./Home.styles";

const HomeScreen: React.FC<Props> = () => {
    return (
        <View style={styles.container}>
            <WelcomeMessage />
        </View>
    );
};

export default HomeScreen;
