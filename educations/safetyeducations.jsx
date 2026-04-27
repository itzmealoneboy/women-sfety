import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  AcademicCapIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { PlayIcon as PlayIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const SafetyEducation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [progress, setProgress] = useState({});

  const tabs = [
    { id: 'courses', name: 'Courses', icon: AcademicCapIcon },
    { id: 'videos', name: 'Videos', icon: VideoCameraIcon },
    { id: 'articles', name: 'Articles', icon: DocumentTextIcon },
    { id: 'tips', name: 'Safety Tips', icon: LightBulbIcon }
  ];

  const courses = [
    {
      id: 1,
      title: 'Basic Self-Defense',
      description: 'Learn fundamental self-defense techniques to protect yourself',
      duration: '2 hours',
      lessons: 8,
      level: 'Beginner',
      image: 'self-defense.jpg',
      progress: 60,
      topics: [
        'Awareness and Prevention',
        'Basic Strikes and Blocks',
        'Escape from Holds',
        'Using Environment',
        'De-escalation Techniques'
      ]
    },
    {
      id: 2,
      title: 'Digital Safety & Cyber Security',
      description: 'Stay safe online and protect your digital identity',
      duration: '3 hours',
      lessons: 12,
      level: 'Intermediate',
      image: 'cyber-safety.jpg',
      progress: 30,
      topics: [
        'Password Security',
        'Social Media Privacy',
        'Identifying Scams',
        'Secure Browsing',
        'Data Protection'
      ]
    },
    {
      id: 3,
      title: 'Legal Rights Awareness',
      description: 'Know your legal rights and how to exercise them',
      duration: '4 hours',
      lessons: 15,
      level: 'Advanced',
      image: 'legal-rights.jpg',
      progress: 0,
      topics: [
        'Constitutional Rights',
        'Criminal Laws',
        'Workplace Rights',
        'Property Rights',
        'Cyber Laws'
      ]
    },
    {
      id: 4,
      title: 'Emergency Response',
      description: 'Learn how to respond in emergency situations',
      duration: '2.5 hours',
      lessons: 10,
      level: 'Beginner',
      image: 'emergency.jpg',
      progress: 0,
      topics: [
        'First Aid Basics',
        'Emergency Calls',
        'Evacuation Procedures',
        'Crisis Management',
        'SOS Activation'
      ]
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Self-Defense Moves Every Woman Should Know',
      duration: '15:30',
      views: '125K',
      thumbnail: 'video1.jpg',
      instructor: 'Priya Sharma'
    },
    {
      id: 2,
      title: 'How to Stay Safe While Traveling Alone',
      duration: '12:45',
      views: '89K',
      thumbnail: 'video2.jpg',
      instructor: 'Dr. Meera Krishnan'
    },
    {
      id: 3,
      title: 'Cyber Safety Tips for Women',
      duration: '20:15',
      views: '67K',
      thumbnail: 'video3.jpg',
      instructor: 'Rahul Verma'
    },
    {
      id: 4,
      title: 'Workplace Harassment: Know Your Rights',
      duration: '18:20',
      views: '45K',
      thumbnail: 'video4.jpg',
      instructor: 'Adv. Lakshmi Raj'
    },
    {
      id: 5,
      title: 'Emergency First Aid Basics',
      duration: '25:10',
      views: '34K',
      thumbnail: 'video5.jpg',
      instructor: 'Dr. Sanjay Gupta'
    },
    {
      id: 6,
      title: 'Using Safety Apps Effectively',
      duration: '10:30',
      views: '28K',
      thumbnail: 'video6.jpg',
      instructor: 'Tech Team'
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'Understanding Domestic Violence Laws',
      excerpt: 'A comprehensive guide to the Protection of Women from Domestic Violence Act 2005...',
      author: 'Legal Aid Cell',
      date: '2 days ago',
      readTime: '8 min read',
      category: 'Legal'
    },
    {
      id: 2,
      title: '10 Essential Safety Tips for Night Travel',
      excerpt: 'Planning to travel at night? Here are crucial safety measures every woman should take...',
      author: 'Safety Experts',
      date: '5 days ago',
      readTime: '5 min read',
      category: 'Travel'
    },
    {
      id: 3,
      title: 'How to Identify and Avoid Online Scams',
      excerpt: 'Learn about common online scams targeting women and how to protect yourself...',
      author: 'Cyber Cell',
      date: '1 week ago',
      readTime: '10 min read',
      category: 'Cyber'
    },
    {
      id: 4,
      title: 'Mental Health and Self-Care for Survivors',
      excerpt: 'Important resources and strategies for maintaining mental health after trauma...',
      author: 'Counseling Center',
      date: '1 week ago',
      readTime: '12 min read',
      category: 'Health'
    }
  ];

  const safetyTips = [
    {
      category: 'Home Safety',
      tips: [
        'Always lock doors and windows before sleeping',
        'Keep emergency numbers handy near phone',
        'Install peephole in main door',
        'Check identity before opening door',
        'Keep mobile phone charged and accessible'
      ],
      icon: '🏠'
    },
    {
      category: 'Travel Safety',
      tips: [
        'Share live location with family',
        'Keep phone fully charged',
        'Avoid isolated routes and shortcuts',
        'Note down vehicle number',
        'Sit near driver in public transport'
      ],
      icon: '🚗'
    },
    {
      category: 'Online Safety',
      tips: [
        'Use strong, unique passwords',
        'Enable two-factor authentication',
        'Never share OTP with anyone',
        'Be careful with friend requests from strangers',
        'Don\'t share personal information online'
      ],
      icon: '💻'
    },
    {
      category: 'Workplace Safety',
      tips: [
        'Know your company\'s POSH policy',
        'Document any incidents',
        'Report harassment immediately',
        'Maintain professional boundaries',
        'Keep emergency contacts updated'
      ],
      icon: '💼'
    }
  ];

  const startCourse = (course) => {
    setSelectedCourse(course);
    toast.success(`Starting course: ${course.title}`);
  };

  const continueCourse = (course) => {
    setSelectedCourse(course);
    toast.info(`Continuing ${course.title}`);
  };

  const watchVideo = (video) => {
    toast.success(`Playing: ${video.title}`);
    // In real app, open video player
  };

  const readArticle = (article) => {
    toast.info(`Opening article: ${article.title}`);
    // In real app, open article
  };

  const markComplete = (courseId) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: 100
    }));
    toast.success('Lesson completed!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          📚 Safety Education
        </h1>
        <p className="text-gray-600 mt-1">
          Learn essential safety skills and knowledge
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <AcademicCapIcon className="w-8 h-8 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
          <p className="text-xs text-gray-600">Courses</p>
        </Card>
        <Card className="text-center">
          <VideoCameraIcon className="w-8 h-8 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{videos.length}+</p>
          <p className="text-xs text-gray-600">Videos</p>
        </Card>
        <Card className="text-center">
          <DocumentTextIcon className="w-8 h-8 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{articles.length}+</p>
          <p className="text-xs text-gray-600">Articles</p>
        </Card>
        <Card className="text-center">
          <LightBulbIcon className="w-8 h-8 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">50+</p>
          <p className="text-xs text-gray-600">Safety Tips</p>
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
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-lg flex items-center justify-center">
                    <AcademicCapIcon className="w-12 h-12 text-white opacity-50" />
                  </div>
                  
                  {course.progress > 0 && (
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
                      {course.progress}% Complete
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{course.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>⏱️ {course.duration}</span>
                    <span>📚 {course.lessons} lessons</span>
                    <span>🎓 {course.level}</span>
                  </div>

                  {course.progress > 0 ? (
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => continueCourse(course)}
                      >
                        Continue Learning
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => startCourse(course)}
                    >
                      Start Course
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => watchVideo(video)}
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <PlayIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h4>
                  <p className="text-xs text-gray-500">{video.instructor}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{video.views} views</span>
                    <PlayIconSolid className="w-4 h-4 text-primary-500" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="space-y-3">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => readArticle(article)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{article.title}</h4>
                      <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>✍️ {article.author}</span>
                      <span>📅 {article.date}</span>
                      <span>⏱️ {article.readTime}</span>
                    </div>
                  </div>

                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Safety Tips Tab */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyTips.map((category) => (
              <Card key={category.category} className="bg-primary-50 border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.category}
                </h3>

                <ul className="space-y-2">
                  {category.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-primary-700">
                      <CheckCircleIcon className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedCourse.title}</h3>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-gray-600">{selectedCourse.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>⏱️ Duration: {selectedCourse.duration}</span>
                  <span>📚 {selectedCourse.lessons} lessons</span>
                  <span>🎓 Level: {selectedCourse.level}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Course Topics</h4>
                <ul className="space-y-2">
                  {selectedCourse.topics.map((topic, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                        {index + 1}
                      </div>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedCourse.progress > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Your Progress</h4>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: `${selectedCourse.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedCourse.progress}% complete
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {selectedCourse.progress > 0 ? (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCourse(null);
                      toast.success('Continuing course...');
                    }}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCourse(null);
                      toast.success('Course started!');
                    }}
                  >
                    Start Course
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedCourse(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SafetyEducation;
