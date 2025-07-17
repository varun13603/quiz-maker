import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, CheckCircle, XCircle, Clock, Share2, RotateCcw } from 'lucide-react';
import { Quiz, QuizResult } from '../types';
import { formatTime, getScoreColor, getScoreBadgeColor } from '../utils/helpers';
import { generateShareableLink, copyToClipboard } from '../utils/storage';
import { useState } from 'react';
import toast from 'react-hot-toast';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const { result, quiz, participantName } = location.state as {
    result: QuizResult;
    quiz: Quiz;
    participantName: string;
  };

  if (!result || !quiz) {
    navigate('/');
    return null;
  }

  const handleShare = async () => {
    const shareLink = generateShareableLink(quiz.id);
    const success = await copyToClipboard(shareLink);
    
    if (success) {
      setCopied(true);
      toast.success('Quiz link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good work! 👍';
    if (percentage >= 60) return 'Not bad! 🙂';
    return 'Keep practicing! 💪';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-primary-100 p-4 rounded-full w-20 h-20 mx-auto mb-4">
          <Trophy className="h-12 w-12 text-primary-600 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
        <p className="text-gray-600">Here are your results, {participantName}</p>
      </div>

      {/* Score Card */}
      <div className="card mb-8">
        <div className="text-center">
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.percentage)}`}>
              {result.percentage}%
            </div>
            <div className="text-xl text-gray-600 mb-2">
              {result.score} out of {result.totalQuestions} correct
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getScoreBadgeColor(result.percentage)}`}>
              {getScoreMessage(result.percentage)}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(result.timeTaken)}
              </div>
              <div className="text-sm text-gray-600">Time taken</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round((result.score / result.totalQuestions) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      {quiz.showCorrectAnswers && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Answer Review</h2>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = result.userAnswers[index];
              const correctAnswer = result.correctAnswers[index];
              const isCorrect = userAnswer === correctAnswer;
              
              return (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Question {index + 1}: {question.question}
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">Your answer:</span>
                          <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {userAnswer >= 0 ? question.options[userAnswer] : 'Not answered'}
                          </span>
                        </div>
                        
                        {!isCorrect && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">Correct answer:</span>
                            <span className="font-medium text-green-600">
                              {question.options[correctAnswer]}
                            </span>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="bg-blue-50 rounded-lg p-3 mt-2">
                            <p className="text-blue-800 text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleShare}
          className="btn-secondary inline-flex items-center space-x-2 w-full sm:w-auto"
        >
          <Share2 className="h-4 w-4" />
          <span>{copied ? 'Link Copied!' : 'Share Quiz'}</span>
        </button>
        
        {quiz.allowRetake && (
          <Link
            to={`/quiz/${quiz.id}`}
            className="btn-primary inline-flex items-center space-x-2 w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Take Again</span>
          </Link>
        )}
        
        <Link
          to="/"
          className="btn-secondary inline-flex items-center space-x-2 w-full sm:w-auto"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default QuizResults;
