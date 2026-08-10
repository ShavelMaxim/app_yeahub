export interface QuestionSkill {
  id: number;
  title: string;
}

export interface Question {
  id: number;
  title: string;
  description?: string;
  shortAnswer?: string;
  longAnswer?: string;
  complexity?: number;
  rate?: number;
  keywords?: string[];
  questionSkills?: QuestionSkill[];
}
