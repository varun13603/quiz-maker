import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Share2, Eye, Trash2, Users, Calendar, Copy, Check } from 'lucide-react';
import { Quiz } from '../types';
import { getQuizzes, deleteQuiz, getAttemptsByQuizId, generateShareableLink, copyToClipboard } from '../utils/storage';
import { formatTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [copiedQuizId, setCopiedQuizId] = useState<string | null>(null);

  useEffect(() => {
    setQuizzes(getQuizzes());
  }, []);

  const handleDelete = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      deleteQuiz(quizId);
      setQuizzes(getQuizzes());
      toast.success('Quiz deleted successfully');
    }
  };

  const handleShare = async (quizId: string) => {
    const shareLink = generateShareableLink(quizId);
    const success = await copyToClipboard(shareLink);
    
    if (success) {
      setCopiedQuizId(quizId);
      toast.success('Quiz link copied to clipboard!');
      setTimeout(() => setCopiedQuizId(null), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  const getQuizStats = (quizId: string) => {
    const attempts = getAttemptsByQuizId(quizId);
    const totalAttempts = attempts.length;
    const uniqueParticipants = new Set(attempts.map(a => a.participantName)).size;
    const averageScore = totalAttempts > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts * 100) / 100
      : 0;
    
    return { totalAttempts, uniqueParticipants, averageScore };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Quizzes</h1>
          <p className="text-gray-600">Manage and share your quiz collection</p>
        </div>
        <Link
          to="/create"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Quiz</span>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h2>
          <p className="text-gray-600 mb-6">Create your first quiz to get started</p>
          <Link
            to="/create"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Your First Quiz</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {quizzes.map((quiz) => {
            const stats = getQuizStats(quiz.id);
            return (
              <div key={quiz.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
                      <span className="text-sm text-gray-500">
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {quiz.description && (
                      <p className="text-gray-600 mb-3">{quiz.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {quiz.createdAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{stats.uniqueParticipants} participant{stats.uniqueParticipants !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{stats.totalAttempts} attempt{stats.totalAttempts !== 1 ? 's' : ''}</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center space-x-1">
                          <span>⏱️ {quiz.timeLimit} min</span>
                        </div>
                      )}
                    </div>
                    
                    {stats.totalAttempts > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="text-sm text-gray-600">
                          Average Score: <span className="font-semibold text-gray-900">{stats.averageScore}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleShare(quiz.id)}
                      className="btn-secondary inline-flex items-center space-x-1 text-sm"
                    >
                      {copiedQuizId === quiz.id ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                    
                    <Link
                      to={`/quiz/${quiz.id}/dashboard`}
                      className="btn-secondary inline-flex items-center space-x-1 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizList;
