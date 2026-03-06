export interface ApiJob {
	guid: string;
	title: string;
	mainCategory: string;
	companyName: string;
	companyLogo: string | null;
	jobType: string;
	workModel: string;
	seniorityLevel: string;
	minSalary: number | null;
	maxSalary: number | null;
	currency: string;
	locations: string[];
	tags: string[];
	description: string;
	pubDate: number;
	expiryDate: number;
	applicationLink: string;
}

export interface Job extends ApiJob {
	id: string;
}

export type Application = {
	id: string; 
	job: Job;
	name: string;
	email: string;
	contact: string;
	coverLetter: string;
	submittedAt: number; 
};
