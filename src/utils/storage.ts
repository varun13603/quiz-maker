import pako from 'pako';
import toast from 'react-hot-toast';
import { Quiz, QuizAttempt } from '../types';

// Local storage keys
const QUIZ_STORAGE_KEY = 'quiz_maker_quizzes';
const ATTEMPTS_STORAGE_KEY = 'quiz_maker_attempts';
const TEMP_QUIZ_KEY = 'quiz_maker_temp_quiz';

// Helper to convert Uint8Array to URL-safe Base64
function uint8ArrayToUrlSafeBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper to convert URL-safe Base64 to Uint8Array
function urlSafeBase64ToUint8Array(base64: string): Uint8Array {
    let b64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) {
        b64 += '=';
    }
    const binary_string = window.atob(b64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

export const encodeQuizData = (quiz: Quiz): string => {
  const jsonString = JSON.stringify(quiz);
  const compressed = pako.deflate(jsonString);
  return uint8ArrayToUrlSafeBase64(compressed);
};

export const decodeQuizData = (encoded: string): Quiz | null => {
  try {
    const compressed = urlSafeBase64ToUint8Array(encoded);
    const jsonString = pako.inflate(compressed, { to: 'string' });
    const quiz = JSON.parse(jsonString);
    // Re-hydrate dates, as they are lost in JSON serialization
    quiz.createdAt = new Date(quiz.createdAt);
    return quiz;
  } catch (error) {
    console.error('Failed to decode quiz data:', error);
    toast.error('The shared quiz link is invalid or corrupted.');
    return null;
  }
};

export const saveTempQuiz = (quiz: Quiz): void => {
  try {
    sessionStorage.setItem(TEMP_QUIZ_KEY, JSON.stringify(quiz));
  } catch (error) {
    console.error('Error saving temp quiz to sessionStorage', error);
  }
};

export const getTempQuiz = (): Quiz | null => {
  const stored = sessionStorage.getItem(TEMP_QUIZ_KEY);
  if (!stored) return null;
  try {
    const quiz = JSON.parse(stored);
    quiz.createdAt = new Date(quiz.createdAt);
    return quiz;
  } catch {
    return null;
  }
};

export const clearTempQuiz = (): void => {
  sessionStorage.removeItem(TEMP_QUIZ_KEY);
};

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
  const quiz = getQuizById(quizId);
  if (!quiz) {
    toast.error("Could not find the quiz to generate a share link.");
    return '';
  }
  
  const encodedData = encodeQuizData(quiz);
  const baseUrl = window.location.href.split('#')[0];
  return `${baseUrl}#/quiz/shared?data=${encodedData}`;
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
