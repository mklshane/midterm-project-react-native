import { Job } from "./contexts/JobsContext";

export type Application = {
	id: string; // job guid
	job: Job;
	name: string;
	email: string;
	contact: string;
	coverLetter: string;
	submittedAt: number; // epoch ms
};
