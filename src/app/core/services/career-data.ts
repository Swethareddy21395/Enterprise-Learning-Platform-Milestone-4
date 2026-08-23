import { CareerPlan, PromotionCriterion, RoadmapStage } from '../models/career.model';

/** Ordered career ladder used to build the roadmap and to know which
 * stage is "current" vs "upcoming" relative to the employee's current role. */
export const ROLE_LADDER = ['Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'];

export const DEFAULT_CAREER_PLAN: CareerPlan = {
  employeeId: 'EMP101',
  employeeName: 'John Smith',
  currentRole: 'Developer',
  targetRole: 'Tech Lead',
  careerGoal: 'Progress into a technical leadership role within Engineering',
  mentor: 'Jane Doe',
  targetDate: '2027-03-01',
  developmentPriority: 'Angular & Leadership',
  notes: 'Focused on closing the Angular and leadership skill gaps ahead of the Q1 promotion cycle.',
  progress: 67
};

interface StageDetail {
  requiredSkills: string[];
  requiredCertifications: string[];
  requiredTraining: string[];
  experienceRequirement: string;
  promotionRequirements: string[];
}

export const STAGE_DETAILS: Record<string, StageDetail> = {
  Developer: {
    requiredSkills: ['Java', 'Spring Boot', 'Angular', 'SQL'],
    requiredCertifications: [],
    requiredTraining: ['Full Stack Java Fundamentals'],
    experienceRequirement: '0-2 years',
    promotionRequirements: ['Complete core onboarding', 'Ship first production feature']
  },
  'Senior Developer': {
    requiredSkills: ['Java', 'Spring Boot', 'Angular', 'System Design', 'Cloud Fundamentals'],
    requiredCertifications: ['AWS Cloud Practitioner'],
    requiredTraining: ['System Design Foundations', 'Cloud Fundamentals'],
    experienceRequirement: '2-4 years',
    promotionRequirements: ['2+ years experience', 'Own a service end to end', 'Positive peer review']
  },
  'Tech Lead': {
    requiredSkills: ['System Design', 'Leadership', 'Cloud Architecture', 'Mentoring'],
    requiredCertifications: ['AWS Solutions Architect'],
    requiredTraining: ['Leadership Essentials', 'Advanced System Design'],
    experienceRequirement: '4-6 years',
    promotionRequirements: [
      'Technical Skills',
      'Leadership',
      'System Design',
      'Certifications',
      'Training',
      'Experience',
      'Performance Rating',
      'Manager Approval'
    ]
  },
  'Engineering Manager': {
    requiredSkills: ['Leadership', 'People Management', 'Cloud Architecture', 'DevOps', 'Budgeting'],
    requiredCertifications: ['AWS Solutions Architect', 'People Management Certificate'],
    requiredTraining: ['People Management Bootcamp', 'Executive Communication'],
    experienceRequirement: '6+ years',
    promotionRequirements: [
      'People Management',
      'Leadership',
      'Cross-team Delivery',
      'Budget Ownership',
      'Certifications',
      'Training',
      'Experience',
      'Executive Sponsor Approval'
    ]
  }
};

/** current skill levels are the employee's actual measured levels - stable
 * unless training changes them. Required levels depend on the target role. */
export const CURRENT_SKILL_LEVELS: Record<string, number> = {
  Angular: 5,
  Leadership: 5,
  'System Design': 6,
  'Cloud Architecture': 5,
  DevOps: 4,
  'People Management': 3
};

export const REQUIRED_SKILL_LEVELS_BY_TARGET: Record<string, Record<string, number>> = {
  'Senior Developer': { Angular: 7, 'System Design': 6, 'Cloud Architecture': 6 },
  'Tech Lead': { Angular: 8, Leadership: 7, 'System Design': 7, 'Cloud Architecture': 7 },
  'Engineering Manager': {
    Leadership: 9,
    'People Management': 8,
    'Cloud Architecture': 8,
    DevOps: 7,
    Angular: 6
  }
};

export function buildRoadmap(currentRole: string, targetRole: string): RoadmapStage[] {
  const currentIdx = ROLE_LADDER.indexOf(currentRole);
  const targetIdx = ROLE_LADDER.indexOf(targetRole);
  const endIdx = Math.max(currentIdx, targetIdx, 0);
  const stages = ROLE_LADDER.slice(0, endIdx + 1);

  return stages.map((role, idx) => {
    let status: RoadmapStage['status'] = 'upcoming';
    if (idx < currentIdx || (idx === currentIdx && currentIdx === targetIdx)) {
      status = 'completed';
    } else if (idx === currentIdx) {
      status = 'current';
    }
    const detail = STAGE_DETAILS[role] ?? {
      requiredSkills: [],
      requiredCertifications: [],
      requiredTraining: [],
      experienceRequirement: 'N/A',
      promotionRequirements: []
    };
    return { role, status, ...detail };
  });
}

export function buildPromotionCriteriaTemplate(targetRole: string): PromotionCriterion[] {
  const detail = STAGE_DETAILS[targetRole];
  const names = detail ? detail.promotionRequirements : [];
  const splitAt = Math.ceil(names.length * 0.6);
  return names.map((name, idx) => ({
    id: `${targetRole}::${name}`.replace(/\s+/g, '-').toLowerCase(),
    name,
    completed: idx < splitAt
  }));
}

// Exported API config for port 8084 endpoints
export const CAREER_API_CONFIG = {
  baseUrl: 'http://localhost:8084/api/career/plans',
  endpoints: {
    roadmap: (employeeId: string) => `http://localhost:8084/api/career/plans/employee/${employeeId}/roadmap`,
    recommendations: (employeeId: string) => `http://localhost:8084/api/career/plans/employee/${employeeId}/recommendations`
  }
};
