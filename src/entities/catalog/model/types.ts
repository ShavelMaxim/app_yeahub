export interface Specialization {
  id: number;
  title: string;
  description?: string;
  imageSrc?: string | null;
}

export interface Skill {
  id: number;
  title: string;
  description?: string;
  imageSrc?: string | null;
  specializations?: Array<number | Specialization>;
}

export interface EntityPayload {
  title: string;
  description: string;
  imageSrc?: string;
  specializations?: number[];
}
