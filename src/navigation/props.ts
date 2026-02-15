import { NavigationProp } from "@react-navigation/native";
import { Job } from "../contexts/JobsContext";

export type RootStackParamList = {
  Home: undefined;
  Find: undefined;
  JobDetails: {
    job: Job;
    fromSavedJobs?: boolean; 
  };
};

export interface Props {
    navigation: NavigationProp<any>;
}