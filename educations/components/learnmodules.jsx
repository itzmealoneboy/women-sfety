import React, { useState, useEffect } from 'react';

const LearnModule = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const mockModules = [
      {
        id: 1,
        title: 'Cybersecurity Basics',
        description: 'Learn fundamental concepts of cybersecurity',
        duration: '2 hours',
        lessons: [
          {
            title: 'Introduction to Cybersecurity',
            content: 'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks...',
            videoUrl: '#',
            duration: '15 min'
          },
          {
            title: 'Common Threats',
            content: 'Learn about malware, phishing, ransomware, and other common cyber threats...',
            videoUrl: '#',
            duration: '20 min'
          },
          {
            title: 'Best Practices',
            content: 'Implement strong passwords, enable 2FA, keep software updated...',
            videoUrl: '#',
            duration: '25 min'
          }
        ],
        quiz: [
          { question: 'What does 2FA stand for?', options: ['Two Factor Authentication', 'Two Form Access', 'Triple Factor Auth'], correct: 0 },
          { question: 'Which of these is a common cyber threat?', options: ['Phishing', 'Firewall', 'Encryption'], correct: 0 },
          { question: 'What is a strong password characteristic?', options: ['Short and simple', 'Uses personal info', 'Long with mixed characters'], correct: 2 }
        ],
        progress: 45
      },
      {
        id: 2,
        title: 'Social Media Safety',
        description: 'Protect your privacy on social platforms',
        duration: '1.5 hours',
        lessons: [
          {
            title: 'Privacy Settings',
            content: 'Configure privacy settings to control who sees your information...',
            videoUrl: '#',
            duration: '20 min'
          },
          {
            title: 'Identifying Scams',
            content: 'Learn to recognize and avoid social media scams...',
            videoUrl: '#',
            duration: '25 min'
          }
        ],
        quiz: [
          { question: 'What should you avoid sharing on social media?', options: ['Hobbies', 'Address', 'Favorite movies'], correct: 1 },
          { question: 'How to spot a fake profile?', options: ['Few friends', 'Generic photos', 'All of above'], correct: 2 }
        ],
        progress: 20
      },
      {
        id: 3,
        title: 'Emergency Response',
        description: 'Learn how to respond in emergencies',
        duration: '3 hours',
        lessons: [
          {
            title: 'First Aid Basics',
            content: 'Basic first aid techniques for common injuries...',
            videoUrl: '#',
            duration: '30 min'
          },
          {
            title: 'Emergency Contacts',
            content: 'Important emergency numbers and protocols...',
            videoUrl: '#',
            duration: '20 min'
          },
          {
            title: 'Evacuation Procedures',
            content: 'How to safely evacuate during emergencies...',
            videoUrl: '#',
            duration: '25 min'
          }
        ],
        quiz: [
          { question: 'What is the first step in an emergency?', options: ['Panic', 'Assess situation', 'Run away'], correct: 1 },
          { question: 'What number to call for emergency?', options: ['100', '101', '112'], correct: 2 }
        ],
        progress: 0
      }
    ];
    setModules(mockModules);
    setSelectedModule(mockModules[0]);
  };

  const handleQuizSubmit = () => {
    const quiz = selectedModule.quiz;
    let score = 0;
    quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correct) {
        score++;
      }
    });
    const percentage = (score / quiz.length) * 100;
    setQuizScore(percentage);
    setQuizSubmitted(true);
  };

  const saveNotes = () => {
    alert('Notes saved successfully!');
  };

  const completeLesson = () => {
    if (currentLesson < selectedModule.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else {
      alert('Congratulations! You have completed all lessons in this module.');
    }
  };

  return (
    <div className="learn-module">
      <div className="module-header">
        <h2>Learning Modules</h2>
        <p>Interactive courses to enhance your safety knowledge</p>
      </div>

      <div className="module-container">
        <div className="modules-sidebar">
          <h3>Courses</h3>
          <div className="modules-list">
            {modules.map(module => (
              <div 
                key={module.id} 
                className={`module-item ${selectedModule?.id === module.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedModule(module);
                  setCurrentLesson(0);
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
              >
                <div className="module-icon">📚</div>
                <div className="module-info">
                  <div className="module-title">{module.title}</div>
                  <div className="module-duration">{module.duration}</div>
                  <div className="module-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${module.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="module-content">
          {selectedModule && (
            <>
              <div className="content-header">
                <h3>{selectedModule.title}</h3>
                <p>{selectedModule.description}</p>
              </div>

              <div className="lesson-navigation">
                <div className="lessons-tabs">
                  {selectedModule.lessons.map((lesson, index) => (
                    <button 
                      key={index}
                      className={`lesson-tab ${currentLesson === index ? 'active' : ''}`}
                      onClick={() => setCurrentLesson(index)}
                    >
                      Lesson {index + 1}
                    </button>
                  ))}
                  <button className={`lesson-tab ${!quizSubmitted ? 'quiz-tab' : ''}`}>
                    Quiz
                  </button>
                </div>

                {currentLesson < selectedModule.lessons.length ? (
                  <div className="lesson-content">
                    <h4>{selectedModule.lessons[currentLesson].title}</h4>
                    <div className="lesson-video">
                      <div className="video-placeholder">
                        <div className="play-icon">▶️</div>
                        <p>Video: {selectedModule.lessons[currentLesson].duration}</p>
                      </div>
                    </div>
                    <div className="lesson-text">
                      <p>{selectedModule.lessons[currentLesson].content}</p>
                    </div>
                    <div className="lesson-actions">
                      <button onClick={completeLesson} className="complete-btn">
                        {currentLesson === selectedModule.lessons.length - 1 ? 'Complete Module' : 'Next Lesson'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-section">
                    <h4>Module Quiz</h4>
                    {!quizSubmitted ? (
                      <>
                        {selectedModule.quiz.map((q, index) => (
                          <div key={index} className="quiz-question">
                            <p><strong>{index + 1}. {q.question}</strong></p>
                            <div className="quiz-options">
                              {q.options.map((option, optIndex) => (
                                <label key={optIndex} className="quiz-option">
                                  <input
                                    type="radio"
                                    name={`q${index}`}
                                    value={optIndex}
                                    onChange={(e) => setQuizAnswers({...quizAnswers, [index]: parseInt(e.target.value)})}
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button onClick={handleQuizSubmit} className="submit-quiz-btn">Submit Quiz</button>
                      </>
                    ) : (
                      <div className="quiz-results">
                        <div className="score-circle">
                          <div className="score-value">{Math.round(quizScore)}%</div>
                          <div className="score-label">Your Score</div>
                        </div>
                        <p>{quizScore >= 70 ? 'Congratulations! You passed the quiz!' : 'Keep practicing! Review the lessons and try again.'}</p>
                        {quizScore >= 70 && (
                          <button className="get-certificate-btn">Get Certificate</button>
                        )}
                        <button onClick={() => setQuizSubmitted(false)} className="retake-btn">Retake Quiz</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="notes-section">
                <h4>My Notes</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes while learning..."
                  rows={4}
                />
                <button onClick={saveNotes} className="save-notes-btn">Save Notes</button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .learn-module {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .module-header {
          margin-bottom: 30px;
        }

        .module-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .module-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .module-container {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 30px;
        }

        .modules-sidebar {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .modules-sidebar h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .modules-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .module-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: #f8f9fa;
        }

        .module-item:hover {
          background: #e9ecef;
        }

        .module-item.active {
          background: #e7f3ff;
          border-left: 3px solid #007bff;
        }

        .module-icon {
          font-size: 32px;
        }

        .module-info {
          flex: 1;
        }

        .module-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .module-duration {
          font-size: 11px;
          color: #999;
          margin-bottom: 8px;
        }

        .module-progress {
          margin-top: 5px;
        }

        .progress-bar {
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #28a745;
        }

        .module-content {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .content-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .content-header h3 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .content-header p {
          margin: 0;
          color: #666;
        }

        .lessons-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
          flex-wrap: wrap;
        }

        .lesson-tab {
          padding: 8px 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          transition: all 0.2s;
        }

        .lesson-tab.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }

        .lesson-content h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .lesson-video {
          margin-bottom: 20px;
        }

        .video-placeholder {
          background: #f0f0f0;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
        }

        .play-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .lesson-text {
          margin-bottom: 20px;
          line-height: 1.6;
          color: #666;
        }

        .complete-btn {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .quiz-section h4 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .quiz-question {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .quiz-question p {
          margin: 0 0 10px 0;
          color: #333;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quiz-option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
        }

        .submit-quiz-btn {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .quiz-results {
          text-align: center;
          padding: 30px;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 3px solid #28a745;
        }

        .score-value {
          font-size: 32px;
          font-weight: bold;
          color: #28a745;
        }

        .score-label {
          font-size: 12px;
          color: #666;
        }

        .get-certificate-btn, .retake-btn {
          margin: 10px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .get-certificate-btn {
          background: #28a745;
          color: white;
        }

        .retake-btn {
          background: #ffc107;
          color: #333;
        }

        .notes-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .notes-section h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .notes-section textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          resize: vertical;
          font-family: inherit;
          margin-bottom: 10px;
        }

        .save-notes-btn {
          padding: 8px 16px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .module-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LearnModule;
