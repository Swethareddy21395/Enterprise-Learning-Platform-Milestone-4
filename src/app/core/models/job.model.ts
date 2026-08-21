export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  experience: string;
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  responsibilities: string[];
  postedDate: string;
}

export interface JobFilters {
  search: string;
  department: string;
  location: string;
  experience: string;
  skill: string;
  jobType: string;
}

export interface JobApplicationRecord {
  jobId: string;
  appliedDate: string;
}
