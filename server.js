// server.js - Simple working version
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage (no database needed)
const users = [
    {
        id: 0,
        name: 'Test User',
        email: 'asd@gmail.com',
        phone: '1234567890',
        gender: 'female',
        password: bcrypt.hashSync('Thulasi@123', 10),
        createdAt: new Date()
    }
];
const emergencies = [];

console.log('✅ Test user initialized: asd@gmail.com / Thulasi@123');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'sakhi-secret-key-2024';

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Sakhi Backend API is running!' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date(), uptime: process.uptime() });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password, gender, aadhaar, pan, fingerprint, faceImages } = req.body;

        // Validation
        if (!name || !email || !password || !phone || !gender) {
            return res.status(400).json({ success: false, message: 'All mandatory fields are required' });
        }

        if (gender.toLowerCase() !== 'female') {
            return res.status(400).json({ success: false, message: 'Registration is restricted to women only' });
        }

        // Check if user exists
        const userExists = users.find(u => u.email === email || u.phone === phone);
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: users.length + 1,
            name,
            email,
            phone,
            gender,
            aadhaar: aadhaar || null,
            pan: pan || null,
            fingerprint: fingerprint || null,
            faceImages: faceImages || [],
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(user);

        // Generate token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            success: true,
            data: { 
                user: { id: user.id, name, email, phone, gender, createdAt: user.createdAt }, 
                token 
            },
            message: 'Registration successful'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, fingerprint, faceImage } = req.body;
        console.log(`🔑 Login attempt for: ${email || 'biometric'}`);

        let user;
        if (email && password) {
            user = users.find(u => u.email === email);
            if (!user) {
                console.log(`❌ User not found: ${email}`);
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                console.log(`❌ Invalid password for: ${email}`);
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } else if (fingerprint) {
            console.log('👆 Fingerprint login attempt');
            user = users.find(u => u.fingerprint === fingerprint);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Fingerprint match failed' });
            }
        } else if (faceImage) {
            console.log('📸 Face login attempt');
            // Mock face verification - in reality would use face-api.js or a cloud service
            // For now, if they provide a face image, we'll match the first user (demo only)
            user = users[0]; 
            if (!user) {
                return res.status(401).json({ success: false, message: 'Face verification failed' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Login credentials required' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

        console.log(`✅ Login successful for: ${user.email}`);
        res.json({
            success: true,
            data: { 
                user: { id: user.id, name: user.name, email: user.email, phone: user.phone, gender: user.gender }, 
                token 
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('🔥 Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get current user endpoint
app.get('/api/auth/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = users.find(u => u.id === decoded.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({
            success: true,
            data: { id: user.id, name: user.name, email: user.email, phone: user.phone, gender: user.gender }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

// SOS endpoint
app.post('/api/emergency/sos', (req, res) => {
    try {
        const { type, latitude, longitude } = req.body;

        const emergency = {
            id: emergencies.length + 1,
            type: type || 'sos',
            location: { latitude, longitude },
            status: 'active',
            timestamp: new Date()
        };

        emergencies.push(emergency);

        res.status(201).json({
            success: true,
            data: { emergencyId: emergency.id, status: 'active' },
            message: 'SOS triggered successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- SAKHI EYE AI MONITORING SIMULATION ---
let facesCaptured = 0;
let todayDetections = 0;
const detailsLog = [];
let recentDetections = [];

// Simulate detection every 3 seconds
setInterval(() => {
    const now = Date.now();
    facesCaptured++;
    
    // Add to recent detections for sliding window (10 seconds)
    recentDetections.push(now);
    
    // Clean up older than 10 seconds
    recentDetections = recentDetections.filter(time => now - time <= 10000);
    
    let isSafetyDetection = false;
    // If 3 or more detections in last 10 seconds
    if (recentDetections.length >= 3) {
        todayDetections++;
        isSafetyDetection = true;
        // Reset the window to avoid counting the same cluster repeatedly
        recentDetections = [];
    }
    
    const event = {
        type: isSafetyDetection ? 'safety_detection' : 'face_captured',
        timestamp: new Date().toISOString(),
        // Real-time dynamic face capture simulation
        imageBase64: `https://i.pravatar.cc/150?u=${facesCaptured}` 
    };
    
    detailsLog.push(event);
    
    // Emit to all connected clients
    io.emit('detectionUpdate', {
        facesCaptured,
        todayDetections,
        lastEvent: event
    });
}, 3000);

io.on('connection', (socket) => {
    console.log('Sakhi Eye Dashboard connected:', socket.id);
    
    // Send initial state
    socket.emit('detectionUpdate', {
        facesCaptured,
        todayDetections,
        lastEvent: detailsLog[detailsLog.length - 1] || null
    });
    
    socket.on('getDetails', () => {
        socket.emit('detailsLog', detailsLog);
    });
    
    socket.on('disconnect', () => {
        console.log('Dashboard disconnected:', socket.id);
    });
});
// ------------------------------------------

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Sakhi Backend Server is running!`);
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    console.log(`📝 API Base: http://localhost:${PORT}/api`);
});