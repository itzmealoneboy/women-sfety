import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  PlayIcon,
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  FireIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { PlayIcon as PlayIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const SelfDefense = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [enrolledWorkshops, setEnrolledWorkshops] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const tabs = [
    { id: 'videos', name: 'Video Tutorials', icon: PlayIcon },
    { id: 'workshops', name: 'Workshops', icon: UserGroupIcon },
    { id: 'techniques', name: 'Techniques', icon: ShieldCheckIcon },
    { id: 'instructors', name: 'Instructors', icon: AcademicCapIcon }
  ];

  const videos = [
    {
      id: 1,
      title: 'Basic Self-Defense Moves for Beginners',
      instructor: 'Priya Sharma',
      duration: '15:30',
      level: 'Beginner',
      views: '125K',
      rating: 4.8,
      thumbnail: 'video1.jpg',
      description: 'Learn fundamental self-defense techniques that anyone can master. This video covers basic strikes, blocks, and escapes.',
      techniques: ['Palm strike', 'Knee strike', 'Wrist release', 'Basic blocks'],
      equipment: ['None required'],
      tips: ['Practice slowly first', 'Focus on technique, not power']
    },
    {
      id: 2,
      title: 'Escape from Common Holds',
      instructor: 'Meera Krishnan',
      duration: '18:45',
      level: 'Intermediate',
      views: '89K',
      rating: 4.9,
      thumbnail: 'video2.jpg',
      description: 'Learn how to escape from wrist grabs, choke holds, and bear hugs. Practical techniques for real situations.',
      techniques: ['Wrist grab release', 'Choke escape', 'Bear hug release', 'Hair grab defense'],
      equipment: ['Training partner recommended'],
      tips: ['Practice with a partner', 'Use gradual resistance']
    },
    {
      id: 3,
      title: 'Using Everyday Objects for Defense',
      instructor: 'Rahul Verma',
      duration: '12:20',
      level: 'Beginner',
      views: '67K',
      rating: 4.7,
      thumbnail: 'video3.jpg',
      description: 'Learn how to use keys, pens, bags, and other everyday items for self-defense.',
      techniques: ['Key strikes', 'Pen defense', 'Bag as shield', 'Umbrella techniques'],
      equipment: ['Keys', 'Pen', 'Bag'],
      tips: ['Always have items accessible', 'Practice drawing quickly']
    },
    {
      id: 4,
      title: 'Ground Defense Techniques',
      instructor: 'Lakshmi Raj',
      duration: '22:10',
      level: 'Advanced',
      views: '45K',
      rating: 4.9,
      thumbnail: 'video4.jpg',
      description: 'Essential techniques for defending yourself if you\'re knocked to the ground.',
      techniques: ['Guard position', 'Sweeps', 'Get-ups', 'Ground strikes'],
      equipment: ['Mat', 'Training partner'],
      tips: ['Learn to get up quickly', 'Protect your head']
    },
    {
      id: 5,
      title: 'Verbal De-escalation Techniques',
      instructor: 'Dr. Sanjay Gupta',
      duration: '20:30',
      level: 'Beginner',
      views: '34K',
      rating: 4.8,
      thumbnail: 'video5.jpg',
      description: 'Learn how to use your voice and body language to prevent physical confrontation.',
      techniques: ['Voice projection', 'Body language', 'Boundary setting', 'Exit strategies'],
      equipment: ['None'],
      tips: ['Stay calm', 'Maintain eye contact', 'Create distance']
    },
    {
      id: 6,
      title: 'Advanced Striking Combinations',
      instructor: 'Deepa Nair',
      duration: '25:15',
      level: 'Advanced',
      views: '28K',
      rating: 4.9,
      thumbnail: 'video6.jpg',
      description: 'Master powerful striking combinations for maximum effectiveness.',
      techniques: ['Punch combinations', 'Kick combinations', 'Elbow strikes', 'Knee strikes'],
      equipment: ['Punching bag', 'Hand wraps'],
      tips: ['Practice combinations slowly', 'Focus on accuracy']
    }
  ];

  const workshops = [
    {
      id: 1,
      title: 'Women\'s Self-Defense Workshop',
      instructor: 'Priya Sharma',
      date: '2024-03-25',
      time: '10:00 AM - 1:00 PM',
      location: 'Community Center, T Nagar',
      price: 'Free',
      spots: 15,
      enrolled: 12,
      level: 'Beginner',
      description: 'A comprehensive workshop covering basic self-defense techniques, awareness, and prevention strategies.',
      includes: ['Basic techniques', 'Situational awareness', 'Q&A session', 'Take-home materials']
    },
    {
      id: 2,
      title: 'Advanced Self-Defense Training',
      instructor: 'Meera Krishnan',
      date: '2024-03-28',
      time: '2:00 PM - 5:00 PM',
      location: 'Fitness Center, Anna Nagar',
      price: '₹500',
      spots: 10,
      enrolled: 7,
      level: 'Intermediate',
      description: 'Intensive training for those with basic knowledge. Focus on real-world applications.',
      includes: ['Advanced techniques', 'Scenario training', 'Partner drills', 'Certificate']
    },
    {
      id: 3,
      title: 'Self-Defense for College Students',
      instructor: 'Rahul Verma',
      date: '2024-04-02',
      time: '3:00 PM - 5:00 PM',
      location: 'Women\'s College, Mylapore',
      price: 'Free for students',
      spots: 30,
      enrolled: 18,
      level: 'Beginner',
      description: 'Special workshop for college students focusing on campus safety and prevention.',
      includes: ['Campus safety tips', 'Basic techniques', 'Peer support', 'Resource guide']
    },
    {
      id: 4,
      title: 'Weekend Self-Defense Camp',
      instructor: 'Lakshmi Raj',
      date: '2024-04-06',
      time: '9:00 AM - 4:00 PM',
      location: 'Sports Complex, Velachery',
      price: '₹1,000',
      spots: 20,
      enrolled: 5,
      level: 'All levels',
      description: 'Full-day camp covering everything from basics to advanced techniques. Lunch included.',
      includes: ['All techniques', 'Lunch', 'Training manual', 'Certificate', 'Follow-up session']
    }
  ];

  const techniques = [
    {
      id: 1,
      name: 'Palm Heel Strike',
      category: 'Strikes',
      difficulty: 'Beginner',
      description: 'A powerful strike using the heel of your palm, targeting the nose or chin.',
      steps: [
        'Stand with feet shoulder-width apart',
        'Bring your hand back near your shoulder',
        'Thrust forward with the heel of your palm',
        'Aim for the attacker\'s nose or chin',
        'Follow through and recover quickly'
      ],
      image: 'palm-strike.jpg',
      video: 'palm-strike.mp4'
    },
    {
      id: 2,
      name: 'Knee Strike',
      category: 'Strikes',
      difficulty: 'Beginner',
      description: 'A devastating close-range strike using your knee, targeting the groin or stomach.',
      steps: [
        'Grab attacker\'s shoulders or head',
        'Pull them down while raising your knee',
        'Strike with the top of your knee',
        'Target groin or stomach area',
        'Create distance after strike'
      ],
      image: 'knee-strike.jpg',
      video: 'knee-strike.mp4'
    },
    {
      id: 3,
      name: 'Wrist Grab Release',
      category: 'Escapes',
      difficulty: 'Beginner',
      description: 'Escape when someone grabs your wrist.',
      steps: [
        'Rotate your wrist towards the attacker\'s thumb',
        'Pull your hand back sharply',
        'Step back to create distance',
        'Be ready to follow up with a strike',
        'Run to safety'
      ],
      image: 'wrist-release.jpg',
      video: 'wrist-release.mp4'
    },
    {
      id: 4,
      name: 'Choke Escape',
      category: 'Escapes',
      difficulty: 'Intermediate',
      description: 'Escape from a front chokehold.',
      steps: [
        'Tuck your chin down to protect airway',
        'Raise both arms up and over attacker\'s arms',
        'Turn your body to break the grip',
        'Strike vulnerable areas',
        'Create distance and escape'
      ],
      image: 'choke-escape.jpg',
      video: 'choke-escape.mp4'
    },
    {
      id: 5,
      name: 'Bear Hug Release',
      category: 'Escapes',
      difficulty: 'Intermediate',
      description: 'Escape from a bear hug (arms pinned).',
      steps: [
        'Bend your knees slightly',
        'Stomp on attacker\'s foot',
        'Throw head back into attacker\'s face',
        'Create space and turn',
        'Strike and run'
      ],
      image: 'bear-hug.jpg',
      video: 'bear-hug.mp4'
    },
    {
      id: 6,
      name: 'Hair Grab Defense',
      category: 'Escapes',
      difficulty: 'Intermediate',
      description: 'Defend against someone grabbing your hair.',
      steps: [
        'Grab attacker\'s hand with both of yours',
        'Press down hard to immobilize',
        'Strike to face or groin',
        'Step back while maintaining grip',
        'Run to safety'
      ],
      image: 'hair-grab.jpg',
      video: 'hair-grab.mp4'
    }
  ];

  const instructors = [
    {
      id: 1,
      name: 'Priya Sharma',
      specialization: 'Basic Self-Defense',
      experience: '10 years',
      rating: 4.9,
      students: 5000,
      image: 'instructor1.jpg',
      bio: 'Black belt in Karate with 10 years of teaching experience. Specializes in teaching beginners and building confidence.',
      achievements: ['National Karate Champion', 'Certified Self-Defense Instructor', 'Women\'s Safety Advocate']
    },
    {
      id: 2,
      name: 'Meera Krishnan',
      specialization: 'Advanced Techniques',
      experience: '15 years',
      rating: 5.0,
      students: 8000,
      image: 'instructor2.jpg',
      bio: 'Expert in Krav Maga and mixed martial arts. Has trained law enforcement and security personnel.',
      achievements: ['Krav Maga Expert Level 3', 'Police Training Instructor', 'International Speaker']
    },
    {
      id: 3,
      name: 'Rahul Verma',
      specialization: 'Practical Defense',
      experience: '8 years',
      rating: 4.8,
      students: 3500,
      image: 'instructor3.jpg',
      bio: 'Focuses on practical, easy-to-learn techniques for real-world situations. Great with beginners.',
      achievements: ['Certified Personal Trainer', 'Self-Defense Author', 'Workshop Facilitator']
    },
    {
      id: 4,
      name: 'Lakshmi Raj',
      specialization: 'Women\'s Safety',
      experience: '12 years',
      rating: 4.9,
      students: 6000,
      image: 'instructor4.jpg',
      bio: 'Dedicated to empowering women through self-defense. Runs free workshops for underprivileged communities.',
      achievements: ['Women\'s Safety Award 2023', 'NGO Partner', 'Community Leader']
    }
  ];

  const handleWatchVideo = (video) => {
    setSelectedVideo(video);
    toast.info(`Playing: ${video.title}`);
  };

  const handleEnrollWorkshop = (workshop) => {
    if (workshop.spots <= workshop.enrolled) {
      toast.error('Sorry, this workshop is full');
      return;
    }

    setEnrolledWorkshops([...enrolledWorkshops, workshop.id]);
    toast.success(`Enrolled in ${workshop.title}`);
  };

  const handleToggleFavorite = (videoId) => {
    if (favorites.includes(videoId)) {
      setFavorites(favorites.filter(id => id !== videoId));
      toast.success('Removed from favorites');
    } else {
      setFavorites([...favorites, videoId]);
      toast.success('Added to favorites');
    }
  };

  const handleFindWorkshop = () => {
    toast.info('Finding workshops near you...');
    // In real app, use geolocation to find nearby workshops
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'Beginner': return 'text-success bg-success/10';
      case 'Intermediate': return 'text-warning bg-warning/10';
      case 'Advanced': return 'text-danger bg-danger/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🥋 Self-Defense Training
          </h1>
          <p className="text-gray-600 mt-1">
            Learn to protect yourself with expert techniques and workshops
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleFindWorkshop}
        >
          <MapPinIcon className="w-5 h-5 mr-2" />
          Find Nearby Workshops
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <PlayIcon className="w-8 h-8 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{videos.length}+</p>
          <p className="text-xs text-gray-600">Video Tutorials</p>
        </Card>
        <Card className="text-center">
          <UserGroupIcon className="w-8 h-8 mx-auto text-success mb-2" />
          <p className="text-2xl font-bold text-gray-800">{workshops.length}+</p>
          <p className="text-xs text-gray-600">Workshops</p>
        </Card>
        <Card className="text-center">
          <ShieldCheckIcon className="w-8 h-8 mx-auto text-warning mb-2" />
          <p className="text-2xl font-bold text-gray-800">{techniques.length}</p>
          <p className="text-xs text-gray-600">Techniques</p>
        </Card>
        <Card className="text-center">
          <AcademicCapIcon className="w-8 h-8 mx-auto text-danger mb-2" />
          <p className="text-2xl font-bold text-gray-800">{instructors.length}</p>
          <p className="text-xs text-gray-600">Expert Instructors</p>
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
        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <PlayIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.level)}`}>
                      {video.level}
                    </span>
                    <button
                      onClick={() => handleToggleFavorite(video.id)}
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <StarIcon className={`w-4 h-4 ${
                        favorites.includes(video.id) ? 'text-warning fill-current' : 'text-gray-400'
                      }`} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-1 line-clamp-1">{video.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">by {video.instructor}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>👁️ {video.views} views</span>
                    <span className="flex items-center gap-1">
                      <StarIconSolid className="w-3 h-3 text-warning" />
                      {video.rating}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleWatchVideo(video)}
                    >
                      <PlayIcon className="w-4 h-4 mr-1" />
                      Watch
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(video.title);
                        toast.success('Video link copied');
                      }}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Workshops Tab */}
        {activeTab === 'workshops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshops.map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{workshop.title}</h4>
                    <p className="text-sm text-gray-600">by {workshop.instructor}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workshop.level)}`}>
                    {workshop.level}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(workshop.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    <span>{workshop.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{workshop.location}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{workshop.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-primary-600">{workshop.price}</p>
                    <p className="text-xs text-gray-500">
                      {workshop.spots - workshop.enrolled} spots left
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500"
                        style={{ width: `${(workshop.enrolled / workshop.spots) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{workshop.enrolled}/{workshop.spots} enrolled</p>
                  </div>
                </div>

                {enrolledWorkshops.includes(workshop.id) ? (
                  <div className="bg-success/10 text-success p-3 rounded-lg flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">You're enrolled!</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleEnrollWorkshop(workshop)}
                    disabled={workshop.spots <= workshop.enrolled}
                  >
                    Enroll Now
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Techniques Tab */}
        {activeTab === 'techniques' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techniques.map((technique) => (
              <Card key={technique.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{technique.name}</h4>
                        <p className="text-xs text-gray-500">{technique.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(technique.difficulty)}`}>
                        {technique.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">{technique.description}</p>

                    <div className="mt-3 space-y-1">
                      {technique.steps.slice(0, 3).map((step, index) => (
                        <p key={index} className="text-xs text-gray-500">• {step}</p>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          toast.info(`Opening technique: ${technique.name}`);
                        }}
                      >
                        Learn More
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          toast.success(`Practice mode for ${technique.name}`);
                        }}
                      >
                        Practice
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Instructors Tab */}
        {activeTab === 'instructors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {instructor.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{instructor.name}</h4>
                        <p className="text-sm text-gray-600">{instructor.specialization}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIconSolid className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium">{instructor.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>⏱️ {instructor.experience}</span>
                      <span>👥 {instructor.students.toLocaleString()} students</span>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{instructor.bio}</p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {instructor.achievements.slice(0, 2).map((achievement, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full"
                        >
                          🏆 {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
              <PlayIconSolid className="w-16 h-16 text-white opacity-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">About this tutorial</h4>
                  <p className="text-sm text-gray-600">{selectedVideo.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Techniques covered</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedVideo.techniques.map((tech, index) => (
                      <li key={index} className="text-sm text-gray-600">{tech}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Instructor tips</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedVideo.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-600">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Instructor:</span> {selectedVideo.instructor}</p>
                    <p><span className="text-gray-500">Duration:</span> {selectedVideo.duration}</p>
                    <p><span className="text-gray-500">Level:</span> {selectedVideo.level}</p>
                    <p><span className="text-gray-500">Views:</span> {selectedVideo.views}</p>
                    <p><span className="text-gray-500">Rating:</span> {selectedVideo.rating}/5</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Equipment needed</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedVideo.equipment.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setSelectedVideo(null);
                    toast.success('Practice session started!');
                  }}
                >
                  Practice Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SelfDefense;
