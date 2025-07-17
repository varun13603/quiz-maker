import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Users, Clock, Share2, Trophy, Eye, Calendar, TrendingUp } from 'lucide-react';
import { Quiz, QuizAttempt } from '../types';
import { getQuizById, getAttemptsByQuizId, generateShareableLink, copyToClipboard } from '../utils/storage';
import { formatTime, getScoreColor, getScoreBadgeColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const QuizDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const foundQuiz = getQuizById(id);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setAttempts(getAttemptsByQuizId(id));
      }
    }
  }, [id]);

  const handleShare = async () => {
    if (!quiz) return;
    
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

  if (!quiz) {
    return (
      <div className="max-w-6xl mx-auto text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading quiz dashboard...</p>
      </div>
    );
  }

  const stats = {
    totalAttempts: attempts.length,
    uniqueParticipants: new Set(attempts.map(a => a.participantName)).size,
    averageScore: attempts.length > 0 
      ? Math.round((attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) * 100) / 100
      : 0,
    averageTime: attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.timeTaken, 0) / attempts.length)
      : 0,
    bestScore: attempts.length > 0 
      ? Math.max(...attempts.map(a => a.score))
      : 0,
  };

  const averagePercentage = Math.round((stats.averageScore / quiz.questions.length) * 100);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description || 'Quiz Dashboard'}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>{copied ? 'Copied!' : 'Share Quiz'}</span>
            </button>
            <Link
              to={`/quiz/${quiz.id}`}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Quiz</span>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Questions</div>
            <div className="text-2xl font-bold text-gray-900">{quiz.questions.length}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Time Limit</div>
            <div className="text-2xl font-bold text-gray-900">
              {quiz.timeLimit ? `${quiz.timeLimit}m` : 'None'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Show Answers</div>
            <div className="text-2xl font-bold text-gray-900">
              {quiz.showCorrectAnswers ? 'Yes' : 'No'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Allow Retake</div>
            <div className="text-2xl font-bold text-gray-900">
              {quiz.allowRetake ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Attempts</div>
            <BarChart className="h-5 w-5 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Unique Participants</div>
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.uniqueParticipants}</div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Average Score</div>
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(averagePercentage)}`}>
            {averagePercentage}%
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Average Time</div>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatTime(stats.averageTime)}
          </div>
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Attempts</h2>
          <div className="text-sm text-gray-600">
            {attempts.length} total attempt{attempts.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {attempts.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No attempts yet</h3>
            <p className="text-gray-600 mb-4">Share your quiz to start collecting responses</p>
            <button
              onClick={handleShare}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Quiz</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts
              .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
              .slice(0, 10)
              .map((attempt) => {
                const percentage = Math.round((attempt.score / quiz.questions.length) * 100);
                return (
                  <div key={attempt.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            percentage >= 80 ? 'bg-green-500' : 
                            percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {percentage}%
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{attempt.participantName}</div>
                          <div className="text-sm text-gray-600">
                            {attempt.score} out of {quiz.questions.length} correct
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {formatTime(attempt.timeTaken)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.completedAt.toLocaleDateString()} at {attempt.completedAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            
            {attempts.length > 10 && (
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Showing 10 of {attempts.length} attempts
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDashboard;
