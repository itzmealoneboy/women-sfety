import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebases';
import { calculateDistance } from '../../utils/geoUtils';

class SafetyScoreService {
  constructor() {
    this.crimeWeights = {
      'theft': 15,
      'harassment': 25,
      'assault': 40,
      'robbery': 35,
      'chain_snatching': 30,
      'stalking': 35,
      'domestic_violence': 45,
      'cyber_crime': 20,
      'fraud': 15,
      'trafficking': 50,
      'acid_attack': 60,
      'murder': 80
    };

    this.safetyFactors = {
      police_station: 15,
      hospital: 12,
      pharmacy: 8,
      atm: 5,
      shelter: 20,
      cctv: 10,
      well_lit: 15,
      women_only: 25,
      public_transport: 8,
      security_guard: 12
    };

    this.timeWeights = {
      '00-06': 0.7, // Late night - highest risk
      '06-12': 1.2, // Morning - safer
      '12-18': 1.1, // Afternoon - safer
      '18-24': 0.8  // Evening - moderate risk
    };
  }

  /**
   * Calculate safety score for a location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Safety score details
   */
  async calculateSafetyScore(lat, lng, options = {}) {
    try {
      const {
        includeHistory = true,
        radius = 2000,
        timeOfDay = new Date().getHours()
      } = options;

      // Fetch nearby crime data
      const crimes = await this.getNearbyCrimes(lat, lng, radius);
      
      // Fetch nearby safety features
      const features = await this.getNearbySafetyFeatures(lat, lng, radius);
      
      // Fetch historical crime trends
      const trends = includeHistory ? await this.getCrimeTrends(lat, lng) : null;

      // Calculate base score
      let baseScore = 100;
      
      // Deduct points for crimes
      const crimeDeduction = this.calculateCrimeDeduction(crimes);
      baseScore -= crimeDeduction;

      // Add points for safety features
      const featureBonus = this.calculateFeatureBonus(features);
      baseScore += featureBonus;

      // Apply time-based weight
      const timeWeight = this.getTimeWeight(timeOfDay);
      baseScore *= timeWeight;

      // Apply historical trend factor
      const trendFactor = trends ? this.calculateTrendFactor(trends) : 1;
      baseScore *= trendFactor;

      // Ensure score is within 0-100
      const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));

      // Determine safety level
      const safetyLevel = this.getSafetyLevel(finalScore);

      return {
        score: finalScore,
        level: safetyLevel,
        factors: {
          crimeDeduction,
          featureBonus,
          timeWeight,
          trendFactor
        },
        details: {
          crimes: crimes.length,
          features: {
            police: features.police?.length || 0,
            hospital: features.hospital?.length || 0,
            pharmacy: features.pharmacy?.length || 0,
            atm: features.atm?.length || 0,
            shelter: features.shelter?.length || 0,
            cctv: features.cctv || 0
          },
          nearbyCrimes: crimes.slice(0, 5),
          recommendations: this.generateRecommendations(finalScore, features, crimes)
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calculating safety score:', error);
      throw error;
    }
  }

  /**
   * Get nearby crimes from database
   */
  async getNearbyCrimes(lat, lng, radius) {
    // In production, query from crime database
    // For demo, return mock data
    const mockCrimes = [
      { type: 'theft', distance: 500, severity: 15, time: '2024-03-18T20:30:00Z' },
      { type: 'harassment', distance: 800, severity: 25, time: '2024-03-17T22:15:00Z' },
      { type: 'robbery', distance: 1200, severity: 35, time: '2024-03-16T23:45:00Z' }
    ];

    return mockCrimes.filter(c => c.distance <= radius);
  }

  /**
   * Get nearby safety features
   */
  async getNearbySafetyFeatures(lat, lng, radius) {
    // Mock data
    return {
      police: Array(Math.floor(Math.random() * 3)).fill({}),
      hospital: Array(Math.floor(Math.random() * 2)).fill({}),
      pharmacy: Array(Math.floor(Math.random() * 4)).fill({}),
      atm: Array(Math.floor(Math.random() * 5)).fill({}),
      shelter: Array(Math.floor(Math.random() * 2)).fill({}),
      cctv: Math.floor(Math.random() * 10) + 5
    };
  }

