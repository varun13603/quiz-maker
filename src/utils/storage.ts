import { Quiz, QuizAttempt } from '../types';

// Local storage keys
const QUIZ_STORAGE_KEY = 'quiz_maker_quizzes';
const ATTEMPTS_STORAGE_KEY = 'quiz_maker_attempts';

export const saveQuiz = (quiz: Quiz): void => {
  const quizzes = getQuizzes();
  const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
  
  if (existingIndex >= 0) {
    quizzes[existingIndex] = quiz;
  } else {
    quizzes.push(quiz);
  }
  
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));
};

export const getQuizzes = (): Quiz[] => {
  const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored).map((quiz: any) => ({
      ...quiz,
      createdAt: new Date(quiz.createdAt)
    }));
  } catch {
    return [];
  }
};

export const getQuizById = (id: string): Quiz | null => {
  const quizzes = getQuizzes();
  return quizzes.find(quiz => quiz.id === id) || null;
};

export const deleteQuiz = (id: string): void => {
  const quizzes = getQuizzes().filter(quiz => quiz.id !== id);
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizzes));
  
  // Also delete related attempts
  const attempts = getAttempts().filter(attempt => attempt.quizId !== id);
  localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
};

export const saveAttempt = (attempt: QuizAttempt): void => {
  const attempts = getAttempts();
  attempts.push(attempt);
  localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
};

export const getAttempts = (): QuizAttempt[] => {
  const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored).map((attempt: any) => ({
      ...attempt,
      completedAt: new Date(attempt.completedAt)
    }));
  } catch {
    return [];
  }
};

export const getAttemptsByQuizId = (quizId: string): QuizAttempt[] => {
  return getAttempts().filter(attempt => attempt.quizId === quizId);
};

export const generateShareableLink = (quizId: string): string => {
  const baseUrl = window.location.origin;
  // For GitHub Pages, we need to include the repository name in the path
  // Check if we're on GitHub Pages by looking at the hostname
  const isGitHubPages = window.location.hostname.includes('github.io');
  const basePath = isGitHubPages ? '/quiz-maker' : '';
  const fullUrl = `${baseUrl}${basePath}/quiz/${quizId}`;
  
  // Debug logging (remove in production)
  console.log('Share URL Debug:', {
    baseUrl,
    isGitHubPages,
    basePath,
    fullUrl,
    hostname: window.location.hostname
  });
  
  return fullUrl;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};
