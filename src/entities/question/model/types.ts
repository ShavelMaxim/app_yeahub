export interface QuestionSkill {
  id: number;
  title: string;
  imageSrc?: string | null;
}

export interface QuestionSpecialization {
  id: number;
  title: string;
  slug?: string;
}

export interface QuestionAuthor {
  id: string;
  username: string;
}

export interface Question {
  id: number | string;
  title: string;
  slug?: string;
  description?: string;
  shortAnswer?: string;
  longAnswer?: string;
  code?: string | null;
  imageSrc?: string | null;
  complexity?: number;
  rate?: number;
  keywords?: string[];
  questionSkills?: QuestionSkill[];
  status?: 'new' | 'learned' | 'in-progress';
  isFavorite?: boolean;
  createdBy?: QuestionAuthor;
  questionSpecializations?: QuestionSpecialization[];
}
