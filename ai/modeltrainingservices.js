import * as tf from '@tensorflow/tfjs';

class ModelTrainingService {
  constructor() {
    this.models = {
      threatDetection: null,
      faceRecognition: null,
      crimePrediction: null,
      voiceClone: null
    };
    this.trainingStatus = {};
    this.accuracyMetrics = {};
  }

  /**
   * Initialize models
   */
  async initializeModels() {
    try {
      // Load pre-trained models if available
      await this.loadSavedModels();
      
      // Initialize threat detection model
      if (!this.models.threatDetection) {
        this.models.threatDetection = await this.createThreatDetectionModel();
      }

      // Initialize crime prediction model
      if (!this.models.crimePrediction) {
        this.models.crimePrediction = await this.createCrimePredictionModel();
      }

      return { success: true };
    } catch (error) {
      console.error('Error initializing models:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create threat detection model
   */
  async createThreatDetectionModel() {
    const model = tf.sequential();

    // Input layer
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [10] // 10 input features
    }));

    // Hidden layers
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.2 }));

    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    // Output layer (binary classification: threat/no threat)
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    // Compile model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  /**
   * Create crime prediction model
   */
  async createCrimePredictionModel() {
    const model = tf.sequential();

    // Input layer (time, location, historical data)
    model.add(tf.layers.dense({
      units: 128,
      activation: 'relu',
      inputShape: [15]
    }));

    // LSTM layer for temporal patterns
    model.add(tf.layers.reshape({ targetShape: [1, 128] }));
    model.add(tf.layers.lstm({
      units: 64,
      returnSequences: false
    }));

    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));

    model.add(tf.layers.dropout({ rate: 0.3 }));

    // Output layer (risk score 0-1)
    model.add(tf.layers.dense({
      units: 1,
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    return model;
  }

  /**
   * Train threat detection model
   */
  async trainThreatDetection(trainingData, labels, options = {}) {
    try {
      const {
        epochs = 50,
        batchSize = 32,
        validationSplit = 0.2,
        callbacks = {}
      } = options;

      this.trainingStatus.threatDetection = {
        status: 'training',
        progress: 0,
        epochs: 0,
        loss: [],
        accuracy: []
      };

      // Convert data to tensors
      const xs = tf.tensor2d(trainingData);
      const ys = tf.tensor2d(labels, [labels.length, 1]);

      // Train model
      const history = await this.models.threatDetection.fit(xs, ys, {
        epochs,
        batchSize,
        validationSplit,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            this.trainingStatus.threatDetection.progress = (epoch + 1) / epochs * 100;
            this.trainingStatus.threatDetection.epochs = epoch + 1;
            this.trainingStatus.threatDetection.loss.push(logs.loss);
            this.trainingStatus.threatDetection.accuracy.push(logs.acc);

            if (callbacks.onEpochEnd) {
              callbacks.onEpochEnd(epoch, logs);
            }
          },
          onTrainEnd: () => {
            this.trainingStatus.threatDetection.status = 'completed';
            this.accuracyMetrics.threatDetection = {
              finalLoss: history.history.loss[history.history.loss.length - 1],
              finalAccuracy: history.history.acc[history.history.acc.length - 1]
            };

            if (callbacks.onTrainEnd) {
              callbacks.onTrainEnd();
            }
          }
        }
      });

      // Cleanup tensors
      xs.dispose();
      ys.dispose();

      return {
        success: true,
        history: history.history,
        metrics: this.accuracyMetrics.threatDetection
      };
    } catch (error) {
      console.error('Error training threat detection model:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Predict threat using trained model
   */
  async predictThreat(features) {
    try {
      if (!this.models.threatDetection) {
        throw new Error('Model not trained');
      }

      const input = tf.tensor2d([features]);
      const prediction = this.models.threatDetection.predict(input);
      const result = await prediction.data();

      // Cleanup
      input.dispose();
      prediction.dispose();

      return {
        success: true,
        threatProbability: result[0],
        isThreat: result[0] > 0.5,
        confidence: result[0] > 0.5 ? result[0] : 1 - result[0]
      };
    } catch (error) {
      console.error('Error predicting threat:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Train crime prediction model
   */
  async trainCrimePrediction(crimeData, options = {}) {
    try {
      const {
        epochs = 100,
        batchSize = 32,
        validationSplit = 0.2
      } = options;

      this.trainingStatus.crimePrediction = {
        status: 'training',
        progress: 0,
        epochs: 0,
        loss: [],
        mae: []
      };

      // Prepare training data
      const { features, labels } = this.prepareCrimeData(crimeData);

      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels, [labels.length, 1]);

      const history = await this.models.crimePrediction.fit(xs, ys, {
        epochs,
        batchSize,
        validationSplit,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            this.trainingStatus.crimePrediction.progress = (epoch + 1) / epochs * 100;
            this.trainingStatus.crimePrediction.epochs = epoch + 1;
            this.trainingStatus.crimePrediction.loss.push(logs.loss);
            this.trainingStatus.crimePrediction.mae.push(logs.mae);
          },
          onTrainEnd: () => {
            this.trainingStatus.crimePrediction.status = 'completed';
          }
        }
      });

      xs.dispose();
      ys.dispose();

      return {
        success: true,
        history: history.history
      };
    } catch (error) {
      console.error('Error training crime prediction model:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Prepare crime data for training
   */
  prepareCrimeData(crimeData) {
    const features = [];
    const labels = [];

    crimeData.forEach(incident => {
      // Extract features
      const feature = [
        this.encodeHour(incident.time), // Hour of day
        this.encodeDay(incident.time),  // Day of week
        incident.location.lat,
        incident.location.lng,
        this.encodeCrimeType(incident.type),
        incident.severity,
        incident.distance,
        ...this.encodePreviousCrimes(incident.previousIncidents)
      ];

      features.push(feature);
      labels.push([incident.riskLevel / 100]); // Normalize risk level
    });

    return { features, labels };
  }

  /**
   * Encode hour of day
   */
  encodeHour(timestamp) {
    const hour = new Date(timestamp).getHours();
    return hour / 24; // Normalize to 0-1
  }

  /**
   * Encode day of week
   */
  encodeDay(timestamp) {
    const day = new Date(timestamp).getDay();
    return day / 7; // Normalize to 0-1
  }

  /**
   * Encode crime type
   */
  encodeCrimeType(type) {
    const types = {
      'theft': 0.2,
      'harassment': 0.4,
      'assault': 0.6,
      'robbery': 0.5,
      'murder': 1.0,
      'cyber': 0.3,
      'fraud': 0.25
    };
    return types[type] || 0.1;
  }

  /**
   * Encode previous incidents
   */
  encodePreviousCrimes(previous, maxCount = 5) {
    const encoded = new Array(maxCount).fill(0);
    if (previous && previous.length > 0) {
      previous.slice(0, maxCount).forEach((incident, i) => {
        encoded[i] = incident.severity / 100;
      });
    }
    return encoded;
  }

  /**
   * Predict crime risk
   */
  async predictCrimeRisk(features) {
    try {
      if (!this.models.crimePrediction) {
        throw new Error('Crime prediction model not trained');
      }

      const input = tf.tensor2d([features]);
      const prediction = this.models.crimePrediction.predict(input);
      const risk = await prediction.data();

      input.dispose();
      prediction.dispose();

      return {
        success: true,
        riskLevel: risk[0] * 100,
        confidence: this.calculateConfidence(risk[0])
      };
    } catch (error) {
      console.error('Error predicting crime risk:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate confidence score
   */
  calculateConfidence(prediction) {
    // Higher confidence for predictions near 0 or 1
    const distance = Math.abs(prediction - 0.5);
    return 0.5 + distance;
  }

  /**
   * Save trained models
   */
  async saveModels() {
    try {
      const savedModels = {};

      for (const [name, model] of Object.entries(this.models)) {
        if (model) {
          const saveResult = await model.save(`indexeddb://sakhi-model-${name}`);
          savedModels[name] = saveResult;
        }
      }

      return { success: true, savedModels };
    } catch (error) {
      console.error('Error saving models:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load saved models
   */
  async loadSavedModels() {
    try {
      for (const name of Object.keys(this.models)) {
        try {
          const model = await tf.loadLayersModel(`indexeddb://sakhi-model-${name}`);
          this.models[name] = model;
          console.log(`Loaded model: ${name}`);
        } catch (e) {
          console.log(`No saved model found for: ${name}`);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error loading models:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get model status
   */
  getModelStatus() {
    const status = {};

    for (const [name, model] of Object.entries(this.models)) {
      status[name] = {
        initialized: !!model,
        trained: this.trainingStatus[name]?.status === 'completed',
        accuracy: this.accuracyMetrics[name]?.finalAccuracy || null,
        lastTraining: this.trainingStatus[name]?.lastTraining || null
      };
    }

    return status;
  }

  /**
   * Fine-tune model with new data
   */
  async fineTuneModel(modelName, newData, newLabels, options = {}) {
    try {
      if (!this.models[modelName]) {
        throw new Error(`Model ${modelName} not found`);
      }

      const {
        epochs = 10,
        learningRate = 0.0001
      } = options;

      // Freeze most layers
      const model = this.models[modelName];
      
      // Unfreeze last few layers for fine-tuning
      const layers = model.layers;
      const trainableLayers = Math.floor(layers.length * 0.3); // Last 30% layers

      layers.forEach((layer, index) => {
        layer.trainable = index >= layers.length - trainableLayers;
      });

      // Recompile with lower learning rate
      model.compile({
        optimizer: tf.train.adam(learningRate),
        loss: model.loss,
        metrics: model.metrics
      });

      // Train with new data
      const xs = tf.tensor2d(newData);
      const ys = tf.tensor2d(newLabels, [newLabels.length, 1]);

      const history = await model.fit(xs, ys, {
        epochs,
        batchSize: 16,
        validationSplit: 0.1
      });

      xs.dispose();
      ys.dispose();

      return {
        success: true,
        history: history.history
      };
    } catch (error) {
      console.error('Error fine-tuning model:', error);
      return { success: false, error: error.message };
    }
  }
}

export const modelTrainingService = new ModelTrainingService();
