import { NavigationProp, NavigatorScreenParams } from "@react-navigation/native";
import { Job } from "../contexts/JobsContext";

export type RootTabParamList = {
  Find: undefined;
  Saved: undefined;
  Applied: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;
  JobDetails: {
    job: Job;
    fromSavedJobs?: boolean;
    fromApplied?: boolean;
  };
  ApplicationDetails: {
    applicationId: string;
  };
};

export interface Props {
  navigation: NavigationProp<any>;
}