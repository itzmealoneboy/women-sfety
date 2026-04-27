import React, { useState, useEffect } from 'react';

const SecurityQuestions = ({ onComplete, userId }) => {
  const [questions, setQuestions] = useState([
    { id: 1, text: 'What was your first pet\'s name?' },
    { id: 2, text: 'What is your mother\'s maiden name?' },
    { id: 3, text: 'What city were you born in?' },
    { id: 4, text: 'What was your first car?' },
    { id: 5, text: 'What is your favorite book?' },
    { id: 6, text: 'What elementary school did you attend?' },
    { id: 7, text: 'What is your favorite movie?' },
    { id: 8, text: 'What is your dream job?' }
  ]);
  
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [setupMode, setSetupMode] = useState(true);
  const [verificationMode, setVerificationMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user already has security questions set up
    checkExistingQuestions();
  }, [userId]);

  const checkExistingQuestions = async () => {
    try {
      // Simulate API call to check if user has security questions
      const hasQuestions = localStorage.getItem(`security_questions_${userId}`);
      if (hasQuestions) {
        setSetupMode(false);
      }
    } catch (error) {
      console.error('Error checking security questions:', error);
    }
  };

  const handleSelectQuestion = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else if (selectedQuestions.length < 3) {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedQuestions.length !== 3) {
      setError('Please select 3 security questions');
      return;
    }

    // Check if all selected questions have answers
    for (const qId of selectedQuestions) {
      if (!answers[qId] || answers[qId].trim() === '') {
        setError('Please answer all selected questions');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Prepare data for submission
      const securityData = selectedQuestions.map(qId => ({
        questionId: qId,
        question: questions.find(q => q.id === qId).text,
        answer: answers[qId]
      }));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage (in real app, send to backend)
      localStorage.setItem(`security_questions_${userId}`, JSON.stringify(securityData));
      
      setSetupMode(false);
      if (onComplete) onComplete(true);
    } catch (error) {
      setError('Failed to save security questions');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions have answers
    const storedData = JSON.parse(localStorage.getItem(`security_questions_${userId}`));
    for (const q of storedData) {
      if (!answers[q.questionId] || answers[q.questionId].trim() === '') {
        setError('Please answer all questions');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Verify answers
      const storedData = JSON.parse(localStorage.getItem(`security_questions_${userId}`));
      let isValid = true;
      
      for (const q of storedData) {
        if (answers[q.questionId].toLowerCase() !== q.answer.toLowerCase()) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        if (onComplete) onComplete(true);
      } else {
        setError('One or more answers are incorrect');
      }
    } catch (error) {
      setError('Failed to verify answers');
    } finally {
      setLoading(false);
    }
  };

  const renderSetupMode = () => (
    <form onSubmit={handleSetupSubmit}>
      <div className="questions-list">
        <h3>Select 3 security questions</h3>
        <p className="instruction">Choose questions that are easy for you to remember but hard for others to guess</p>
        
        {questions.map(question => (
          <div key={question.id} className="question-item">
            <label className="question-checkbox">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(question.id)}
                onChange={() => handleSelectQuestion(question.id)}
                disabled={!selectedQuestions.includes(question.id) && selectedQuestions.length >= 3}
              />
              <span>{question.text}</span>
            </label>
            
            {selectedQuestions.includes(question.id) && (
              <div className="answer-input">
                <input
                  type="text"
                  placeholder="Your answer"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Saving...' : 'Save Security Questions'}
      </button>
    </form>
  );

  const renderVerificationMode = () => {
    const storedData = JSON.parse(localStorage.getItem(`security_questions_${userId}`));
    
    return (
      <form onSubmit={handleVerificationSubmit}>
        <div className="questions-list">
          <h3>Verify Your Identity</h3>
          <p className="instruction">Please answer your security questions to verify your identity</p>
          
          {storedData.map(({ questionId, question }) => (
            <div key={questionId} className="verification-item">
              <label className="question-label">{question}</label>
              <input
                type="text"
                placeholder="Your answer"
                value={answers[questionId] || ''}
                onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                className="verification-input"
              />
            </div>
          ))}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Verifying...' : 'Verify Identity'}
        </button>
      </form>
    );
  };

  if (!setupMode) {
    return renderVerificationMode();
  }

  return renderSetupMode();
};

export default SecurityQuestions;
