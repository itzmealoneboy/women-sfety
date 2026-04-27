# MongoDB - How to Add New Data & Extend Models

## Overview
This guide shows you how to add new collections, modify existing models, and work with MongoDB in your Sakhi project **without breaking existing functionality**.

---

## 📋 Creating New Collections

### Step 1: Create a Model File

Create a new file in `backend/src/models/` (e.g., `YourModel.js`):

```javascript
const mongoose = require('mongoose');

const yourModelSchema = new mongoose.Schema({
    // Basic fields
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 1000
    },
    
    // Reference to User
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Status tracking
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt
});

// Add indexes for better performance
yourModelSchema.index({ userId: 1, createdAt: -1 });
yourModelSchema.index({ status: 1 });

// Export the model
module.exports = mongoose.model('YourModel', yourModelSchema);
```

### Step 2: Create a Controller File

Create `backend/src/controllers/yourController.js`:

```javascript
const YourModel = require('../models/YourModel');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Create
const create = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        
        const item = await YourModel.create({
            userId: req.user._id,
            title,
            description
        });
        
        res.status(201).json(new ApiResponse(201, item, 'Created successfully'));
    } catch (error) {
        next(error);
    }
};

// Read All
const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        const query = { userId: req.user._id };
        if (status) query.status = status;
        
        const items = await YourModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await YourModel.countDocuments(query);
        
        res.json(new ApiResponse(200, {
            items,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        }, 'Retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// Read One
const getById = async (req, res, next) => {
    try {
        const item = await YourModel.findById(req.params.id);
        
        if (!item) {
            throw new ApiError('Not found', 404);
        }
        
        res.json(new ApiResponse(200, item, 'Retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// Update
const update = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;
        
        const item = await YourModel.findById(req.params.id);
        
        if (!item) {
            throw new ApiError('Not found', 404);
        }
        
        if (title) item.title = title;
        if (description) item.description = description;
        if (status) item.status = status;
        
        await item.save();
        
        res.json(new ApiResponse(200, item, 'Updated successfully'));
    } catch (error) {
        next(error);
    }
};

// Delete
const delete_ = async (req, res, next) => {
    try {
        const item = await YourModel.findByIdAndDelete(req.params.id);
        
        if (!item) {
            throw new ApiError('Not found', 404);
        }
        
        res.json(new ApiResponse(200, {}, 'Deleted successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: delete_
};
```

### Step 3: Create Routes

Create `backend/src/routes/yourRoutes.js`:

```javascript
const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
    create,
    getAll,
    getById,
    update,
    delete: delete_
} = require('../controllers/yourController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.post('/', create);                    // POST /api/your-endpoint
router.get('/', getAll);                     // GET /api/your-endpoint
router.get('/:id', getById);                 // GET /api/your-endpoint/:id
router.put('/:id', update);                  // PUT /api/your-endpoint/:id
router.delete('/:id', delete_);              // DELETE /api/your-endpoint/:id

module.exports = router;
```

### Step 4: Register Routes

Add to `backend/src/index.js`:

```javascript
// Add this with other imports
const yourRoutes = require('./routes/yourRoutes');

// Add this with other route registrations
app.use('/api/your-endpoint', yourRoutes);
```

---

## ✏️ Modifying Existing Models

### Add a New Field

```javascript
// In the model schema, add:
newField: {
    type: String,
    default: null
}
```

### Add a Sub-document

```javascript
// In the model schema, add:
metadata: {
    key1: String,
    key2: Number,
    createdDate: { type: Date, default: Date.now }
}
```

### Add an Array of References

```javascript
// In the model schema, add:
attachments: [{
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    fileName: String,
    uploadedAt: { type: Date, default: Date.now }
}]
```

### Add Indexes for Performance

```javascript
// Always add indexes to frequently queried fields
yourSchema.index({ userId: 1, createdAt: -1 });
yourSchema.index({ status: 1 });
yourSchema.index({ searchTerm: 'text' }); // For full-text search
```

---

## 🔍 Query Examples

### Simple Find
```javascript
const user = await User.findById(userId);
const reports = await Report.find({ userId });
```

### With Filters and Sorting
```javascript
const reports = await Report.find({
    userId,
    status: 'submitted',
    type: 'harassment'
})
.sort({ createdAt: -1 })
.limit(10);
```

### With Population (JOIN)
```javascript
const report = await Report.findById(id)
    .populate('userId', 'name email phone') // Include user details
    .populate('assignedTo', 'name role');
```

### Count Matching Documents
```javascript
const count = await Report.countDocuments({ userId, status: 'active' });
```

