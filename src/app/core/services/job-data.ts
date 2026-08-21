import { Job } from '../models/job.model';

/** Skills the logged-in employee (John Smith) currently holds - used to
 * calculate a real match percentage against each job's required skills. */
export const EMPLOYEE_SKILLSET = [
  'Java',
  'Spring Boot',
  'Angular',
  'System Design',
  'SQL',
  'Kafka',
  'Microservices',
  'Docker',
  'REST APIs'
];

export const DEMO_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Tech Lead - Core Banking',
    department: 'Engineering',
    location: 'Hyderabad',
    jobType: 'Full-time',
    experience: '4-6 years',
    requiredSkills: ['Java', 'Spring Boot', 'System Design', 'Leadership'],
    preferredSkills: ['Kafka', 'AWS'],
    description:
      'Lead a squad delivering core banking microservices, owning architecture decisions and mentoring developers on the team.',
    responsibilities: [
      'Own technical design for the core banking domain',
      'Mentor 3-4 developers',
      'Partner with product on roadmap planning'
    ],
    postedDate: '2026-08-01'
  },
  {
    id: 'job-2',
    title: 'Senior Angular Developer',
    department: 'Engineering',
    location: 'Bengaluru',
    jobType: 'Full-time',
    experience: '2-4 years',
    requiredSkills: ['Angular', 'TypeScript', 'RxJS'],
    preferredSkills: ['NgRx', 'Jest'],
    description: 'Build enterprise-grade Angular applications for the workforce management suite.',
    responsibilities: [
      'Develop reusable Angular component libraries',
      'Improve frontend performance and accessibility',
      'Pair with backend teams on API contracts'
    ],
    postedDate: '2026-07-20'
  },
  {
    id: 'job-3',
    title: 'Cloud Solutions Architect',
    department: 'Cloud',
    location: 'Remote',
    jobType: 'Full-time',
    experience: '6+ years',
    requiredSkills: ['Cloud Architecture', 'AWS', 'Kubernetes'],
    preferredSkills: ['Terraform', 'Cost Optimization'],
    description: 'Design multi-region, highly available cloud architectures for enterprise workloads.',
    responsibilities: [
      'Define cloud landing zone standards',
      'Review architecture proposals for scalability',
      'Drive cloud cost optimization initiatives'
    ],
    postedDate: '2026-07-15'
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer',
    department: 'Technology',
    location: 'Pune',
    jobType: 'Full-time',
    experience: '2-4 years',
    requiredSkills: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
    preferredSkills: ['Prometheus', 'Grafana'],
    description: 'Build and maintain CI/CD pipelines and Kubernetes infrastructure for microservices.',
    responsibilities: [
      'Own build and deployment pipelines',
      'Improve observability with Prometheus and Grafana',
      'Automate infrastructure provisioning'
    ],
    postedDate: '2026-08-05'
  },
  {
    id: 'job-5',
    title: 'Engineering Manager - Payments',
    department: 'Engineering',
    location: 'Hyderabad',
    jobType: 'Full-time',
    experience: '6+ years',
    requiredSkills: ['Leadership', 'People Management', 'System Design'],
    preferredSkills: ['Budgeting', 'Stakeholder Management'],
    description: 'Manage a team of 8 engineers delivering the payments platform roadmap.',
    responsibilities: [
      'People management and career growth for the team',
      'Own delivery commitments across quarters',
      'Represent engineering in leadership reviews'
    ],
    postedDate: '2026-06-28'
  },
  {
    id: 'job-6',
    title: 'Java Backend Developer',
    department: 'Engineering',
    location: 'Chennai',
    jobType: 'Full-time',
    experience: '0-2 years',
    requiredSkills: ['Java', 'Spring Boot', 'SQL'],
    preferredSkills: ['REST APIs', 'JUnit'],
    description: 'Develop and maintain backend services for the learning management platform.',
    responsibilities: [
      'Implement REST APIs using Spring Boot',
      'Write unit and integration tests',
      'Fix production defects'
    ],
    postedDate: '2026-08-10'
  },
  {
    id: 'job-7',
    title: 'Data Engineer',
    department: 'Data',
    location: 'Bengaluru',
    jobType: 'Full-time',
    experience: '2-4 years',
    requiredSkills: ['SQL', 'Kafka', 'ETL'],
    preferredSkills: ['Spark', 'Airflow'],
    description: 'Build data pipelines feeding the workforce analytics warehouse.',
    responsibilities: [
      'Design ETL pipelines using Kafka and batch jobs',
      'Ensure data quality and lineage',
      'Support analytics and reporting teams'
    ],
    postedDate: '2026-07-02'
  },
  {
    id: 'job-8',
    title: 'Security Engineer',
    department: 'Security',
    location: 'Remote',
    jobType: 'Full-time',
    experience: '4-6 years',
    requiredSkills: ['Security', 'Keycloak', 'OAuth2'],
    preferredSkills: ['Penetration Testing'],
    description: 'Harden IAM and API security across the enterprise platform.',
    responsibilities: [
      'Own Keycloak realm configuration and RBAC policy',
      'Run periodic security audits',
      'Respond to security incidents'
    ],
    postedDate: '2026-06-15'
  },
  {
    id: 'job-9',
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Hyderabad',
    jobType: 'Contract',
    experience: '2-4 years',
    requiredSkills: ['Java', 'Angular', 'Spring Boot', 'SQL'],
    preferredSkills: ['Docker'],
    description: 'Deliver end-to-end features across Angular frontend and Spring Boot backend.',
    responsibilities: [
      'Build features spanning frontend and backend',
      'Collaborate with QA on test coverage',
      'Participate in sprint ceremonies'
    ],
    postedDate: '2026-08-12'
  },
  {
    id: 'job-10',
    title: 'Site Reliability Engineer',
    department: 'Technology',
    location: 'Pune',
    jobType: 'Full-time',
    experience: '4-6 years',
    requiredSkills: ['Kubernetes', 'DevOps', 'Cloud Architecture'],
    preferredSkills: ['Chaos Engineering'],
    description: 'Ensure platform reliability, on-call response, and incident management.',
    responsibilities: [
      'Define SLOs and error budgets',
      'Lead incident response and postmortems',
      'Automate operational runbooks'
    ],
    postedDate: '2026-07-25'
  },
  {
    id: 'job-11',
    title: 'Product Engineering Lead',
    department: 'Engineering',
    location: 'Bengaluru',
    jobType: 'Internal Transfer',
    experience: '6+ years',
    requiredSkills: ['Leadership', 'System Design', 'Microservices'],
    preferredSkills: ['Product Strategy'],
    description: 'Own the technical direction for the career development product line.',
    responsibilities: [
      'Drive architecture for new product initiatives',
      'Partner closely with product management',
      'Grow senior engineers into tech leads'
    ],
    postedDate: '2026-06-30'
  },
  {
    id: 'job-12',
    title: 'Java Microservices Developer',
    department: 'Engineering',
    location: 'Hyderabad',
    jobType: 'Full-time',
    experience: '2-4 years',
    requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'Microservices'],
    preferredSkills: ['Docker', 'Kubernetes'],
    description: 'Build event-driven microservices on the Kafka backbone for the training service.',
    responsibilities: [
      'Design event-driven services using Kafka',
      'Ensure event ordering and idempotency',
      'Write comprehensive integration tests'
    ],
    postedDate: '2026-08-14'
  }
];

export function calculateMatchPercent(job: Job, skillset: string[] = EMPLOYEE_SKILLSET): number {
  if (job.requiredSkills.length === 0) {
    return 0;
  }
  const matched = job.requiredSkills.filter((skill) => skillset.includes(skill)).length;
  return Math.round((matched / job.requiredSkills.length) * 100);
}

export function calculateSkillGaps(job: Job, skillset: string[] = EMPLOYEE_SKILLSET): string[] {
  return job.requiredSkills.filter((skill) => !skillset.includes(skill));
}
