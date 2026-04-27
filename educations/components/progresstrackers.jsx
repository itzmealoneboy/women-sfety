import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressTrackers = () => {
  const [overallProgress, setOverallProgress] = useState(0);
  const [moduleProgress, setModuleProgress] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [learningHistory, setLearningHistory] = useState([]);
  const [timeSpent, setTimeSpent] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, [selectedTimeframe]);

  const fetchProgressData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockModuleProgress = [
        { id: 1, name: 'Cybersecurity Basics', progress: 85, completed: 12, total: 14, timeSpent: 120, status: 'in-progress' },
        { id: 2, name: 'Social Media Safety', progress: 45, completed: 5, total: 11, timeSpent: 65, status: 'in-progress' },
        { id: 3, name: 'Emergency Response', progress: 100, completed: 8, total: 8, timeSpent: 180, status: 'completed' },
        { id: 4, name: 'First Aid Basics', progress: 30, completed: 3, total: 10, timeSpent: 45, status: 'in-progress' },
        { id: 5, name: 'Cyber Hygiene', progress: 0, completed: 0, total: 6, timeSpent: 0, status: 'not-started' },
        { id: 6, name: 'Data Privacy', progress: 60, completed: 9, total: 15, timeSpent: 95, status: 'in-progress' }
      ];

      const mockSkillLevels = [
        { name: 'Cybersecurity', level: 75, color: '#007bff' },
        { name: 'Privacy', level: 65, color: '#28a745' },
        { name: 'Emergency Response', level: 85, color: '#dc3545' },
        { name: 'Digital Literacy', level: 70, color: '#ffc107' },
        { name: 'Self Defense', level: 45, color: '#fd7e14' }
      ];

      const mockLearningHistory = {
        week: [
          { day: 'Mon', hours: 1.5, modules: 2, quizzes: 1 },
          { day: 'Tue', hours: 2, modules: 3, quizzes: 0 },
          { day: 'Wed', hours: 1, modules: 1, quizzes: 2 },
          { day: 'Thu', hours: 2.5, modules: 3, quizzes: 1 },
          { day: 'Fri', hours: 1.5, modules: 2, quizzes: 1 },
          { day: 'Sat', hours: 3, modules: 4, quizzes: 2 },
          { day: 'Sun', hours: 2, modules: 3, quizzes: 1 }
        ],
        month: [
          { day: 'Week 1', hours: 12, modules: 15, quizzes: 8 },
          { day: 'Week 2', hours: 14, modules: 18, quizzes: 10 },
          { day: 'Week 3', hours: 10, modules: 12, quizzes: 6 },
          { day: 'Week 4', hours: 16, modules: 20, quizzes: 12 }
        ],
        year: [
          { month: 'Jan', hours: 45, modules: 58, quizzes: 30 },
          { month: 'Feb', hours: 52, modules: 65, quizzes: 35 },
          { month: 'Mar', hours: 48, modules: 60, quizzes: 32 },
          { month: 'Apr', hours: 55, modules: 70, quizzes: 38 },
          { month: 'May', hours: 60, modules: 75, quizzes: 42 },
          { month: 'Jun', hours: 58, modules: 72, quizzes: 40 }
        ]
      };

      const mockUpcomingDeadlines = [
        { id: 1, title: 'Cybersecurity Quiz', module: 'Cybersecurity Basics', dueDate: '2024-01-20', priority: 'high' },
        { id: 2, title: 'Module Completion', module: 'Social Media Safety', dueDate: '2024-01-25', priority: 'medium' },
        { id: 3, title: 'Final Assessment', module: 'Data Privacy', dueDate: '2024-01-30', priority: 'high' },
        { id: 4, title: 'Practice Test', module: 'First Aid Basics', dueDate: '2024-02-01', priority: 'low' }
      ];

      const mockAchievements = [
        { id: 1, title: 'First Module Completed', earned: true, earnedDate: '2024-01-10', icon: '🎯' },
        { id: 2, title: 'Quiz Master', earned: true, earnedDate: '2024-01-12', icon: '📝' },
        { id: 3, title: '10 Hours Learned', earned: true, earnedDate: '2024-01-14', icon: '⏱️' },
        { id: 4, title: 'Perfect Score', earned: false, required: 'Get 100% on any quiz', icon: '⭐' },
        { id: 5, title: 'Certificate Earned', earned: false, required: 'Complete any certification', icon: '📜' }
      ];

      const totalProgress = mockModuleProgress.reduce((sum, m) => sum + m.progress, 0) / mockModuleProgress.length;
      setOverallProgress(Math.round(totalProgress));
      setModuleProgress(mockModuleProgress);
      setSkillLevels(mockSkillLevels);
      setLearningHistory(mockLearningHistory[selectedTimeframe]);
      setTimeSpent({ daily: 2.5, weekly: 15.5, monthly: 58 });
      setUpcomingDeadlines(mockUpcomingDeadlines);
      setAchievements(mockAchievements);
      setLoading(false);
    }, 1000);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#28a745';
    if (progress >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return { text: '✓ Completed', color: '#28a745' };
      case 'in-progress': return { text: '⏳ In Progress', color: '#ffc107' };
      default: return { text: '📝 Not Started', color: '#6c757d' };
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const COLORS = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#fd7e14'];

  return (
    <div className="progress-trackers">
      <div className="trackers-header">
        <h2>Learning Progress Tracker</h2>
        <p>Monitor your learning journey and achievements</p>
      </div>

      {loading ? (
        <div className="loading">Loading progress data...</div>
      ) : (
        <>
          {/* Overall Progress Card */}
          <div className="overall-progress-card">
            <div className="progress-circle">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth="12"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  stroke={getProgressColor(overallProgress)}
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 80 * overallProgress / 100} ${2 * Math.PI * 80 * (100 - overallProgress) / 100}`}
                  strokeDashoffset={2 * Math.PI * 80 * 0.25}
                  transform="rotate(-90 90 90)"
                />
                <text
                  x="90"
                  y="105"
                  textAnchor="middle"
                  fontSize="32"
                  fontWeight="bold"
                  fill={getProgressColor(overallProgress)}
                >
                  {overallProgress}%
                </text>
                <text
                  x="90"
                  y="130"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  Overall Progress
                </text>
              </svg>
            </div>
            <div className="progress-stats">
              <div className="stat-item">
                <div className="stat-value">{timeSpent.weekly} hrs</div>
                <div className="stat-label">This Week</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{timeSpent.monthly} hrs</div>
                <div className="stat-label">This Month</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{moduleProgress.filter(m => m.status === 'completed').length}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{moduleProgress.filter(m => m.status === 'in-progress').length}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="timeframe-selector">
            <button className={selectedTimeframe === 'week' ? 'active' : ''} onClick={() => setSelectedTimeframe('week')}>
              Week
            </button>
            <button className={selectedTimeframe === 'month' ? 'active' : ''} onClick={() => setSelectedTimeframe('month')}>
              Month
            </button>
            <button className={selectedTimeframe === 'year' ? 'active' : ''} onClick={() => setSelectedTimeframe('year')}>
              Year
            </button>
          </div>

          {/* Learning Activity Chart */}
          <div className="chart-card">
            <h3>Learning Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={learningHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={selectedTimeframe === 'year' ? 'month' : 'day'} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="hours" fill="#007bff" name="Hours Spent" />
                <Bar yAxisId="right" dataKey="modules" fill="#28a745" name="Modules Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="progress-grid">
            {/* Module Progress */}
            <div className="module-progress-section">
              <h3>Module Progress</h3>
              <div className="modules-list">
                {moduleProgress.map(module => {
                  const status = getStatusBadge(module.status);
                  return (
                    <div key={module.id} className="module-progress-item">
                      <div className="module-header">
                        <div className="module-name">{module.name}</div>
                        <div className="module-status" style={{ color: status.color }}>{status.text}</div>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${module.progress}%`, backgroundColor: getProgressColor(module.progress) }} />
                        </div>
                        <div className="progress-percentage">{module.progress}%</div>
                      </div>
                      <div className="module-details">
                        <span>📚 {module.completed}/{module.total} lessons</span>
                        <span>⏱️ {module.timeSpent} min spent</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skill Levels */}
            <div className="skill-levels-section">
              <h3>Skill Levels</h3>
              <div className="skills-list">
                {skillLevels.map(skill => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: `${skill.level}%`, backgroundColor: skill.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements & Deadlines */}
          <div className="achievements-deadlines">
            <div className="achievements-section">
              <h3>Achievements</h3>
              <div className="achievements-grid">
                {achievements.map(achievement => (
                  <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <div className="achievement-title">{achievement.title}</div>
                      {achievement.earned ? (
                        <div className="achievement-date">Earned: {achievement.earnedDate}</div>
                      ) : (
                        <div className="achievement-required">{achievement.required}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="deadlines-section">
              <h3>Upcoming Deadlines</h3>
              <div className="deadlines-list">
                {upcomingDeadlines.map(deadline => (
                  <div key={deadline.id} className="deadline-item">
                    <div className="deadline-priority" style={{ backgroundColor: getPriorityColor(deadline.priority) }} />
                    <div className="deadline-info">
                      <div className="deadline-title">{deadline.title}</div>
                      <div className="deadline-module">{deadline.module}</div>
                      <div className="deadline-date">📅 Due: {deadline.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Insights */}
          <div className="insights-section">
            <h3>AI Learning Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">📈</div>
                <h4>Learning Pace</h4>
                <p>You're learning 15% faster than last month. Keep it up!</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <h4>Recommended Focus</h4>
                <p>Spend more time on "Social Media Safety" to improve your privacy skills</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">⭐</div>
                <h4>Next Milestone</h4>
                <p>Complete 2 more modules to earn the "Learning Champion" badge</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📊</div>
                <h4>Weekly Goal</h4>
                <p>You're 80% towards your weekly goal of 10 learning hours</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">{moduleProgress.reduce((sum, m) => sum + m.completed, 0)}</div>
                <div className="stat-label">Lessons Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-value">{moduleProgress.reduce((sum, m) => sum + Math.floor(m.progress / 20), 0)}</div>
                <div className="stat-label">Quizzes Taken</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">{achievements.filter(a => a.earned).length}/{achievements.length}</div>
                <div className="stat-label">Achievements</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <div className="stat-value">{Math.floor(timeSpent.weekly / 7)} hrs/day</div>
                <div className="stat-label">Daily Average</div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .progress-trackers {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .trackers-header {
          margin-bottom: 30px;
        }

        .trackers-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .trackers-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #666;
        }

        .overall-progress-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .stat-item {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }

        .timeframe-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          justify-content: flex-end;
        }

        .timeframe-selector button {
          padding: 6px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .timeframe-selector button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .chart-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chart-card h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .progress-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .module-progress-section, .skill-levels-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .module-progress-section h3, .skill-levels-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .modules-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .module-progress-item {
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .module-name {
          font-weight: 500;
          color: #333;
        }

        .module-status {
          font-size: 12px;
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-percentage {
          font-size: 12px;
          color: #666;
          min-width: 40px;
        }

        .module-details {
          display: flex;
          gap: 15px;
          font-size: 11px;
          color: #999;
        }

        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .skill-item {
          width: 100%;
        }

        .skill-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 13px;
        }

        .skill-name {
          color: #666;
        }

        .skill-percentage {
          font-weight: 500;
        }

        .skill-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .skill-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .achievements-deadlines {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .achievements-section, .deadlines-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .achievements-section h3, .deadlines-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .achievement-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .achievement-card.earned {
          background: #d4edda;
          border-left: 3px solid #28a745;
        }

        .achievement-card.locked {
          background: #f8f9fa;
          opacity: 0.7;
        }

        .achievement-icon {
          font-size: 28px;
        }

        .achievement-info {
          flex: 1;
        }

        .achievement-title {
          font-weight: 500;
          font-size: 13px;
          color: #333;
        }

        .achievement-date, .achievement-required {
          font-size: 10px;
          color: #666;
          margin-top: 4px;
        }

        .deadlines-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .deadline-priority {
          width: 4px;
          height: 40px;
          border-radius: 2px;
        }

        .deadline-info {
          flex: 1;
        }

        .deadline-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .deadline-module {
          font-size: 11px;
          color: #666;
          margin-bottom: 2px;
        }

        .deadline-date {
          font-size: 10px;
          color: #999;
        }

        .insights-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .insights-section h3 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .insight-card {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
        }

        .insight-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .insight-card h4 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 14px;
        }

        .insight-card p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-icon {
          font-size: 40px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .progress-grid, .achievements-deadlines {
            grid-template-columns: 1fr;
          }
          
          .insights-grid {
            grid-template-columns: 1fr;
          }
          
          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressTrackers;