### Update Multiple
```javascript
await Report.updateMany(
    { userId, status: 'pending' },
    { status: 'reviewed' }
);
```

### Delete with Condition
```javascript
await Report.deleteMany({ status: 'archived' });
```

### Aggregation Pipeline
```javascript
const stats = await Report.aggregate([
    { $match: { userId } },
    { $group: { 
        _id: '$type',
        count: { $sum: 1 }
    }},
    { $sort: { count: -1 }}
]);
```

---

## 📊 Data Validation

### At Schema Level
```javascript
const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,           // Must provide
        unique: true,             // No duplicates
        lowercase: true,          // Auto-convert to lowercase
        trim: true,               // Remove whitespace
        match: [/^\S+@\S+\.\S+$/, 'Invalid email'] // Regex validation
    },
    age: {
        type: Number,
        min: [18, 'Must be 18+'],
        max: [120, 'Invalid age']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],  // Only these values allowed
        default: 'active'
    },
    tags: [{
        type: String,
        minlength: 2,
        maxlength: 20
    }]
});
```

### Custom Validation
```javascript
userSchema.path('email').validate(async function(email) {
    const count = await mongoose.model('User').countDocuments({ email });
    return !count;
}, 'Email already exists');
```

---

## 🔄 Middleware & Hooks

### Pre-Save Hook (Run Before Save)
```javascript
userSchema.pre('save', async function(next) {
    // Hash password if modified
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
```

### Post-Save Hook (Run After Save)
```javascript
reportSchema.post('save', async function() {
    // Create notification when report is saved
    await createNotification(this.userId, 'Report saved');
});
```

### Virtual Fields (Computed Fields)
```javascript
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});
```

---

## 📈 Performance Tips

### 1. Always Use Indexes
```javascript
schema.index({ userId: 1 });           // Single field
schema.index({ userId: 1, status: -1 }); // Compound
```

### 2. Use Projection to Exclude Fields
```javascript
Report.find({ userId }).select('-witnesses -evidence'); // Exclude these
Report.find({ userId }).select('title description');    // Include only these
```

### 3. Use Lean Queries (Read-Only)
```javascript
const reports = await Report.find({ userId }).lean(); // Faster, read-only
```

### 4. Batch Operations
```javascript
// Instead of multiple saves
for (let item of items) {
    await item.save();
}

// Use bulk operations
const bulk = Report.collection.initializeUnorderedBulkOp();
items.forEach(item => {
    bulk.find({ _id: item._id }).updateOne({ $set: item });
});
await bulk.execute();
```

### 5. Pagination (Always!)
```javascript
const page = req.query.page || 1;
const limit = req.query.limit || 20;
const skip = (page - 1) * limit;

const results = await Report.find(query)
    .limit(limit)
    .skip(skip);
```

---

## 🧪 Testing MongoDB Operations

```javascript
// Test create
const user = await User.create({
    name: 'Test',
    email: 'test@example.com',
    phone: '1234567890',
    password: 'test123'
});

// Test read
const foundUser = await User.findById(user._id);

// Test update
foundUser.name = 'Updated Name';
await foundUser.save();

// Test delete
await User.deleteOne({ _id: user._id });
```

---

## ✅ Checklist for New Models

- [ ] Created model file with schema
- [ ] Added validation rules
- [ ] Created indexes for performance
- [ ] Created controller with CRUD operations
- [ ] Created routes file
- [ ] Registered routes in `src/index.js`
- [ ] Tested create operation
- [ ] Tested read operation
- [ ] Tested update operation
- [ ] Tested delete operation
- [ ] Added error handling
- [ ] No breaking changes to existing code

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't Query Without Indexes
```javascript
// BAD - Will scan entire collection
Report.find({ customField: value });

// GOOD - Add index first
reportSchema.index({ customField: 1 });
```

### ❌ Don't Store Sensitive Data in Plain Text
```javascript
// BAD
password: 'plaintext123'

// GOOD
password: 'hashedvalue...'  // Hash before saving
```

### ❌ Don't Forget Pagination
```javascript
// BAD - Returns ALL documents (memory leak!)
const all = await Report.find({});

// GOOD - With pagination
const reports = await Report.find({}).limit(10).skip(0);
```

### ❌ Don't Modify Without Verification
```javascript
// GOOD - Always check if document exists
const doc = await Model.findById(id);
if (!doc) throw new Error('Not found');
doc.field = newValue;
await doc.save();
```

---

## 🆘 Need Help?

See detailed documentation:
- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - Full setup guide
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

**Keep existing code and functionality intact while extending MongoDB! 🎉**
