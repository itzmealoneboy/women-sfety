// MongoDB Seeding Script
// Use this to populate the database with initial data

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('../src/models/User');
const Scheme = require('../src/models/Scheme');

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Scheme.deleteMany({});

        // Seed government schemes
        const schemes = [
            {
                name: 'Bhamashah Scheme',
                code: 'BHAMASHAH',
                description: 'Government scheme providing financial assistance to women',
                category: 'financial',
                benefits: ['Financial Assistance', 'Education Support', 'Healthcare'],
                eligibility: {
                    gender: ['female'],
                    ageMin: 18,
                    stateSpecific: true,
                    states: ['Rajasthan'],
                    additionalCriteria: 'Must be a resident of Rajasthan'
                },
                applicationProcess: {
                    mode: 'both',
                    steps: [
                        'Visit official website or local office',
                        'Fill application form',
                        'Submit required documents',
                        'Wait for verification',
                        'Receive approval and benefits'
                    ],
                    website: 'https://bhamashah.rajasthan.gov.in'
                },
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'One Stop Centre Scheme',
                code: 'ONE_STOP_CENTRE',
                description: 'Support services for women in distress',
                category: 'legal',
                benefits: [
                    'Legal Counseling',
                    'Medical Support',
                    'Police Support',
                    'Shelter',
                    'Counseling Services'
                ],
                eligibility: {
                    gender: ['female'],
                    additionalCriteria: 'Any woman experiencing violence or distress'
                },
                applicationProcess: {
                    mode: 'online',
                    steps: [
                        'Call 1091 (Women Helpline)',
                        'Visit nearest One Stop Centre',
                        'Register complaint/request',
                        'Receive integrated support'
                    ]
                },
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Mahila Police Volunteer Scheme',
                code: 'MAHILA_POLICE_VOLUNTEER',
                description: 'Volunteer opportunity for women in police department',
                category: 'employment',
                benefits: [
                    'Uniform and Equipment',
                    'Training',
                    'Work Experience',
                    'Community Service Opportunity'
                ],
                eligibility: {
                    gender: ['female'],
                    ageMin: 18,
                    ageMax: 35,
                    additionalCriteria: 'Must pass medical and physical fitness test'
                },
                applicationProcess: {
                    mode: 'offline',
                    steps: [
                        'Visit local police station',
                        'Fill application form',
                        'Submit educational certificates',
                        'Medical examination',
                        'Selection and training'
                    ]
                },
                isActive: true,
                createdAt: new Date()
            }
        ];

        console.log('Seeding schemes...');
        await Scheme.insertMany(schemes);
        console.log('✅ Schemes seeded successfully');

        console.log('');
        console.log('========================================');
        console.log('Database Seeding Complete!');
        console.log('========================================');
        console.log(`✅ ${schemes.length} government schemes added`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

// Run seeding
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
