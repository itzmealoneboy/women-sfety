import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

const geminiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: GEMINI_API_KEY
  }
});

export const geminiService = {
  // Generate text
  generateText: async (prompt, options = {}) => {
    try {
      const response = await geminiClient.post('/models/gemini-pro:generateContent', {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1024,
          topP: options.topP || 0.95,
          topK: options.topK || 40
        }
      });

      const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Chat completion
  chat: async (messages, options = {}) => {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      const response = await geminiClient.post('/models/gemini-pro:generateContent', {
        contents: formattedMessages,
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1024,
          topP: options.topP || 0.95,
          topK: options.topK || 40
        }
      });

      const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Analyze sentiment
  analyzeSentiment: async (text) => {
    try {
      const prompt = `Analyze the sentiment of the following text and return a JSON object with sentiment (positive/negative/neutral), confidence score (0-1), and key emotions detected.\n\nText: "${text}"`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.3 });
      
      if (response.success) {
        try {
          const analysis = JSON.parse(response.data);
          return { success: true, data: analysis };
        } catch {
          return { success: true, data: { sentiment: 'neutral', confidence: 0.5, emotions: [] } };
        }
      }
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Summarize text
  summarize: async (text, maxLength = 200) => {
    try {
      const prompt = `Summarize the following text in ${maxLength} words or less:\n\n${text}`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.5 });
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Extract keywords
  extractKeywords: async (text, count = 10) => {
    try {
      const prompt = `Extract the top ${count} keywords from the following text. Return them as a JSON array of strings:\n\n${text}`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.3 });
      
      if (response.success) {
        try {
          const keywords = JSON.parse(response.data);
          return { success: true, data: keywords };
        } catch {
          const keywords = response.data.split(',').map(k => k.trim());
          return { success: true, data: keywords.slice(0, count) };
        }
      }
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Classify text
  classify: async (text, categories) => {
    try {
      const categoriesList = categories.join(', ');
      const prompt = `Classify the following text into one of these categories: ${categoriesList}. Return only the category name.\n\nText: "${text}"`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.3 });
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Generate safety tips
  generateSafetyTips: async (location, situation) => {
    try {
      const prompt = `Generate 5 practical safety tips for a woman in ${location} who is ${situation}. Make them specific, actionable, and prioritize personal safety.`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.7 });
      
      if (response.success) {
        const tips = response.data.split('\n').filter(tip => tip.trim().length > 0);
        return { success: true, data: tips };
      }
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Generate escape plan
  generateEscapePlan: async (currentLocation, threats) => {
    try {
      const prompt = `Create a step-by-step escape plan for a woman at ${currentLocation} facing ${threats}. Include immediate actions, safe routes, and emergency contacts to notify.`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.8 });
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Analyze threat level
  analyzeThreatLevel: async (description) => {
    try {
      const prompt = `Analyze this situation and return a JSON object with threat level (low/medium/high/critical), confidence score (0-1), and recommended actions:\n\n"${description}"`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.4 });
      
      if (response.success) {
        try {
          const analysis = JSON.parse(response.data);
          return { success: true, data: analysis };
        } catch {
          return { success: true, data: { threatLevel: 'unknown', confidence: 0.5, actions: [] } };
        }
      }
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Generate fake call script
  generateFakeCallScript: async (scenario, caller, language = 'en') => {
    try {
      const prompt = `Generate a realistic fake call script in ${language} for a ${scenario} scenario. The caller is supposed to be a ${caller}. The script should help the woman escape an uncomfortable situation. Include natural conversation flow.`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.9 });
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Translate text
  translate: async (text, targetLanguage) => {
    try {
      const prompt = `Translate the following text to ${targetLanguage}. Return only the translated text:\n\n${text}`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.3 });
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Answer legal question
  answerLegalQuestion: async (question, context) => {
    try {
      const prompt = `As a legal assistant specializing in women's rights in India, answer the following question: "${question}"\n\nContext: ${context}\n\nProvide accurate legal information and actionable advice.`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.5 });
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Generate incident report
  generateIncidentReport: async (details) => {
    try {
      const prompt = `Generate a formal incident report based on these details. Include date, time, location, description, witnesses, and recommended actions:\n\n${JSON.stringify(details, null, 2)}`;
      
      const response = await geminiService.generateText(prompt, { temperature: 0.4 });
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
