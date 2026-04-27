import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, pending: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        role: 'user',
        status: 'active',
        joinedDate: '2024-01-10',
        lastActive: '2024-01-15',
        reports: 2,
        verified: true
      },
      {
        id: 2,
        name: 'Priya Patel',
        email: 'priya@example.com',
        role: 'moderator',
        status: 'active',
        joinedDate: '2023-12-01',
        lastActive: '2024-01-14',
        reports: 0,
        verified: true
      },
      {
        id: 3,
        name: 'Amit Kumar',
        email: 'amit@example.com',
        role: 'user',
        status: 'suspended',
        joinedDate: '2024-01-05',
        lastActive: '2024-01-12',
        reports: 5,
        verified: false
      },
      {
        id: 4,
        name: 'Neha Singh',
        email: 'neha@example.com',
        role: 'admin',
        status: 'active',
        joinedDate: '2023-11-15',
        lastActive: '2024-01-15',
        reports: 0,
        verified: true
      }
    ];

    setUsers(mockUsers);
    updateStats(mockUsers);
  };

  const updateStats = (usersData) => {
    setStats({
      total: usersData.length,
      active: usersData.filter(u => u.status === 'active').length,
      suspended: usersData.filter(u => u.status === 'suspended').length,
      pending: usersData.filter(u => u.status === 'pending').length
    });
  };

  const updateUserStatus = (userId, newStatus) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
    updateStats(users);
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return '#dc3545';
      case 'moderator': return '#fd7e14';
      default: return '#007bff';
    }
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>User Management</h2>
        <p>Manage users, roles, and permissions</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.suspended}</div>
          <div className="stat-label">Suspended</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
          <button className={filter === 'suspended' ? 'active' : ''} onClick={() => setFilter('suspended')}>Suspended</button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Reports</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      {user.verified && <span className="verified-badge">✓ Verified</span>}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    style={{ backgroundColor: getRoleBadgeColor(user.role), color: 'white' }}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <div className={`status-badge status-${user.status}`}>
                    {user.status}
                  </div>
                </td>
                <td>{user.joinedDate}</td>
                <td>{user.reports}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => setSelectedUser(user)} className="btn-view">View</button>
                    {user.status === 'active' ? (
                      <button onClick={() => updateUserStatus(user.id, 'suspended')} className="btn-suspend">Suspend</button>
                    ) : user.status === 'suspended' ? (
                      <button onClick={() => updateUserStatus(user.id, 'active')} className="btn-activate">Activate</button>
                    ) : null}
                    <button className="btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <div className="user-detail">
              <div className="detail-avatar">{selectedUser.name.charAt(0)}</div>
              <div className="detail-info">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <p><strong>Joined:</strong> {selectedUser.joinedDate}</p>
                <p><strong>Last Active:</strong> {selectedUser.lastActive}</p>
                <p><strong>Reports Filed:</strong> {selectedUser.reports}</p>
                <p><strong>Verified:</strong> {selectedUser.verified ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setSelectedUser(null)} className="btn-close">Close</button>
              <button className="btn-message">Send Message</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .user-management {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .management-header {
          margin-bottom: 30px;
        }

        .management-header h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
        }

        .filters-section {
          margin-bottom: 30px;
        }

        .search-box {
          margin-bottom: 15px;
        }

        .search-box input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .status-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .status-filters button {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
        }

        .status-filters button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .users-table-container {
          background: white;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th,
        .users-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
        }

        .users-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #666;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .user-name {
          font-weight: 500;
        }

        .verified-badge {
          font-size: 11px;
          color: #28a745;
        }

        .role-select {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-active {
          background: #d4edda;
          color: #155724;
        }

        .status-suspended {
          background: #f8d7da;
          color: #721c24;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-view, .btn-suspend, .btn-activate, .btn-delete {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-view {
          background: #007bff;
          color: white;
        }

        .btn-suspend {
          background: #ffc107;
          color: #333;
        }

        .btn-activate {
          background: #28a745;
          color: white;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .user-modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
        }

        .user-detail {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .detail-avatar {
          width: 80px;
          height: 80px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
        }

        .detail-info p {
          margin: 8px 0;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-close, .btn-message {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-close {
          background: #6c757d;
          color: white;
        }

        .btn-message {
          background: #007bff;
          color: white;
        }

        @media (max-width: 768px) {
          .users-table {
            font-size: 12px;
          }
          
          .users-table th,
          .users-table td {
            padding: 10px;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
