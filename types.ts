export interface ContentBlock {
  title: string;
  content: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Lesson {
  title: string;
  keyIdea: ContentBlock;
  example: ContentBlock;
  activity: ContentBlock;
  quiz?: Question[]; // Made optional
  image?: string;
}

export interface Unit {
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface ProjectProposal {
  title: string;
  description: string;
}

export interface CourseData {
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  targetProfile: string;
  objectives: string[];
  units: Unit[];
  finalAssessment: Question[];
  finalProjects: ProjectProposal[];
}

export interface GeneratedCourse {
  data: CourseData;
  sources: { title?: string; uri: string }[];
}

export interface UserInput {
  topic: string;
  stage: string;
  level: string;
  profile: string;
  goal: string;
  time: string;
  format: string;
}