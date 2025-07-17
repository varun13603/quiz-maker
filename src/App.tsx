import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import QuizDashboard from './pages/QuizDashboard';

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get('p');
    if (path) {
      // Construct the full path including the basename for react-router
      const newPath = `/quiz-maker${path}`;
      window.history.replaceState(null, '', newPath);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/my-quizzes" element={<QuizList />} />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/quiz/:id/results" element={<QuizResults />} />
          <Route path="/quiz/:id/dashboard" element={<QuizDashboard />} />
        </Routes>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