  /**
   * Get crime trends for location
   */
  async getCrimeTrends(lat, lng) {
    // Mock trend data
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(now - (6 - i) * oneDay).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5)
    }));
  }

  /**
   * Calculate deduction based on nearby crimes
   */
  calculateCrimeDeduction(crimes) {
    let deduction = 0;
    
    crimes.forEach(crime => {
      const weight = this.crimeWeights[crime.type] || 10;
      const distanceFactor = Math.max(0, 1 - (crime.distance / 2000));
      deduction += weight * distanceFactor * 0.5;
    });

    return Math.min(60, deduction);
  }

  /**
   * Calculate bonus from safety features
   */
  calculateFeatureBonus(features) {
    let bonus = 0;

    // Police stations within 1km
    if (features.police?.length > 0) {
      bonus += this.safetyFactors.police_station * Math.min(3, features.police.length);
    }

    // Hospitals within 2km
    if (features.hospital?.length > 0) {
      bonus += this.safetyFactors.hospital * Math.min(2, features.hospital.length);
    }

    // Pharmacies within 1km
    if (features.pharmacy?.length > 0) {
      bonus += this.safetyFactors.pharmacy * Math.min(3, features.pharmacy.length);
    }

    // ATMs within 500m
    if (features.atm?.length > 0) {
      bonus += this.safetyFactors.atm * Math.min(4, features.atm.length);
    }

    // Women shelters
    if (features.shelter?.length > 0) {
      bonus += this.safetyFactors.shelter * features.shelter.length;
    }

    // CCTV cameras
    if (features.cctv > 0) {
      bonus += this.safetyFactors.cctv * Math.min(3, Math.floor(features.cctv / 3));
    }

    return Math.min(40, bonus);
  }

  /**
   * Get time-based weight
   */
  getTimeWeight(hour) {
    if (hour >= 0 && hour < 6) return this.timeWeights['00-06'];
    if (hour >= 6 && hour < 12) return this.timeWeights['06-12'];
    if (hour >= 12 && hour < 18) return this.timeWeights['12-18'];
    return this.timeWeights['18-24'];
  }

  /**
   * Calculate trend factor from historical data
   */
  calculateTrendFactor(trends) {
    if (!trends || trends.length < 3) return 1;

    const recent = trends.slice(-3).reduce((sum, t) => sum + t.count, 0);
    const previous = trends.slice(0, -3).reduce((sum, t) => sum + t.count, 0);

    if (previous === 0) return 1;

    const ratio = recent / previous;
    
    if (ratio > 1.5) return 0.8; // Increasing crime
    if (ratio > 1.2) return 0.9;
    if (ratio < 0.7) return 1.1; // Decreasing crime
    if (ratio < 0.9) return 1.05;
    
    return 1;
  }

  /**
   * Determine safety level based on score
   */
  getSafetyLevel(score) {
    if (score >= 80) return 'very_safe';
    if (score >= 60) return 'safe';
    if (score >= 40) return 'moderate';
    if (score >= 20) return 'risky';
    return 'dangerous';
  }

  /**
   * Generate recommendations based on score
   */
  generateRecommendations(score, features, crimes) {
    const recommendations = [];

    if (score < 40) {
      recommendations.push({
        priority: 'high',
        message: 'Avoid this area, especially at night',
        action: 'Find alternate route'
      });
    }

    if (features.police?.length === 0) {
      recommendations.push({
        priority: 'medium',
        message: 'No police stations nearby',
        action: 'Share location with family'
      });
    }

    if (features.cctv < 5) {
      recommendations.push({
        priority: 'medium',
        message: 'Limited CCTV coverage in this area',
        action: 'Stay alert and avoid isolated spots'
      });
    }

    const recentCrimes = crimes.filter(c => 
      new Date(c.time) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentCrimes.length > 3) {
      recommendations.push({
        priority: 'high',
        message: `${recentCrimes.length} recent crimes reported nearby`,
        action: 'Exercise extreme caution'
      });
    }

    if (score >= 80) {
      recommendations.push({
        priority: 'low',
        message: 'Area appears safe',
        action: 'Stay aware of surroundings'
      });
    }

    return recommendations;
  }

  /**
   * Compare safety scores between locations
   */
  compareLocations(locations) {
    const comparisons = [];
    
    for (const loc of locations) {
      comparisons.push({
        ...loc,
        score: this.calculateSafetyScore(loc.lat, loc.lng)
      });
    }

    return comparisons.sort((a, b) => b.score - a.score);
  }

  /**
   * Get safe routes between two points
   */
  async getSafeRoutes(startLat, startLng, endLat, endLng) {
    // Calculate waypoints along route
    const waypoints = this.generateWaypoints(startLat, startLng, endLat, endLng);
    
    // Score each segment
    const segments = await Promise.all(
      waypoints.map(async (point) => {
        const score = await this.calculateSafetyScore(point.lat, point.lng);
        return {
          ...point,
          score: score.score,
          level: score.level
        };
      })
    );

    // Calculate overall route safety
    const avgScore = segments.reduce((sum, s) => sum + s.score, 0) / segments.length;
    
    // Identify dangerous segments
    const dangerousSegments = segments.filter(s => s.score < 40);

    return {
      averageScore: avgScore,
      level: this.getSafetyLevel(avgScore),
      segments,
      dangerousSegments,
      recommendation: dangerousSegments.length > 0
        ? 'Route contains dangerous areas. Consider alternate route.'
        : 'Route appears safe.'
    };
  }

  /**
   * Generate waypoints along a route
   */
  generateWaypoints(startLat, startLng, endLat, endLng, numPoints = 5) {
    const waypoints = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const fraction = i / numPoints;
      const lat = startLat + (endLat - startLat) * fraction;
      const lng = startLng + (endLng - startLng) * fraction;
      
      waypoints.push({
        lat,
        lng,
        index: i
      });
    }

    return waypoints;
  }

  /**
   * Get safety heatmap data for area
   */
  async getHeatmapData(bounds, resolution = 10) {
    const { north, south, east, west } = bounds;
    const latStep = (north - south) / resolution;
    const lngStep = (east - west) / resolution;

    const heatmap = [];

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const lat = south + i * latStep;
        const lng = west + j * lngStep;
        
        const score = await this.calculateSafetyScore(lat, lng, {
          includeHistory: false,
          radius: 500
        });

        heatmap.push({
          lat,
          lng,
          score: score.score,
          level: score.level
        });
      }
    }

    return heatmap;
  }
}

export const safetyScoreService = new SafetyScoreService();




