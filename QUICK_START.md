# MongoDB Quick Start Guide - Sakhi Women Safety Project

## 🚀 Get Started in 5 Minutes

### Prerequisites Check:
- ✅ MongoDB installed on your system
- ✅ Backend dependencies installed (`npm install` in backend)
- ✅ Environment variables configured (already done!)

---

## Step 1: Start MongoDB

### Windows:
```bash
# Open Command Prompt and run:
mongod
```

### Mac:
```bash
brew services start mongodb-community
```

### Linux:
```bash
sudo systemctl start mongod
```

**Expected Output**: 
```
[initandlisten] Listening on port 27017
```

---

## Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output**:
```
✅ MongoDB Connected: localhost
✅ Server running on port 5000
```

---

## Step 3: Verify Connection

Open a new terminal and run:

```bash
# Using mongosh (MongoDB Shell)
mongosh mongodb://localhost:27017/sakhi_db
```

You should see:
```
sakhi_db>
```

---

## Step 4: Seed Initial Data (Optional)

```bash
node backend/scripts/seedDatabase.js
```

This will add sample government schemes to the database.

---

## 5️⃣ Test the API

### Example: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "TestPassword123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9876543210"
    },
    "token": "eyJhbGc..."
  },
  "message": "Registration successful"
}
```

---

## 📊 Check Database Contents

```bash
# Connect to database
mongosh mongodb://localhost:27017/sakhi_db

# Check collections
show collections

# Count users
db.users.countDocuments()

# List all users
db.users.find().pretty()

# Exit
exit
```

---

## 🔧 Common Commands

### Clear All Data (Development Only):
```bash
mongosh mongodb://localhost:27017/sakhi_db

# Clear specific collection
db.users.deleteMany({})
db.emergencies.deleteMany({})
db.reports.deleteMany({})

# Or clear all
db.dropDatabase()
```

### Check Database Size:
```bash
mongosh mongodb://localhost:27017/sakhi_db
db.stats()
```

### Create Backup:
```bash
# Backup entire database
mongodump --uri="mongodb://localhost:27017/sakhi_db"

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/sakhi_db" dump/
```

---

## ⚡ Key Features Active

✅ **User Authentication** - Passwords encrypted, JWT tokens  
✅ **Emergency Alerts** - Real-time SOS with location tracking  
✅ **Reports** - Incident documentation and tracking  
✅ **Community** - Social posts and discussions  
✅ **Legal Aid** - Case management system  
✅ **Government Schemes** - Searchable benefits database  
✅ **Notifications** - Email, SMS, push notifications  

---

## 📝 Environment Variables Needed

Your `.env` file is already configured with:

```
MONGODB_URI=mongodb://localhost:27017/sakhi_db
JWT_SECRET=your-secret-key
TWILIO_ACCOUNT_SID=your-twilio-id
TWILIO_AUTH_TOKEN=your-twilio-token
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**To customize**, edit `backend/.env`

---

## 🐛 Troubleshooting

### "MongoDB connection refused"
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB
mongod
```

### "Port 27017 already in use"
```bash
# Check what's using port 27017
netstat -ano | findstr 27017

# Or change MongoDB port in connection string:
mongodb://localhost:27018/sakhi_db
```

### "Authentication failed"
```bash
# Check username/password in MONGODB_URI
# Default: no authentication needed for localhost
```

---

## 📚 What's Stored in MongoDB

| Collection | Purpose | Sample Count |
|-----------|---------|--------------|
| users | User accounts & profiles | - |
| emergencies | SOS alerts & incidents | - |
| reports | Detailed incident reports | - |
| legalAids | Legal assistance requests | - |
| posts | Community discussions | - |
| notifications | User alerts & messages | - |
| schemes | Government benefits | 50+ |

---

## ✨ You're All Set!

MongoDB is fully integrated and ready. All your data will be:
- 💾 Permanently stored in MongoDB
- 🔐 Encrypted and secured
- ⚡ Optimized with indexes
- 📈 Scalable for production

**Enjoy building! 🚀**

---

## 📞 Next Steps

1. Test all API endpoints with Postman or Insomnia
2. Review individual model documentation
3. Set up Redis for caching (optional)
4. Configure Firebase for push notifications
5. Deploy to MongoDB Atlas for production

For detailed info, see: `MONGODB_SETUP.md`
