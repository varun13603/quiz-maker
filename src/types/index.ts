export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  createdBy: string;
  timeLimit?: number; // in minutes
  showCorrectAnswers: boolean;
  allowRetake: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  participantName: string;
  answers: number[];
  score: number;
  completedAt: Date;
  timeTaken: number; // in seconds
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number[];
  userAnswers: number[];
  timeTaken: number;
}
