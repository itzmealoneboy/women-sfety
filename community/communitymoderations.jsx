import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authstores';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import {
  ShieldCheckIcon,
  FlagIcon,
  NoSymbolIcon,
  UserMinusIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  BellSlashIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { FlagIcon as FlagIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const CommunityModeration = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockDuration, setBlockDuration] = useState('permanent');

  const tabs = [
    { id: 'reports', name: 'Reports', icon: FlagIcon },
    { id: 'blocked', name: 'Blocked Users', icon: NoSymbolIcon },
    { id: 'muted', name: 'Muted Users', icon: BellSlashIcon },
    { id: 'moderation', name: 'Moderation Log', icon: ShieldCheckIcon }
  ];

  const reportTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'harassment', name: 'Harassment' },
    { id: 'spam', name: 'Spam' },
    { id: 'hate-speech', name: 'Hate Speech' },
    { id: 'violence', name: 'Violence' },
    { id: 'inappropriate', name: 'Inappropriate Content' },
    { id: 'fake-profile', name: 'Fake Profile' },
    { id: 'other', name: 'Other' }
  ];

  useEffect(() => {
    loadReports();
    loadBlockedUsers();
    loadMutedUsers();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchQuery, selectedStatus, selectedType, reports]);

  const loadReports = () => {
    // Mock reports data
    const mockReports = [
      {
        id: 1,
        type: 'harassment',
        reporter: 'Priya S.',
        reportedUser: 'user123',
        reportedUserName: 'Anonymous User',
        content: 'Inappropriate comments on post',
        status: 'pending',
        date: '2024-03-18T10:30:00Z',
        severity: 'high',
        postId: 123,
        details: 'User made multiple harassing comments on a safety post.',
        evidence: ['screenshot1.jpg', 'screenshot2.jpg']
      },
      {
        id: 2,
        type: 'spam',
        reporter: 'Lakshmi R.',
        reportedUser: 'user456',
        reportedUserName: 'Spam Account',
        content: 'Repeated promotional messages',
        status: 'resolved',
        date: '2024-03-17T15:45:00Z',
        severity: 'low',
        postId: 456,
        details: 'User posted same message 10 times in different threads.',
        evidence: ['screenshot3.jpg']
      },
      {
        id: 3,
        type: 'hate-speech',
        reporter: 'Meena K.',
        reportedUser: 'user789',
        reportedUserName: 'Offensive User',
        content: 'Hateful comments against women',
        status: 'in-progress',
        date: '2024-03-18T09:15:00Z',
        severity: 'high',
        postId: 789,
        details: 'User made derogatory remarks about women in multiple posts.',
        evidence: ['screenshot4.jpg', 'screenshot5.jpg', 'screenshot6.jpg']
      }
    ];

    setReports(mockReports);
    setFilteredReports(mockReports);
  };

  const loadBlockedUsers = () => {
    // Mock blocked users
    const mockBlocked = [
      { id: 1, username: 'spam_account_1', reason: 'Spam', blockedAt: '2024-03-15T10:30:00Z', expiresAt: null },
      { id: 2, username: 'harasser_123', reason: 'Harassment', blockedAt: '2024-03-14T15:45:00Z', expiresAt: '2024-04-14T15:45:00Z' }
    ];
    setBlockedUsers(mockBlocked);
  };

  const loadMutedUsers = () => {
    // Mock muted users
    const mockMuted = [
      { id: 1, username: 'noisy_user', reason: 'Spam', mutedAt: '2024-03-16T09:15:00Z', expiresAt: '2024-03-23T09:15:00Z' }
    ];
    setMutedUsers(mockMuted);
  };

  const filterReports = () => {
    let filtered = [...reports];

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.reportedUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reporter.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    setFilteredReports(filtered);
  };

  const handleBlockUser = (userId, username) => {
    const newBlocked = {
      id: Date.now(),
      username,
      reason: blockReason,
      blockedAt: new Date().toISOString(),
      expiresAt: blockDuration === 'permanent' ? null : new Date(Date.now() + parseInt(blockDuration) * 24 * 60 * 60 * 1000).toISOString()
    };
    setBlockedUsers([newBlocked, ...blockedUsers]);
    toast.success(`User ${username} blocked`);
    setShowBlockModal(false);
    setBlockReason('');
    setBlockDuration('permanent');
  };

  const handleUnblockUser = (id) => {
    setBlockedUsers(blockedUsers.filter(u => u.id !== id));
    toast.success('User unblocked');
  };

  const handleMuteUser = (userId, username, days = 7) => {
    const newMuted = {
      id: Date.now(),
      username,
      reason: 'Reported content',
      mutedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    };
    setMutedUsers([newMuted, ...mutedUsers]);
    toast.success(`User ${username} muted for ${days} days`);
  };

  const handleUnmuteUser = (id) => {
    setMutedUsers(mutedUsers.filter(u => u.id !== id));
    toast.success('User unmuted');
  };

  const handleResolveReport = (reportId, action) => {
    setReports(reports.map(r =>
      r.id === reportId ? { ...r, status: 'resolved', resolution: action } : r
    ));
    toast.success(`Report resolved: ${action}`);
    setSelectedReport(null);
  };

  const handleDeletePost = (postId) => {
    toast.success(`Post ${postId} deleted`);
  };

  const handleWarnUser = (userId) => {
    toast.success(`Warning sent to user`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-warning bg-warning/10';
      case 'in-progress': return 'text-primary-500 bg-primary-100';
      case 'resolved': return 'text-success bg-success/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-danger bg-danger/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            👥 Community Moderation
          </h1>
          <p className="text-gray-600 mt-1">
            Manage reports, block users, and maintain community safety
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <FlagIcon className="w-6 h-6 mx-auto text-warning mb-2" />
          <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
          <p className="text-xs text-gray-600">Total Reports</p>
        </Card>
        <Card className="text-center">
          <ClockIcon className="w-6 h-6 mx-auto text-primary-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {reports.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-xs text-gray-600">Pending</p>
        </Card>
        <Card className="text-center">
          <NoSymbolIcon className="w-6 h-6 mx-auto text-danger mb-2" />
          <p className="text-2xl font-bold text-gray-800">{blockedUsers.length}</p>
          <p className="text-xs text-gray-600">Blocked Users</p>
        </Card>
        <Card className="text-center">
          <BellSlashIcon className="w-6 h-6 mx-auto text-secondary-500 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{mutedUsers.length}</p>
          <p className="text-xs text-gray-600">Muted Users</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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
        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <>
            {/* Search and Filters */}
            <Card>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by user or content..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      report.type === 'harassment' ? 'bg-danger/10' :
                      report.type === 'spam' ? 'bg-warning/10' :
                      report.type === 'hate-speech' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      <FlagIcon className={`w-5 h-5 ${
                        report.type === 'harassment' ? 'text-danger' :
                        report.type === 'spam' ? 'text-warning' :
                        report.type === 'hate-speech' ? 'text-purple-600' :
                        'text-gray-600'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">Report against {report.reportedUserName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{report.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(report.severity)}`}>
                            {report.severity}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>Reported by: {report.reporter}</span>
                        <span>•</span>
                        <span>{formatDate(report.date)}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleResolveReport(report.id, 'dismissed')}
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Dismiss
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            handleBlockUser(report.reportedUser, report.reportedUserName);
                            handleResolveReport(report.id, 'user_blocked');
                          }}
                        >
                          <NoSymbolIcon className="w-4 h-4 mr-1" />
                          Block User
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleDeletePost(report.postId)}
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          Delete Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Blocked Users Tab */}
        {activeTab === 'blocked' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Blocked Users</h3>

            {blockedUsers.length === 0 ? (
              <div className="text-center py-8">
                <NoSymbolIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No blocked users</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-xs text-gray-500">Reason: {user.reason}</p>
                      <p className="text-xs text-gray-400">
                        Blocked: {formatDate(user.blockedAt)}
                        {user.expiresAt && ` • Expires: ${new Date(user.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnblockUser(user.id)}
                    >
                      Unblock
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Muted Users Tab */}
        {activeTab === 'muted' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Muted Users</h3>

            {mutedUsers.length === 0 ? (
              <div className="text-center py-8">
                <BellSlashIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No muted users</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mutedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-xs text-gray-500">Reason: {user.reason}</p>
                      <p className="text-xs text-gray-400">
                        Muted: {formatDate(user.mutedAt)}
                        {user.expiresAt && ` • Expires: ${new Date(user.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnmuteUser(user.id)}
                    >
                      Unmute
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Moderation Log Tab */}
        {activeTab === 'moderation' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Moderation Log</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm">User @spam_account was blocked for spam</p>
                  <p className="text-xs text-gray-500">by Moderator • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FlagIcon className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm">Report #123 was resolved - content removed</p>
                  <p className="text-xs text-gray-500">by Admin • 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BellSlashIcon className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="text-sm">User @noisy_user muted for 7 days</p>
                  <p className="text-xs text-gray-500">by Moderator • 1 day ago</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Report ID</p>
                  <p className="font-medium">#{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reported User</p>
                  <p className="font-medium">{selectedReport.reportedUserName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reported By</p>
                  <p className="font-medium">{selectedReport.reporter}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedReport.date).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Content</p>
                <p className="text-gray-700">{selectedReport.content}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Details</p>
                <p className="text-gray-700">{selectedReport.details}</p>
              </div>

              {selectedReport.evidence && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Evidence</p>
                  <div className="space-y-2">
                    {selectedReport.evidence.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={() => toast.info('Download started')}
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={() => {
                    handleResolveReport(selectedReport.id, 'dismissed');
                    setSelectedReport(null);
                  }}
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Dismiss
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    handleBlockUser(selectedReport.reportedUser, selectedReport.reportedUserName);
                    handleResolveReport(selectedReport.id, 'user_blocked');
                    setSelectedReport(null);
                  }}
                >
                  <NoSymbolIcon className="w-5 h-5 mr-2" />
                  Block User
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Block User Modal */}
      <Modal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title="Block User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for blocking
            </label>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
              placeholder="Enter reason..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block Duration
            </label>
            <select
              value={blockDuration}
              onChange={(e) => setBlockDuration(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>

          <div className="bg-warning/10 p-4 rounded-lg">
            <p className="text-sm text-warning">
              <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
              Blocked users cannot see your posts or interact with you.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowBlockModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => handleBlockUser('user123', 'username')}
            >
              Block User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityModeration;

