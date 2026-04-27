import React, { useState } from 'react';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1990-01-01',
    address: '123 Main Street, City, State',
    bio: 'Safety advocate and community member',
    avatar: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
        setProfile({...profile, avatar: event.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <h2>Profile Settings</h2>
        <p>Manage your personal information and preferences</p>
      </div>

      <div className="profile-avatar">
        <div className="avatar-container">
          {previewImage || profile.avatar ? (
            <img src={previewImage || profile.avatar} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {profile.name.charAt(0)}
            </div>
          )}
          <label className="upload-btn">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="profile-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            value={profile.address}
            onChange={(e) => setProfile({...profile, address: e.target.value})}
            disabled={!isEditing}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            disabled={!isEditing}
            rows={3}
            placeholder="Tell us about yourself"
          />
        </div>
      </div>

      <div className="profile-actions">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit Profile
          </button>
        ) : (
          <>
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .profile-settings {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .settings-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .settings-header h2 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .settings-header p {
          margin: 0;
          color: #666;
        }

        .profile-avatar {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .avatar-container {
          position: relative;
        }

        .avatar-container img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #007bff;
        }

        .avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
        }

        .upload-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #007bff;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          white-space: nowrap;
        }

        .profile-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #666;
          font-weight: 500;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
        }

        .form-group input:disabled, .form-group textarea:disabled {
          background: #f8f9fa;
          color: #333;
        }

        .profile-actions {
          display: flex;
          gap: 15px;
        }

        .edit-btn, .save-btn, .cancel-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .edit-btn, .save-btn {
          background: #28a745;
          color: white;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ProfileSettings;
