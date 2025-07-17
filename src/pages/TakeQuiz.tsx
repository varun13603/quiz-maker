import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Quiz, QuizResult, QuizAttempt } from '../types';
import { getQuizById, saveAttempt, getTempQuiz, clearTempQuiz } from '../utils/storage';
import { calculateScore, formatTime } from '../utils/helpers';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [participantName, setParticipantName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      // First, try to get the quiz from local storage (for quizzes created by the user)
      let foundQuiz = getQuizById(id);
      
      // If not found, check if it's a temporary shared quiz
      if (!foundQuiz) {
        const tempQuiz = getTempQuiz();
        if (tempQuiz && tempQuiz.id === id) {
          foundQuiz = tempQuiz;
        }
      }

      if (foundQuiz) {
        setQuiz(foundQuiz);
        setAnswers(new Array(foundQuiz.questions.length).fill(-1));
        if (foundQuiz.timeLimit) {
          setTimeLeft(foundQuiz.timeLimit * 60);
        }
      } else {
        toast.error('Quiz not found or the link is invalid.');
        navigate('/');
      }
    }
    
    // Clean up the temporary quiz from session storage when the component unmounts
    return () => {
      clearTempQuiz();
    };
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !showNameInput) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showNameInput]);

  const startQuiz = () => {
    if (!participantName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setShowNameInput(false);
    setQuizStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const timeTaken = quizStartTime ? Math.floor((Date.now() - quizStartTime) / 1000) : 0;
    const correctAnswers = quiz!.questions.map(q => q.correctAnswer);
    const result = calculateScore(answers, correctAnswers);
    result.timeTaken = timeTaken;

    const attempt: QuizAttempt = {
      id: uuidv4(),
      quizId: quiz!.id,
      participantName,
      answers,
      score: result.score,
      completedAt: new Date(),
      timeTaken,
    };

    saveAttempt(attempt);
    
    // Navigate to results page with result data
    navigate(`/quiz/${id}/results`, { 
      state: { result, quiz, participantName }
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isLastQuestion = currentQuestion === quiz!.questions.length - 1;
  const progress = ((currentQuestion + 1) / quiz!.questions.length) * 100;

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-primary-600 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600 mb-6">{quiz.description}</p>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Questions:</span>
              <span className="font-semibold">{quiz.questions.length}</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Time Limit:</span>
                <span className="font-semibold">{quiz.timeLimit} minutes</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Show Correct Answers:</span>
              <span className="font-semibold">{quiz.showCorrectAnswers ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Allow Retake:</span>
              <span className="font-semibold">{quiz.allowRetake ? 'Yes' : 'No'}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your name to start
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Your name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
            />
          </div>

          <button
            onClick={startQuiz}
            className="btn-primary w-full text-lg py-3"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          {timeLeft !== null && (
            <div className="flex items-center space-x-2 text-primary-600">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-primary-600 rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {quiz.questions[currentQuestion].question}
        </h2>
        
        <div className="space-y-3">
          {quiz.questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  answers[currentQuestion] === index
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            currentQuestion === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary inline-flex items-center space-x-2 px-6 py-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Submit Quiz</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="btn-primary inline-flex items-center space-x-2 px-4 py-2"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
