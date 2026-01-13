/**
 * Type definitions for exam and question data
 */

export type AnswerOption = 'a' | 'b' | 'c' | 'd';

export interface QuestionOptions {
  a: string;
  b: string;
  c: string;
  d: string;
}

export interface Question {
  number: number;
  text: string;
  options: QuestionOptions;
  correctAnswer: AnswerOption;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  year: number;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  questions: Question[];
}

/**
 * Nautical School directory data structure
 */
export interface NauticalSchool {
  id: string;
  name: string;
  city: string;
  province: string;
  region: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  courses: string[];
  description: string;
  featured: boolean;
  image?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}
