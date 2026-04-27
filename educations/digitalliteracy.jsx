import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  FingerPrintIcon,
  QrCodeIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  CameraIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowPathIcon,
  PlayIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const DigitalLiteracy = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basics');
  const [currentLesson, setCurrentLesson] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [progress, setProgress] = useState({
    basics: 80,
    security: 45,
    privacy: 30,
    scams: 60,
    social: 25,
    banking: 40
  });
  const [badges, setBadges] = useState([
    { id: 1, name: 'Beginner', icon: '🌱', earned: true },
    { id: 2, name: 'Security Savvy', icon: '🛡️', earned: false },
    { id: 3, name: 'Privacy Pro', icon: '🔒', earned: false },
    { id: 4, name: 'Scam Spotter', icon: '🕵️', earned: true },
    { id: 5, name: 'Digital Expert', icon: '💻', earned: false }
  ]);

  const tabs = [
    { id: 'basics', name: 'Digital Basics', icon: DevicePhoneMobileIcon },
    { id: 'security', name: 'Online Security', icon: ShieldCheckIcon },
    { id: 'privacy', name: 'Privacy', icon: LockClosedIcon },
    { id: 'scams', name: 'Scam Awareness', icon: ExclamationTriangleIcon },
    { id: 'social', name: 'Social Media', icon: GlobeAltIcon },
    { id: 'banking', name: 'Digital Banking', icon: QrCodeIcon }
  ];

  const lessons = {
    basics: [
      {
        id: 1,
        title: 'Getting Started with Smartphones',
        duration: '10 min',
        completed: true,
        content: `
          <h4>Smartphone Basics</h4>
          <ul>
            <li>Turning your phone on/off</li>
            <li>Understanding the home screen</li>
            <li>Using touch gestures (tap, swipe, pinch)</li>
            <li>Making calls and sending messages</li>
            <li>Connecting to Wi-Fi</li>
          </ul>
        `,
        video: 'smartphone-basics.mp4'
      },
      {
        id: 2,
        title: 'Using Apps and Downloads',
        duration: '15 min',
        completed: true,
        content: `
          <h4>App Basics</h4>
          <ul>
            <li>What are apps?</li>
            <li>Downloading apps from Play Store/App Store</li>
            <li>Updating apps</li>
            <li>Organizing apps on your phone</li>
            <li>Uninstalling unwanted apps</li>
          </ul>
        `
      },
      {
        id: 3,
        title: 'Internet Basics',
        duration: '12 min',
        completed: false,
        content: `
          <h4>Using the Internet</h4>
          <ul>
            <li>What is a browser?</li>
            <li>Searching for information</li>
            <li>Understanding website addresses</li>
            <li>Bookmarking favorite sites</li>
            <li>Safe browsing habits</li>
          </ul>
        `
      },
      {
        id: 4,
        title: 'Email Essentials',
        duration: '20 min',
        completed: false,
        content: `
          <h4>Email Basics</h4>
          <ul>
            <li>Creating an email account</li>
            <li>Sending and receiving emails</li>
            <li>Attaching files</li>
            <li>Organizing emails into folders</li>
            <li>Identifying spam emails</li>
          </ul>
        `
      }
    ],
    security: [
      {
        id: 5,
        title: 'Creating Strong Passwords',
        duration: '15 min',
        completed: true,
        content: `
          <h4>Password Security</h4>
          <ul>
            <li>What makes a password strong?</li>
            <li>Avoiding common passwords</li>
            <li>Using password managers</li>
            <li>Two-factor authentication</li>
            <li>Changing passwords regularly</li>
          </ul>
        `
      },
      {
        id: 6,
        title: 'Securing Your Devices',
        duration: '18 min',
        completed: false,
        content: `
          <h4>Device Security</h4>
          <ul>
            <li>Setting up screen lock</li>
            <li>Using fingerprint/face unlock</li>
            <li>Keeping software updated</li>
            <li>Installing antivirus</li>
            <li>Secure backup practices</li>
          </ul>
        `
      },
      {
        id: 7,
        title: 'Safe Wi-Fi Practices',
        duration: '12 min',
        completed: false,
        content: `
          <h4>Wi-Fi Safety</h4>
          <ul>
            <li>Secure home Wi-Fi setup</li>
            <li>Risks of public Wi-Fi</li>
            <li>Using VPN for security</li>
            <li>Spotting fake Wi-Fi networks</li>
            <li>Mobile hotspot safety</li>
          </ul>
        `
      }
    ],
    privacy: [
      {
        id: 8,
        title: 'Understanding Privacy Settings',
        duration: '20 min',
        completed: false,
        content: `
          <h4>Privacy Basics</h4>
          <ul>
            <li>App permissions explained</li>
            <li>Location sharing settings</li>
            <li>Camera and microphone access</li>
            <li>Contact and calendar permissions</li>
            <li>Reviewing app permissions regularly</li>
          </ul>
        `
      },
      {
        id: 9,
        title: 'Protecting Personal Information',
        duration: '15 min',
        completed: false,
        content: `
          <h4>Personal Data Protection</h4>
          <ul>
            <li>What information to keep private</li>
            <li>Sharing safely online</li>
            <li>Identity theft prevention</li>
            <li>Secure document storage</li>
            <li>Data backup strategies</li>
          </ul>
        `
      }
    ],
    scams: [
      {
        id: 10,
        title: 'Common Online Scams',
        duration: '25 min',
        completed: true,
        content: `
          <h4>Types of Scams</h4>
          <ul>
            <li>Phishing emails and messages</li>
            <li>Fake lottery and prize scams</li>
            <li>Romance scams</li>
            <li>Job offer scams</li>
            <li>Tech support fraud</li>
          </ul>
        `
      },
      {
        id: 11,
        title: 'Recognizing Fake Messages',
        duration: '15 min',
        completed: false,
        content: `
          <h4>Spotting Fake Messages</h4>
          <ul>
            <li>Checking sender details</li>
            <li>Looking for spelling errors</li>
            <li>Urgency tactics used by scammers</li>
            <li>Fake links and attachments</li>
            <li>Verifying with official sources</li>
          </ul>
        `
      },
      {
        id: 12,
        title: 'Reporting Scams',
        duration: '10 min',
        completed: false,
        content: `
          <h4>Taking Action</h4>
          <ul>
            <li>Where to report scams</li>
            <li>Cyber crime helpline: 1930</li>
            <li>Preserving evidence</li>
            <li>Blocking scammers</li>
            <li>Helping others avoid scams</li>
          </ul>
        `
      }
    ],
    social: [
      {
        id: 13,
        title: 'Social Media Privacy',
        duration: '20 min',
        completed: false,
        content: `
          <h4>Staying Safe on Social Media</h4>
          <ul>
            <li>Privacy settings on Facebook</li>
            <li>Instagram safety features</li>
            <li>WhatsApp privacy controls</li>
            <li>Managing friend lists</li>
            <li>Blocking and reporting</li>
          </ul>
        `
      },
      {
        id: 14,
        title: 'Avoiding Oversharing',
        duration: '15 min',
        completed: false,
        content: `
          <h4>What Not to Share</h4>
          <ul>
            <li>Location check-ins</li>
            <li>Daily routines</li>
            <li>Personal documents</li>
            <li>Financial information</li>
            <li>Children's information</li>
          </ul>
        `
      }
    ],
    banking: [
      {
        id: 15,
        title: 'UPI and Mobile Banking',
        duration: '25 min',
        completed: false,
        content: `
          <h4>Digital Payments</h4>
          <ul>
            <li>Setting up UPI apps</li>
            <li>Making safe payments</li>
            <li>Understanding transaction limits</li>
            <li>Checking bank statements</li>
            <li>Reporting fraudulent transactions</li>
          </ul>
        `
      },
      {
        id: 16,
        title: 'Avoiding Financial Fraud',
        duration: '20 min',
        completed: false,
        content: `
          <h4>Financial Safety</h4>
          <ul>
            <li>Never share OTP</li>
            <li>Verify before clicking links</li>
            <li>Secure net banking practices</li>
            <li>Credit card safety</li>
            <li>Loan and investment scams</li>
          </ul>
        `
      }
    ]
  };

  const quizzes = {
    basics: [
      {
        id: 1,
        question: 'What should you do if you receive an SMS saying "Your bank account will be blocked. Click here to update KYC"?',
        options: [
          'Click the link immediately',
          'Ignore and delete',
          'Call bank helpline to verify',
          'Forward to friends'
        ],
        correct: 2
      },
      {
        id: 2,
        question: 'Which of these is a strong password?',
        options: [
          'password123',
          '12345678',
          'P@ssw0rd!23',
          'qwerty'
        ],
        correct: 2
      },
      {
        id: 3,
        question: 'What is two-factor authentication (2FA)?',
        options: [
          'Using two different passwords',
          'Extra security step after password',
          'Two people logging in',
          'Two devices connected'
        ],
        correct: 1
      }
    ],
    security: [
      {
        id: 4,
        question: 'Which Wi-Fi network is safest to use?',
        options: [
          'Open public Wi-Fi',
          'Password-protected home Wi-Fi',
          'Free airport Wi-Fi',
          'Hotel Wi-Fi without password'
        ],
        correct: 1
      },
      {
        id: 5,
        question: 'How often should you update your passwords?',
        options: [
          'Never',
          'Every 3-6 months',
          'Only when hacked',
          'Once a year'
        ],
        correct: 1
      }
    ]
  };

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
    toast.info(`Starting lesson: ${lesson.title}`);
  };

  const handleCompleteLesson = (tabId, lessonId) => {
    setProgress(prev => ({
      ...prev,
      [tabId]: Math.min(100, prev[tabId] + 15)
    }));

    // Update lesson completed status
    const updatedLessons = lessons[tabId].map(lesson =>
      lesson.id === lessonId ? { ...lesson, completed: true } : lesson
    );
    lessons[tabId] = updatedLessons;

    toast.success('Lesson completed! 🎉');
    setCurrentLesson(null);

    // Check for badge eligibility
    if (progress[tabId] + 15 >= 100) {
      const newBadge = getBadgeForTab(tabId);
      if (newBadge) {
        setBadges(badges.map(b =>
          b.name === newBadge ? { ...b, earned: true } : b
        ));
        toast.success(`🏆 Congratulations! You earned the ${newBadge} badge!`);
      }
    }
  };

  const getBadgeForTab = (tabId) => {
    const badgeMap = {
      basics: 'Beginner',
      security: 'Security Savvy',
      privacy: 'Privacy Pro',
      scams: 'Scam Spotter',
      social: 'Digital Expert',
      banking: 'Digital Expert'
    };
    return badgeMap[tabId];
  };

  const handleQuizAnswer = (quizId, optionIndex) => {
    setQuizAnswers(prev => ({ ...prev, [quizId]: optionIndex }));
  };

  const submitQuiz = (tabId) => {
    const quiz = quizzes[tabId];
    if (!quiz) return;

    let score = 0;
    quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correct) {
        score++;
      }
    });

    const percentage = (score / quiz.length) * 100;
    setQuizScore(percentage);
    setShowQuizResults(true);

    if (percentage >= 70) {
      setProgress(prev => ({
        ...prev,
        [tabId]: Math.min(100, prev[tabId] + 25)
      }));
      toast.success(`Quiz passed! Score: ${percentage}%`);
    } else {
      toast.error(`Quiz score: ${percentage}%. Need 70% to pass.`);
    }
  };

  const getProgressColor = (value) => {
    if (value < 30) return 'bg-danger';
    if (value < 60) return 'bg-warning';
    if (value < 80) return 'bg-primary-500';
    return 'bg-success';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          💻 Digital Literacy
        </h1>
        <p className="text-gray-600 mt-1">
          Learn to stay safe and confident in the digital world
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Your Learning Progress</h3>
          <div className="space-y-3">
            {Object.entries(progress).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{key}</span>
                  <span className="font-medium">{value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(value)} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`text-center p-3 rounded-lg ${
                  badge.earned ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50 opacity-50'
                }`}
              >
                <span className="text-3xl block mb-1">{badge.icon}</span>
                <p className="text-xs font-medium">{badge.name}</p>
                {badge.earned && (
                  <CheckCircleIconSolid className="w-4 h-4 text-success mx-auto mt-1" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}>
                {progress[tab.id]}%
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Lessons List */}
        <div className="grid grid-cols-1 gap-3">
          {lessons[activeTab]?.map((lesson) => (
            <Card
              key={lesson.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                lesson.completed ? 'bg-success/5 border-success/20' : ''
              }`}
              onClick={() => handleStartLesson(lesson)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  lesson.completed ? 'bg-success/20' : 'bg-primary-100'
                }`}>
                  {lesson.completed ? (
                    <CheckCircleIconSolid className="w-5 h-5 text-success" />
                  ) : (
                    <PlayIcon className="w-5 h-5 text-primary-600" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold">{lesson.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>⏱️ {lesson.duration}</span>
                    {lesson.completed && (
                      <span className="text-success">✓ Completed</span>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartLesson(lesson);
                  }}
                >
                  {lesson.completed ? 'Review' : 'Start'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Quiz */}
        {quizzes[activeTab] && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Quiz</h3>
            <div className="space-y-4">
              {quizzes[activeTab].map((quiz, index) => (
                <div key={quiz.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-3">
                    {index + 1}. {quiz.question}
                  </p>
                  <div className="space-y-2">
                    {quiz.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`quiz-${quiz.id}`}
                          value={optIndex}
                          checked={quizAnswers[quiz.id] === optIndex}
                          onChange={() => handleQuizAnswer(quiz.id, optIndex)}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                variant="primary"
                onClick={() => submitQuiz(activeTab)}
              >
                Submit Quiz
              </Button>
            </div>
          </Card>
        )}

        {/* Safety Tips */}
        <Card className="bg-primary-50 border border-primary-200">
          <h4 className="font-medium text-primary-800 mb-2">Quick Safety Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-primary-700">
            <div className="flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 text-warning mt-0.5" />
              <span>Never share OTP with anyone</span>
            </div>
            <div className="flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 text-warning mt-0.5" />
              <span>Use different passwords for different accounts</span>
            </div>
            <div className="flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 text-warning mt-0.5" />
              <span>Enable two-factor authentication</span>
            </div>
            <div className="flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 text-warning mt-0.5" />
              <span>Update apps and software regularly</span>
            </div>
            <div className="flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 text-warning mt-0.5" />
              <span>Check privacy settings on social media</span>
            </div>
            <div className="flex items-start gap-2">
              <LightBulbIcon className="w-4 h-4 text-warning mt-0.5" />
              <span>Be cautious of unknown links</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Lesson Modal */}
      {currentLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{currentLesson.title}</h3>
              <button
                onClick={() => setCurrentLesson(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Video Placeholder */}
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                <PlayIcon className="w-12 h-12 text-gray-400" />
              </div>

              {/* Lesson Content */}
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />

              {/* Key Takeaways */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-800 mb-2">Key Takeaways</h4>
                <ul className="space-y-1 text-sm text-primary-700">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
                    <span>Always verify before sharing personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
                    <span>Use strong and unique passwords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-success mt-0.5" />
                    <span>Keep your devices updated</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrentLesson(null)}
                >
                  Close
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={() => handleCompleteLesson(activeTab, currentLesson.id)}
                >
                  Mark Complete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quiz Results Modal */}
      {showQuizResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Quiz Results</h3>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="none"
                    stroke={quizScore >= 70 ? '#4CAF50' : '#ff4757'}
                    strokeWidth="8"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 - (276.46 * quizScore) / 100}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(quizScore)}%</span>
                </div>
              </div>

              <p className="text-lg font-medium mb-2">
                {quizScore >= 70 ? '🎉 Congratulations!' : '📚 Keep Learning!'}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                {quizScore >= 70
                  ? 'You passed the quiz! Your progress has been updated.'
                  : 'You need 70% to pass. Review the lessons and try again.'}
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowQuizResults(false)}
                >
                  Close
                </Button>
                {quizScore < 70 && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setShowQuizResults(false);
                      setQuizAnswers({});
                    }}
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DigitalLiteracy;
