export type UserRole = 'student' | 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  locale?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  dob?: string;
  school?: string;
  grade?: number;
}

export interface Question {
  id: string;
  type: string;
  level: number;
  content: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export interface TestSession {
  id: string;
  user_id: string;
  type: 'entrance' | 'periodic';
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: number;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  order: number;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  module_id?: string;
  lesson_id?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  last_accessed: string;
}
