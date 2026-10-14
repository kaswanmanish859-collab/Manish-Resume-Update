export interface ResumeContact {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  highlights?: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  bulletPoints: string[];
}

export interface ProjectItem {
  title: string;
  technologies?: string[];
  link?: string;
  description: string;
  bulletPoints: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  isLinkedInVerified?: boolean;
}

export interface LinkedInVerifiedSkill {
  name: string;
  endorsementsCount?: number;
  verified: boolean;
  category?: 'Technical' | 'Leadership' | 'Methodologies' | 'Core';
}

export interface LinkedInVerifiedCertification {
  name: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  verified: boolean;
}

export interface LinkedInProfileData {
  profileUrl: string;
  username: string;
  fullName: string;
  headline: string;
  location: string;
  about?: string;
  currentCompany?: string;
  connectionsCount?: number;
  isVerified: boolean;
  avatarUrl?: string;
  skills: LinkedInVerifiedSkill[];
  certifications: LinkedInVerifiedCertification[];
  verifiedAt: string;
}

export interface SkillCategory {
  categoryName: string;
  skills: string[];
}

export interface TailoredResumeData {
  contact: ResumeContact;
  professionalSummary: string;
  targetRole: string;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications?: CertificationItem[];
  achievements?: string[];
}

export interface JDAnalysis {
  targetRole: string;
  seniorityLevel: string;
  companyName?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keyResponsibilities: string[];
  importantKeywords: string[];
  atsFocusAreas: string[];
}

export interface SkillGapAnalysis {
  matchScore: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvementSuggestions: string[];
  atsKeywordFrequencyMatches: { keyword: string; matchedInResume: boolean }[];
}

export interface TailorResponse {
  tailoredResume: TailoredResumeData;
  jdAnalysis: JDAnalysis;
  skillGap: SkillGapAnalysis;
  sourceType: 'gemini' | 'intelligent_fallback';
  modelUsed?: string;
  processingTimeMs: number;
  engineNotice?: string;
}

