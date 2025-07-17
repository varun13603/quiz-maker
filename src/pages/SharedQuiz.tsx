import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeQuizData, saveTempQuiz } from '../utils/storage';

const SharedQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = params.get('data');

    if (data) {
      const quiz = decodeQuizData(data);
      if (quiz) {
        // Save the quiz to sessionStorage so it can be retrieved by the TakeQuiz component
        saveTempQuiz(quiz);
        // Redirect to the TakeQuiz component, using the quiz ID
        navigate(`/quiz/${quiz.id}`);
      } else {
        // If decoding fails, redirect to home
        navigate('/');
      }
    } else {
      // If no data, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  // This component will just show a loading/redirecting message
  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg text-gray-600">Loading quiz...</p>
    </div>
  );
};

export default SharedQuiz;
