/**
 * ============================================================================
 * AUTOPOIESIS — Motor de Audio Principal (AudioEngine.js)
 * Web Audio API nativo con AudioContext, buses de mezcla espacial,
 * analizadores FFT para reactividad visual y modelo HRTF binaural.
 * ============================================================================
 */

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.systemBus = null;
    this.environmentBus = null;

    // Analizadores de energía espectral (FFT)
    this.systemAnalyser = null;
    this.environmentAnalyser = null;

    this.systemFreqData = null;
    this.envFreqData = null;

    this.isInitialized = false;
    this.startTime = 0;
  }

  /**
   * Inicializa el grafo de Web Audio tras interacción del usuario.
   */
  async init() {
    if (this.isInitialized) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass({
      latencyHint: 'interactive',
      sampleRate: 48000
    });

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    // Configuración del Listener en el centro (0, 0, 0)
    // Mirando hacia el frente en el eje Z negativo (-1)
    const listener = this.ctx.listener;
    const now = this.ctx.currentTime;

    if (listener.positionX) {
      listener.positionX.setValueAtTime(0, now);
      listener.positionY.setValueAtTime(0, now);
      listener.positionZ.setValueAtTime(0, now);
      listener.forwardX.setValueAtTime(0, now);
      listener.forwardY.setValueAtTime(0, now);
      listener.forwardZ.setValueAtTime(-1, now);
      listener.upX.setValueAtTime(0, now);
      listener.upY.setValueAtTime(1, now);
      listener.upZ.setValueAtTime(0, now);
    } else {
      listener.setPosition(0, 0, 0);
      listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    // Master Bus con limitador suave y rampa inicial desde mínimo absoluto
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, now);
    // Entrada gradual orgánica y progresiva desde el silencio (0s -> 7.0s)
    this.masterGain.gain.exponentialRampToValueAtTime(0.20, now + 2.0);
    this.masterGain.gain.exponentialRampToValueAtTime(0.58, now + 5.0);
    this.masterGain.gain.linearRampToValueAtTime(0.92, now + 8.0);

    // Bus del Plano Interior (Sistema / Identidad)
    this.systemBus = this.ctx.createGain();
    this.systemBus.gain.setValueAtTime(0.85, now);

    this.systemAnalyser = this.ctx.createAnalyser();
    this.systemAnalyser.fftSize = 256;
    this.systemAnalyser.smoothingTimeConstant = 0.8;
    this.systemFreqData = new Uint8Array(this.systemAnalyser.frequencyBinCount);

    this.systemBus.connect(this.systemAnalyser);
    this.systemAnalyser.connect(this.masterGain);

    // Bus del Plano Exterior (Entorno / Perturbaciones)
    this.environmentBus = this.ctx.createGain();
    this.environmentBus.gain.setValueAtTime(0.8, now);

    this.environmentAnalyser = this.ctx.createAnalyser();
    this.environmentAnalyser.fftSize = 256;
    this.environmentAnalyser.smoothingTimeConstant = 0.75;
    this.envFreqData = new Uint8Array(this.environmentAnalyser.frequencyBinCount);

    this.environmentBus.connect(this.environmentAnalyser);
    this.environmentAnalyser.connect(this.masterGain);

    // Salida maestra a los altavoces / audífonos
    this.masterGain.connect(this.ctx.destination);

    this.isInitialized = true;
    this.startTime = this.ctx.currentTime;
  }

  /**
   * Crea un PannerNode configurado rigurosamente con HRTF y caída acentuada para 8D extremo.
   */
  createHRTFPanner(initialX = 0, initialY = 0, initialZ = -1) {
    const panner = new PannerNode(this.ctx, {
      panningModel: 'HRTF',
      distanceModel: 'inverse',
      refDistance: 0.8,    // Distancia de referencia reducida para mayor dramatismo de proximidad
      maxDistance: 120,
      rolloffFactor: 1.8,  // Caída más pronunciada que acentúa la localización espacial 360°
      coneInnerAngle: 360,
      coneOuterAngle: 360,
      coneOuterGain: 0,
      positionX: initialX,
      positionY: initialY,
      positionZ: initialZ
    });
    return panner;
  }

  /**
   * Retorna el tiempo transcurrido desde el inicio exacto del audio en segundos.
   */
  getElapsedTime() {
    if (!this.ctx || !this.isInitialized) return 0;
    return Math.max(0, this.ctx.currentTime - this.startTime);
  }

  /**
   * Calcula el nivel RMS / Energía normalizada (0.0 a 1.0) de un bus.
   */
  getEnergy(type = 'system') {
    if (!this.isInitialized) return 0;

    let analyser = type === 'system' ? this.systemAnalyser : this.environmentAnalyser;
    let dataArray = type === 'system' ? this.systemFreqData : this.envFreqData;

    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    const len = dataArray.length;
    for (let i = 0; i < len; i++) {
      sum += dataArray[i];
    }
    const avg = sum / (len * 255);
    return avg;
  }

  /**
   * Ejecuta el fade-out maestro determinista progresivo hacia silencio absoluto.
   */
  fadeMaster(startFadeTime, targetEndTime) {
    if (!this.isInitialized || !this.masterGain || !this.ctx) return;
    const currentGain = this.masterGain.gain.value;
    this.masterGain.gain.cancelScheduledValues(startFadeTime);
    this.masterGain.gain.setValueAtTime(Math.max(0.001, currentGain), startFadeTime);
    // Rampa exponencial suave hacia silencio absoluto en el segundo 60.0
    this.masterGain.gain.exponentialRampToValueAtTime(0.00001, targetEndTime);
    // Corte a cero al momento del objetivo para garantizar silencio total
    this.masterGain.gain.setValueAtTime(0, targetEndTime);
  }

  /**
   * Detiene el motor limpiamente al cumplirse los 60.0 segundos.
   */
  stop() {
    if (!this.isInitialized || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.05);
  }
}
