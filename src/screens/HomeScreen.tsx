import React from "react";
import { Text } from "react-native";
import { Props } from "../navigation/props";

const HomeScreen: React.FC<Props> = ({navigation}) => {
    return (
        <>
        <Text>Welcome tobdbdb the Job Finder App!</Text>
        </>
    );
}

export default HomeScreen;