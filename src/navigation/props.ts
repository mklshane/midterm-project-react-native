import { NavigationProp } from "@react-navigation/native";
import { Job } from "../contexts/JobsContext";

export type RootStackParamList = {
    Home: undefined;
    JobFinder: undefined;
    JobDetails: { job: Job };
};

export interface Props {
    navigation: NavigationProp<any>;
}