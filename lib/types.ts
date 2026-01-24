

// Base Event Interface
export interface EventBase {
  id: string;
  slug: string; // Used for file lookup
  type: 'quiz' | 'webinar';
  title: string;
  description: string;
  thumbnailUrl: string;
  isActive: boolean;
  createdAt: string;
}

// Question Types
export interface BaseQuestion {
  id: string;
  text: string;
  points?: number; // Default to 1 if undefined
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  correctAnswer: number[]; // Array of indices (0-based) for correct options
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  correctAnswer?: string; // Optional for manual review or regex matching
}

export interface BooleanQuestion extends BaseQuestion {
  type: 'boolean';
  correctAnswer: boolean; // true or false
}

export type Question = MCQQuestion | TextQuestion | BooleanQuestion;

export interface RegistrationField {
  id: string; // e.g., 'name', 'phone', 'dob'
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'number';
  required: boolean;
  minAge?: number;
  maxAge?: number;
}

// Quiz Event
export interface QuizEvent extends EventBase {
  type: 'quiz';
  endDate?: string; // ISO string
  showScore: boolean; // Whether to show score after submission
  registrationFields: RegistrationField[]; // Dynamic registration inputs
  content: {
    questions: Question[];
    // passingScore removed
  };
}

// Webinar Event
export interface WebinarEvent extends EventBase {
  type: 'webinar';
  startDate: string;
  content: {
    webinarUrl?: string;
    speaker?: string;
    duration?: string;
  };
}

export type Event = QuizEvent | WebinarEvent;


export interface UserDetails {
  name: string;
  email: string;
  phone?: string;
}

export interface Submission {
  id?: string;
  eventId: string;
  userDetails: UserDetails;
  answers?: Record<string, string>; // questionId -> answer
  score?: number;
  totalPoints?: number; // Added this to match backend
  timestamp: string; // ISO string
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string; // ISO string
}
