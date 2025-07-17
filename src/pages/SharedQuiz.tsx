import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decodeQuizData, saveTempQuiz, saveQuiz } from '../utils/storage';

const SharedQuiz = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const encoded = params.get('data');
    if (!encoded) {
      alert('No quiz data found in the link.');
      navigate('/');
      return;
    }
    const quiz = decodeQuizData(encoded);
    if (!quiz) {
      alert('Invalid or corrupted quiz data.');
      navigate('/');
      return;
    }
    // Persist quiz for reuse
    saveTempQuiz(quiz);
    saveQuiz(quiz);
    // Redirect to direct quiz route with embedded data
    navigate(`/quiz/${quiz.id}?data=${params.get('data')}`);
  }, [params, navigate]);

  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg text-gray-600">Loading quiz...</p>
    </div>
  );
};

export default SharedQuiz;
