# MongoDB Database Schema Reference

## Complete Schema Documentation for Sakhi Women Safety Project

This document provides the complete structure of all MongoDB collections in your project.

---

## 👥 Users Collection

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email format),
  phone: String (required, unique, 10-digit Indian format),
  password: String (required, hashed with bcryptjs, 6+ chars),
  role: String (enum: ['user', 'admin', 'moderator', 'emergency_responder']),
  
  // Profile
  profilePicture: String (URL),
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String (default: 'India')
  },
  
  // Emergency Contacts
  emergencyContacts: [{
    _id: ObjectId,
    name: String (required),
    relationship: String (required),
    phone: String (required),
    email: String,
    isPrimary: Boolean (default: false)
  }],
  
  // Trusted Contacts (Other Users)
  trustedCircles: [{
    userId: ObjectId (ref: 'User'),
    name: String,
    phone: String,
    status: String (enum: ['pending', 'accepted', 'blocked'])
  }],
  
  // Device Management
  deviceTokens: [{
    token: String,
    platform: String (enum: ['ios', 'android', 'web'])
  }],
  
  // Account Status
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  lastLogin: Date,
  
  // User Preferences
  preferences: {
    notifications: {
      email: Boolean (default: true),
      sms: Boolean (default: true),
      push: Boolean (default: true)
    },
    language: String (default: 'en'),
    locationTracking: Boolean (default: true)
  },
  
  // Safety Score
  safetyScore: Number (0-100, default: 100),
  
  // Metadata
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
- email: 1
- phone: 1
- emergencyContacts.phone: 1
- safetyScore: -1
```

---

## 🚨 Emergencies Collection

```javascript
{
  _id: ObjectId,
  
  // User Reference
  userId: ObjectId (ref: 'User', required),
  
  // Emergency Details
  type: String (enum: ['sos', 'medical', 'fire', 'accident', 'harassment', 'domestic_violence', 'other'], required),
  status: String (enum: ['active', 'responded', 'resolved', 'cancelled'], default: 'active'),
  priority: String (enum: ['low', 'medium', 'high', 'critical'], default: 'high'),
  description: String (max: 500),
  
  // Location (GeoJSON)
  location: {
    type: String (enum: ['Point'], default: 'Point'),
    coordinates: [Number, Number] (index: '2dsphere', required),
    address: String,
    city: String,
    state: String
  },
  
  // Authority Response
  contactedAuthorities: [{
    authority: String (enum: ['police', 'ambulance', 'fire', 'women_helpline']),
    contactedAt: Date (default: now),
    response: String,
    caseNumber: String
  }],
  
  // Notification Tracking
  notifiedContacts: [{
    contactId: ObjectId (ref: 'User'),
    phone: String,
    notifiedAt: Date,
    acknowledged: Boolean (default: false)
  }],
  
  // Media Recordings
  audioRecording: {
    url: String,
    duration: Number,
    uploadedAt: Date
  },
  videoRecording: {
    url: String,
    duration: Number,
    uploadedAt: Date
  },
  
  // Resolution
  resolvedAt: Date,
  resolvedBy: ObjectId (ref: 'User'),
  resolutionNotes: String,
  
  // Metadata
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
- location: '2dsphere'
- userId: 1
- status: 1
- createdAt: -1
```

---

## 📋 Reports Collection

```javascript
{
  _id: ObjectId,
  
  // User Reference
  userId: ObjectId (ref: 'User', required),
  
  // Report Details
  type: String (enum: ['harassment', 'assault', 'stalking', 'cyber_crime', 'domestic_violence', 'other'], required),
  title: String (required, max: 100),
  description: String (required, max: 2000),
  
  // Incident Info
  incidentDate: Date (required),
  incidentLocation: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Evidence
  evidence: [{
    type: String (enum: ['image', 'video', 'audio', 'document']),
    url: String,
    fileName: String,
    mimeType: String,
    size: Number,
    uploadedAt: Date (default: now)
  }],
  
  // Witnesses
  witnesses: [{
    name: String,
    phone: String,
    email: String,
    address: String,
    statement: String
  }],
  
  // Report Status
  status: String (enum: ['submitted', 'under_review', 'investigating', 'resolved', 'closed']),
  caseNumber: String (unique),
  severity: String (enum: ['low', 'medium', 'high', 'critical']),
  
  // Investigation
  assignedOfficer: ObjectId (ref: 'User'),
  notes: String,
  
  // Privacy
  isAnonymous: Boolean (default: false),
  
  // Metadata
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
- userId: 1
- status: 1
- type: 1
- caseNumber: 1
- createdAt: -1
```

---

## ⚖️ LegalAid Collection

```javascript
{
  _id: ObjectId,
  
  // User Reference
  userId: ObjectId (ref: 'User', required),
  
  // Case Details
  caseType: String (enum: ['domestic_violence', 'divorce', 'child_custody', 'harassment', 'property', 'employment', 'other'], required),
  description: String (required, max: 2000),
  urgency: String (enum: ['low', 'medium', 'high', 'critical'], default: 'medium'),
  
  // Preferences
  preferredLanguage: String (default: 'en'),
  location: {
    city: String,
    state: String,
    district: String
  },
  
  // Documents
  documents: [{
    name: String,
    url: String,
    uploadedAt: Date (default: now)
  }],
  
  // Lawyer Assignment
  assignedLawyer: {
    name: String,
    barId: String,
    contact: String,
    experience: Number,
    specialization: [String]
  },
  
  // Consultation
  consultationDate: Date,
  consultationType: String (enum: ['in_person', 'video', 'phone'], default: 'in_person'),
  consultationLink: String,
  
  // Status
  status: String (enum: ['pending', 'assigned', 'in_progress', 'resolved', 'closed']),
  
  // Metadata
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
- userId: 1
- status: 1
- caseType: 1
```

---

## 👥 Community Posts Collection

```javascript
{
  _id: ObjectId,
  
  // User Reference
  userId: ObjectId (ref: 'User', required),
  
  // Content
  content: String (required, max: 2000),
  media: [{
    type: String (enum: ['image', 'video', 'audio']),
    url: String,
    thumbnail: String
  }],
  
  // Categorization
  category: String (enum: ['safety_tip', 'experience', 'support', 'awareness', 'question', 'general'], default: 'general'),
  tags: [String],
  
  // Engagement
  likes: [{
    userId: ObjectId (ref: 'User'),
    likedAt: Date (default: now)
  }],
  comments: [{
    userId: ObjectId (ref: 'User'),
    comment: String,
    createdAt: Date (default: now),
    likes: [ObjectId]
  }],
  shares: [{
    userId: ObjectId (ref: 'User'),
    sharedAt: Date (default: now)
  }],
  
  // Moderation
  isAnonymous: Boolean (default: false),
  isModerated: Boolean (default: false),
  status: String (enum: ['active', 'hidden', 'deleted'], default: 'active'),
  
  // Statistics
  viewCount: Number (default: 0),
  likeCount: Number (default: 0),
  commentCount: Number (default: 0),
  shareCount: Number (default: 0),
  
  // Metadata
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
- userId: 1
- category: 1
- createdAt: -1
- status: 1
```

---

## 🔔 Notifications Collection

```javascript
{
  _id: ObjectId,
  
  // User Reference
  userId: ObjectId (ref: 'User', required, indexed),
  
  // Notification Details
  type: String (enum: ['emergency', 'safety_alert', 'community', 'legal_update', 'report_update', 'system', 'reminder'], required),
  title: String (required, max: 100),
  message: String (required, max: 500),
  
  // Custom Data
  data: Mixed (default: {}),
  
  // Priority & Status
  priority: String (enum: ['low', 'medium', 'high', 'critical'], default: 'medium'),
  status: String (enum: ['unread', 'read', 'archived', 'deleted'], default: 'unread'),
  
  // Delivery Channels
  channels: [String] (enum: ['in_app', 'email', 'sms', 'push'], default: ['in_app']),
  
  // Tracking
  sentAt: Date (default: now),
  readAt: Date,
  expiresAt: Date,
  actionUrl: String,
  
  // Metadata
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
- userId: 1
- status: 1
- createdAt: -1
- type: 1
```

---

## 💰 Schemes Collection

```javascript
{
  _id: ObjectId,
  
  // Basic Info
  name: String (required, unique),
  code: String (required, unique),
  description: String (required),
  
  // Category
  category: String (enum: ['financial', 'legal', 'healthcare', 'education', 'employment', 'housing', 'safety'], required),
  
  // Benefits
  benefits: [String] (required),
  
  // Eligibility
  eligibility: {
    gender: [String],
    ageMin: Number,
    ageMax: Number,
    incomeLimit: Number,
    maritalStatus: [String],
    stateSpecific: Boolean,
    states: [String],
    additionalCriteria: String
  },
  
  // Documents Required
  documents: [{
    name: String,
    required: Boolean,
    description: String
  }],
  
  // Application Process
  applicationProcess: {
    mode: String (enum: ['online', 'offline', 'both'], default: 'both'),
    steps: [String],
    website: String,
    timeline: String,
    processingTime: String
  },
  
  // Contact Info
  contactInfo: {
    department: String,
    phone: String,
    email: String,
    address: String,
    website: String
  },
  
  // Status
  isActive: Boolean (default: true),
  
  // Statistics
  viewCount: Number (default: 0),
  applicationCount: Number (default: 0),
  
  // Metadata
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
- code: 1
- category: 1
- name: 'text'
- isActive: 1
```

---

## 📊 Query Examples

### Find User with Emergencies
```javascript
db.users.findOne({ _id: ObjectId("...") })
  .populate('emergencyContacts')
```

### Get Active Emergencies
```javascript
db.emergencies.find({
  status: 'active',
  createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
}).sort({ createdAt: -1 })
```

### Search Schemes by Category
```javascript
db.schemes.find({
  category: 'financial',
  isActive: true,
  'eligibility.gender': 'female'
})
```

### Get User's Recent Reports
```javascript
db.reports.find({
  userId: ObjectId("..."),
  status: 'submitted'
}).sort({ createdAt: -1 }).limit(10)
```

### Find Notifications by User
```javascript
db.notifications.find({
  userId: ObjectId("..."),
  status: 'unread'
}).sort({ createdAt: -1 })
```

---

## 🔑 All Indexed Fields (For Performance)

| Collection | Indexed Fields |
|-----------|--------|
| users | email, phone, emergencyContacts.phone, safetyScore |
| emergencies | location (2dsphere), userId, status, createdAt |
| reports | userId, status, type, caseNumber, createdAt |
| legalAids | userId, status, caseType |
| posts | userId, category, createdAt, status |
| notifications | userId, status, createdAt, type |
| schemes | code, category, name (text), isActive |

---

## 🧮 Typical Database Size

Approximate sizes per 10,000 documents:
- Users: ~50-100 MB
- Emergencies: ~20-30 MB
- Reports: ~100-150 MB
- Posts: ~50-80 MB
- Notifications: ~20-30 MB
- Legal Aids: ~30-50 MB
- Schemes: ~5-10 MB

**Total estimated for 10,000 users: ~300-500 MB**

---

## ✨ Key Features

- ✅ Full ACID transactions support
- ✅ Geospatial indexing for emergency location tracking
- ✅ Full-text search on schemes
- ✅ Automatic timestamp management
- ✅ Reference relationships with population
- ✅ Comprehensive validation rules
- ✅ Performance indexes on all common queries

---

## 🚀 Ready to Use!

All collections are fully indexed and optimized. Start querying!

For more info, see [QUICK_START.md](./QUICK_START.md)
