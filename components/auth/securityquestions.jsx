import { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const SecurityQuestions = ({ onSubmit, onSkip }) => {
  const [questions, setQuestions] = useState({
    q1: '',
    q2: ''
  });

  const questionOptions = [
    "What was your first school's name?",
    "What is your mother's maiden name?",
    "What was your first pet's name?",
    "What city were you born in?",
    "What is your favorite book?",
    "What is your favorite movie?",
    "What was your childhood nickname?",
    "What is your favorite food?"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questions.q1 || !questions.q2) {
      alert('Please answer both questions');
      return;
    }
    onSubmit(questions);
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Security Questions</h3>
        <p className="text-gray-600 text-sm mt-1">
          These will be used for emergency access
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question 1
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            onChange={(e) => setQuestions({ ...questions, q1: e.target.value })}
            value={questions.q1}
          >
            <option value="">Select a question</option>
            {questionOptions.map((q, i) => (
              <option key={i} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <Input
          label="Your Answer"
          placeholder="Enter your answer"
          onChange={(e) => setQuestions({ ...questions, a1: e.target.value })}
        />

        <div className="border-t border-gray-200 my-4"></div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question 2
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            onChange={(e) => setQuestions({ ...questions, q2: e.target.value })}
            value={questions.q2}
          >
            <option value="">Select a question</option>
            {questionOptions.map((q, i) => (
              <option key={i} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <Input
          label="Your Answer"
          placeholder="Enter your answer"
          onChange={(e) => setQuestions({ ...questions, a2: e.target.value })}
        />

        <div className="bg-warning/10 p-4 rounded-lg">
          <p className="text-sm text-warning">
            <ShieldCheckIcon className="w-4 h-4 inline mr-1" />
            These answers cannot be changed later. Store them safely.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          {onSkip && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onSkip}
            >
              Skip for now
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className={onSkip ? "flex-1" : "w-full"}
          >
            Save Answers
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SecurityQuestions;
