import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { Quiz, Question } from '../types';
import { saveQuiz } from '../utils/storage';
import toast from 'react-hot-toast';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    questions: [],
    showCorrectAnswers: true,
    allowRetake: true,
    timeLimit: undefined,
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };
    
    setQuiz(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== questionId)
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map(q => 
        q.id === questionId 
          ? { ...q, options: q.options.map((opt, i) => i === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const handleSave = () => {
    if (!quiz.title?.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const invalidQuestions = quiz.questions.filter(q => 
      !q.question.trim() || q.options.some(opt => !opt.trim())
    );

    if (invalidQuestions.length > 0) {
      toast.error('Please complete all questions and options');
      return;
    }

    const newQuiz: Quiz = {
      id: uuidv4(),
      title: quiz.title,
      description: quiz.description || '',
      questions: quiz.questions,
      createdAt: new Date(),
      createdBy: 'Anonymous',
      showCorrectAnswers: quiz.showCorrectAnswers || false,
      allowRetake: quiz.allowRetake || false,
      timeLimit: quiz.timeLimit,
    };

    saveQuiz(newQuiz);
    toast.success('Quiz created successfully!');
    navigate('/my-quizzes');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
        <p className="text-gray-600">Build an engaging quiz to share with others</p>
      </div>

      <div className="space-y-6">
        {/* Quiz Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter quiz title"
                value={quiz.title}
                onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Enter quiz description (optional)"
                value={quiz.description}
                onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="No limit"
                  value={quiz.timeLimit || ''}
                  onChange={(e) => setQuiz(prev => ({ 
                    ...prev, 
                    timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quiz.showCorrectAnswers}
                      onChange={(e) => setQuiz(prev => ({ ...prev, showCorrectAnswers: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Show correct answers after submission</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quiz.allowRetake}
                      onChange={(e) => setQuiz(prev => ({ ...prev, allowRetake: e.target.checked }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Allow retaking the quiz</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Questions ({quiz.questions?.length || 0})
            </h2>
            <button
              onClick={addQuestion}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>
          
          {quiz.questions?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No questions added yet</p>
              <button
                onClick={addQuestion}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Question</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {quiz.questions?.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Question {index + 1}
                    </h3>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question *
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter your question"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options *
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <input
                              type="text"
                              className="input-field flex-1"
                              placeholder={`Option ${optionIndex + 1}`}
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Select the radio button to mark the correct answer
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation (optional)
                      </label>
                      <textarea
                        className="input-field"
                        rows={2}
                        placeholder="Explain why this is the correct answer"
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Save Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
