const axios = require('axios');
const logger = require('../utils/logger');
const { setCache, getCache } = require('../config/redis');

class AIService {
    constructor() {
        this.apiKey = process.env.AI_API_KEY;
        this.apiUrl = process.env.AI_API_URL;
    }

    async getSafetyRecommendations(context) {
        try {
            const cacheKey = `ai:safety:${JSON.stringify(context)}`;
            const cached = await getCache(cacheKey);

            if (cached) {
                return cached;
            }

            let recommendations = [];

            if (this.apiKey) {
                const response = await axios.post(
                    `${this.apiUrl}/v1/chat/completions`,
                    {
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "You are a women's safety expert. Provide practical, actionable safety recommendations."
                            },
                            {
                                role: "user",
                                content: `Provide 5 safety recommendations for a woman in ${context.location || 'general'} area at ${context.timeOfDay || 'any time'}. Consider: ${context.additionalContext || 'general safety'}`
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                recommendations = response.data.choices[0].message.content
                    .split('\n')
                    .filter(line => line.trim() && (line.match(/^\d+\./) || line.match(/^\-/)))
                    .map(line => line.replace(/^\d+\.\s*|^-\s*/, '').trim());
            } else {
                recommendations = this.getFallbackRecommendations(context);
            }

            await setCache(cacheKey, recommendations, 3600); // Cache for 1 hour
            return recommendations;
        } catch (error) {
            logger.error('AI Service error:', error);
            return this.getFallbackRecommendations(context);
        }
    }

    async analyzeSentiment(text) {
        try {
            const cacheKey = `ai:sentiment:${Buffer.from(text).toString('base64').substring(0, 100)}`;
            const cached = await getCache(cacheKey);

            if (cached) {
                return cached;
            }

            let sentiment = { score: 0, label: 'neutral', confidence: 0 };

            if (this.apiKey) {
                const response = await axios.post(
                    `${this.apiUrl}/v1/chat/completions`,
                    {
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: "Analyze the sentiment of the following text. Return JSON with keys: sentiment (positive/negative/neutral), confidence (0-1), and key concerns."
                            },
                            {
                                role: "user",
                                content: text
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 200
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                try {
                    sentiment = JSON.parse(response.data.choices[0].message.content);
                } catch {
                    sentiment = { sentiment: 'neutral', confidence: 0.5, keyConcerns: [] };
                }
            } else {
                sentiment = this.getFallbackSentiment(text);
            }

            await setCache(cacheKey, sentiment, 1800); // Cache for 30 minutes
            return sentiment;
        } catch (error) {
            logger.error('Sentiment analysis error:', error);
            return { sentiment: 'neutral', confidence: 0.5, keyConcerns: [] };
        }
    }

    async detectEmergencyKeywords(text) {
        const emergencyKeywords = {
            high: ['attack', 'assault', 'rape', 'kidnap', 'hostage', 'weapon', 'bleeding', 'unconscious'],
            medium: ['harass', 'follow', 'stalk', 'threat', 'danger', 'scared', 'help', 'emergency'],
            low: ['uncomfortable', 'uneasy', 'nervous', 'worried', 'concerned']
        };

        const lowerText = text.toLowerCase();
        let detectedLevel = 'low';
        let detectedKeywords = [];

        for (const [level, keywords] of Object.entries(emergencyKeywords)) {
            for (const keyword of keywords) {
                if (lowerText.includes(keyword)) {
                    detectedKeywords.push(keyword);
                    if (level === 'high') detectedLevel = 'high';
                    else if (level === 'medium' && detectedLevel !== 'high') detectedLevel = 'medium';
                }
            }
        }

        return {
            level: detectedLevel,
            keywords: detectedKeywords,
            requiresImmediateAction: detectedLevel === 'high'
        };
    }

    getFallbackRecommendations(context) {
        const recommendations = {
            general: [
                "Always stay aware of your surroundings",
                "Keep your phone charged and accessible",
                "Share your location with trusted contacts",
                "Learn basic self-defense techniques",
                "Trust your instincts - if something feels wrong, it probably is"
            ],
            night: [
                "Avoid walking alone in isolated areas",
                "Use well-lit and busy routes",
                "Keep emergency contacts on speed dial",
                "Consider using trusted ride-sharing services",
                "Let someone know your expected arrival time"
            ],
            public_transport: [
                "Sit near the driver or in busy areas",
                "Keep your belongings secure",
                "Stay awake and alert",
                "Have your phone ready for emergencies",
                "Know the route and stops in advance"
            ]
        };

        if (context.timeOfDay === 'night') {
            return recommendations.night;
        } else if (context.location === 'public_transport') {
            return recommendations.public_transport;
        }
        return recommendations.general;
    }

    getFallbackSentiment(text) {
        const negativeWords = ['scared', 'afraid', 'worried', 'unsafe', 'threat', 'danger', 'harass'];
        const positiveWords = ['safe', 'secure', 'protected', 'helpful', 'support'];

        let score = 0;
        const lowerText = text.toLowerCase();

        negativeWords.forEach(word => {
            if (lowerText.includes(word)) score -= 0.2;
        });

        positiveWords.forEach(word => {
            if (lowerText.includes(word)) score += 0.2;
        });

        score = Math.max(-1, Math.min(1, score));

        let label = 'neutral';
        if (score < -0.3) label = 'negative';
        else if (score > 0.3) label = 'positive';

        return {
            sentiment: label,
            confidence: Math.abs(score),
            keyConcerns: negativeWords.filter(word => lowerText.includes(word))
        };
    }
}

module.exports = new AIService();