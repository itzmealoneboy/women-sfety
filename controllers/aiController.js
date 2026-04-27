const axios = require('axios');
const { ApiResponse, ApiError } = require('../utils/apiResponse');
const { setCache, getCache } = require('../config/redis');
const logger = require('../utils/logger');

// @desc    Get safety tips from AI
// @route   POST /api/ai/safety-tips
// @access  Private
const getSafetyTips = async (req, res, next) => {
    try {
        const { situation, location } = req.body;

        const cacheKey = `safety_tips:${situation}:${location}`;
        const cached = await getCache(cacheKey);

        if (cached) {
            return res.json(new ApiResponse(200, cached, 'Safety tips retrieved from cache'));
        }

        // If using OpenAI or similar AI service
        let tips = [];

        if (process.env.AI_API_KEY) {
            try {
                const response = await axios.post(
                    `${process.env.AI_API_URL}/v1/completions`,
                    {
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "You are a women's safety expert. Provide practical safety tips."
                            },
                            {
                                role: "user",
                                content: `Provide 5 safety tips for ${situation} in ${location || 'any location'}`
                            }
                        ]
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                tips = response.data.choices[0].message.content.split('\n').filter(tip => tip.trim());
            } catch (aiError) {
                logger.error('AI service error:', aiError);
                // Fallback to predefined tips
                tips = getPredefinedSafetyTips(situation);
            }
        } else {
            // Use predefined tips if no AI service
            tips = getPredefinedSafetyTips(situation);
        }

        await setCache(cacheKey, tips, 86400); // Cache for 24 hours

        res.json(new ApiResponse(200, tips, 'Safety tips generated'));
    } catch (error) {
        next(error);
    }
};

// @desc    Analyze text for safety concerns
// @route   POST /api/ai/analyze-text
// @access  Private
const analyzeText = async (req, res, next) => {
    try {
        const { text } = req.body;

        // Simple keyword-based analysis (can be enhanced with ML)
        const threatKeywords = ['hit', 'abuse', 'harass', 'threat', 'danger', 'scared', 'fear', 'attack'];
        const urgentKeywords = ['help', 'emergency', 'sos', 'danger', 'immediate'];

        const lowerText = text.toLowerCase();

        const analysis = {
            threatLevel: 'low',
            containsThreats: false,
            detectedKeywords: [],
            suggestedAction: null
        };

        // Check for threats
        for (const keyword of threatKeywords) {
            if (lowerText.includes(keyword)) {
                analysis.containsThreats = true;
                analysis.detectedKeywords.push(keyword);
            }
        }

        // Check for urgency
        for (const keyword of urgentKeywords) {
            if (lowerText.includes(keyword)) {
                analysis.threatLevel = 'high';
                analysis.suggestedAction = 'immediate_support';
                break;
            }
        }

        // Determine threat level
        if (analysis.containsThreats) {
            if (analysis.detectedKeywords.length >= 3) {
                analysis.threatLevel = 'high';
                analysis.suggestedAction = 'counseling_recommended';
            } else if (analysis.detectedKeywords.length >= 1) {
                analysis.threatLevel = 'medium';
                analysis.suggestedAction = 'review_safety_tips';
            }
        }

        res.json(new ApiResponse(200, analysis, 'Text analyzed successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get AI-powered safety recommendations
// @route   POST /api/ai/recommendations
// @access  Private
const getSafetyRecommendations = async (req, res, next) => {
    try {
        const { userProfile, location, timeOfDay } = req.body;

        const recommendations = {
            general: [],
            location_specific: [],
            time_specific: []
        };

        // General safety recommendations
        recommendations.general = [
            "Share your live location with trusted contacts",
            "Keep emergency contacts on speed dial",
            "Carry a personal safety alarm",
            "Learn basic self-defense techniques",
            "Always inform someone about your whereabouts"
        ];

        // Location-based recommendations
        if (location) {
            recommendations.location_specific = [
                `Be aware of safe zones near ${location}`,
                `Note the nearest police station location`,
                `Avoid isolated areas in ${location} after dark`
            ];
        }

        // Time-based recommendations
        if (timeOfDay === 'night') {
            recommendations.time_specific = [
                "Avoid walking alone late at night",
                "Use well-lit and populated routes",
                "Keep your phone charged and accessible",
                "Consider using trusted transportation services"
            ];
        } else if (timeOfDay === 'late_night') {
            recommendations.time_specific = [
                "Avoid traveling alone if possible",
                "Share your trip details with family",
                "Stay aware of your surroundings",
                "Trust your instincts - if something feels wrong, it probably is"
            ];
        }

        res.json(new ApiResponse(200, recommendations, 'Recommendations generated'));
    } catch (error) {
        next(error);
    }
};

// Helper function for predefined safety tips
const getPredefinedSafetyTips = (situation) => {
    const tips = {
        'walking_alone': [
            "Stay alert and aware of your surroundings",
            "Avoid using headphones or being distracted by your phone",
            "Walk confidently and with purpose",
            "Stick to well-lit and populated areas",
            "Share your route with a trusted contact"
        ],
        'public_transport': [
            "Sit near the driver or in busy areas",
            "Keep your belongings secure and visible",
            "Know your route and stops in advance",
            "Have your phone ready for emergencies",
            "Trust your instincts - move if you feel uncomfortable"
        ],
        'ride_sharing': [
            "Verify the vehicle and driver before entering",
            "Share your trip details with someone",
            "Sit in the back seat",
            "Keep the windows open if possible",
            "Have the emergency button ready on your phone"
        ],
        'default': [
            "Always trust your intuition",
            "Keep emergency numbers saved and accessible",
            "Carry a personal safety device",
            "Learn basic self-defense moves",
            "Stay connected with your trusted circle"
        ]
    };

    return tips[situation] || tips.default;
};

module.exports = {
    getSafetyTips,
    analyzeText,
    getSafetyRecommendations
};