import { Link } from 'react-router-dom';
import { Brain, Plus, Share2, Users, Clock, Trophy } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <div className="flex justify-center mb-8">
          <div className="bg-primary-100 p-4 rounded-full">
            <Brain className="h-16 w-16 text-primary-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Create Amazing Quizzes
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Build engaging quizzes with our intuitive quiz maker. Share them with friends, 
          colleagues, or students and track their performance with detailed analytics.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/create"
            className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Your First Quiz</span>
          </Link>
          <Link
            to="/my-quizzes"
            className="btn-secondary text-lg px-8 py-3 inline-flex items-center space-x-2"
          >
            <span>View My Quizzes</span>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose QuizMaker?
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to create, share, and analyze quizzes
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Share2 className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Easy Sharing
            </h3>
            <p className="text-gray-600">
              Share your quizzes with a simple link. No registration required for participants.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Track Performance
            </h3>
            <p className="text-gray-600">
              Monitor who took your quiz, their scores, and detailed analytics.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Clock className="h-12 w-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Time Limits
            </h3>
            <p className="text-gray-600">
              Set time limits for your quizzes to create engaging timed challenges.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50 -mx-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create Your Quiz
              </h3>
              <p className="text-gray-600">
                Add questions, multiple choice answers, and set your preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Share the Link
              </h3>
              <p className="text-gray-600">
                Copy the shareable link and send it to your friends or students.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 text-primary-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                View Results
              </h3>
              <p className="text-gray-600">
                Monitor performance and see detailed analytics of all attempts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <div className="bg-primary-600 text-white rounded-2xl p-12">
          <Trophy className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Quiz?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of educators and quiz creators using QuizMaker
          </p>
          <Link
            to="/create"
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Start Creating Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
