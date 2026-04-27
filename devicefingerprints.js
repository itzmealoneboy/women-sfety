export const generateDeviceFingerprint = async () => {
  const components = [];

  // Browser information
  components.push(navigator.userAgent);
  components.push(navigator.language);
  components.push(navigator.platform);
  components.push(navigator.vendor || 'unknown');

  // Screen information
  components.push(screen.colorDepth);
  components.push(screen.width + 'x' + screen.height);
  components.push(screen.availWidth + 'x' + screen.availHeight);
  components.push(screen.pixelDepth);

  // Timezone
  components.push(new Date().getTimezoneOffset());

  // Hardware concurrency
  components.push(navigator.hardwareConcurrency || 'unknown');
  components.push(navigator.deviceMemory || 'unknown');

  // Available features
  components.push(!!navigator.bluetooth);
  components.push(!!navigator.credentials);
  components.push(!!window.indexedDB);
  components.push(!!window.localStorage);
  components.push(!!window.sessionStorage);

  // Touch support
  components.push('ontouchstart' in window);
  components.push(navigator.maxTouchPoints || 0);

  // WebGL renderer (if available)
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch (e) {
    components.push('webgl_error');
  }

  // Fonts (simplified)
  components.push(document.fonts?.status || 'unknown');

  // Audio fingerprint (simplified)
  try {
    const audioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
    compressor.knee.setValueAtTime(40, audioContext.currentTime);
    compressor.ratio.setValueAtTime(12, audioContext.currentTime);
    compressor.attack.setValueAtTime(0, audioContext.currentTime);
    compressor.release.setValueAtTime(0.25, audioContext.currentTime);
    oscillator.connect(compressor);
    compressor.connect(audioContext.destination);
    oscillator.start(0);
    audioContext.startRendering();
    await new Promise(resolve => audioContext.oncomplete = resolve);
    components.push('audio_supported');
  } catch (e) {
    components.push('audio_error');
  }

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Sakhi', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Safety', 4, 30);
    components.push(canvas.toDataURL());
  } catch (e) {
    components.push('canvas_error');
  }

  // Join and hash
  const fingerprintString = components.join('|');
  
  // Hash the string
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenSize: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touchSupport: 'ontouchstart' in window,
    maxTouchPoints: navigator.maxTouchPoints,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigator.deviceMemory,
    connection: navigator.connection ? {
      type: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : null
  };
};
