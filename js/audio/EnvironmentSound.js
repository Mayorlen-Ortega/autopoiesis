/**
 * ============================================================================
 * AUTOPOIESIS — Sonido del Entorno / Plano Exterior (EnvironmentSound.js)
 * Fuentes sonoras espaciales 8D con algoritmo HRTF en órbita 360°.
 * Texturas granulares de alta frecuencia, impulsos cristalinos y barridos filtrados.
 * Sus coordenadas (x, y, z) gobiernan las partículas visuales en pantalla.
 * ============================================================================
 */

export class EnvironmentSound {
  get ctx() {
    return this.engine ? this.engine.ctx : null;
  }

  constructor(audioEngine) {
    this.engine = audioEngine;

    this.emitters = [];
    this.isStarted = false;

    // Ruido blanco para síntesis granular
    this.noiseBuffer = null;
  }

  /**
   * Inicializa las fuentes 8D y genera buffers de textura granular.
   */
  start() {
    if (this.isStarted) return;
    const now = this.ctx.currentTime;

    this._generateNoiseBuffer();

    // 4 Emisores 8D espaciales distribuidos en el espacio tridimensional con órbitas más dinámicas
    this.emitters = [
      // Emisor 0: Textura Granular de Alta Frecuencia (Cian bioluminiscente)
      this._createEmitter({
        id: 0,
        type: 'granular',
        initialAngle: 0,
        angularSpeed: 0.45,
        baseRadius: 2.8,
        elevation: 0.6,
        color: '#22d3ee'
      }),

      // Emisor 1: Impulsos Cristalinos (Chimes agudos en 360°)
      this._createEmitter({
        id: 1,
        type: 'crystalline',
        initialAngle: Math.PI * 0.65,
        angularSpeed: -0.42,
        baseRadius: 3.2,
        elevation: -0.7,
        color: '#38bdf8'
      }),

      // Emisor 2: Barrido Filtrado Resonante (Sweeps en órbita elíptica)
      this._createEmitter({
        id: 2,
        type: 'sweep',
        initialAngle: Math.PI * 1.3,
        angularSpeed: 0.36,
        baseRadius: 2.6,
        elevation: 0.9,
        color: '#a5f3fc'
      }),

      // Emisor 3: Resonador de Perturbación Profunda (Órbita de contraste)
      this._createEmitter({
        id: 3,
        type: 'drone_burst',
        initialAngle: Math.PI * 1.85,
        angularSpeed: -0.32,
        baseRadius: 3.5,
        elevation: -0.4,
        color: '#06b6d4'
      })
    ];

    this.isStarted = true;
  }

  /**
   * Crea un emisor individual con PannerNode HRTF, fuente de audio dedicada y bus de control.
   */
  _createEmitter(config) {
    const now = this.ctx.currentTime;

    const panner = this.engine.createHRTFPanner(
      Math.cos(config.initialAngle) * config.baseRadius,
      config.elevation,
      Math.sin(config.initialAngle) * config.baseRadius
    );

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.55, now + 1.2);

    gain.connect(panner);
    panner.connect(this.engine.environmentBus);

    // Sintetizadores continuos según tipo
    let internalNodes = {};

    if (config.type === 'sweep') {
      // Oscilador de barrido continuo con filtro pasa-banda resonante
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(4.5, now);

      const sweepGain = this.ctx.createGain();
      sweepGain.gain.setValueAtTime(0.12, now);

      osc.connect(filter);
      filter.connect(sweepGain);
      sweepGain.connect(gain);
      osc.start(now);

      internalNodes = { osc, filter, sweepGain };
    }

    return {
      ...config,
      panner,
      gain,
      internalNodes,
      x: 0,
      y: 0,
      z: 0,
      currentAngle: config.initialAngle,
      currentRadius: config.baseRadius,
      lastGrainTime: 0,
      lastChimeTime: 0
    };
  }

  /**
   * Actualización determinista en cada frame basada en el tiempo de la obra.
   */
  update(elapsedTime) {
    if (!this.isStarted) return;
    const now = this.ctx.currentTime;

    // Moduladores por Acto
    // Acto I (0 - 15s): Órbitas caóticas, rápidas, radio oscilante (el caos pre-sistema)
    // Acto II (15 - 30s): Confinadas fuera de la frontera (radio exterior r > 3.0)
    // Acto III (30 - 48s): Acoplamiento estructural: perturbaciones que colisionan
    // Acto IV (48 - 60s): Órbitas serenas y amplias
    let speedMult = 1.0;
    let radiusOffset = 0;
    let erraticJitter = 0;

    // Atenuación gradual del entorno exterior a partir del Acto II (15s)
    // para dar lugar a la melodía de organización del organismo
    let envMasterGain = 0.55;
    if (elapsedTime < 15.0) {
      speedMult = 1.6 + Math.sin(elapsedTime * 0.8) * 0.6;
      erraticJitter = Math.sin(elapsedTime * 3.5) * 0.8;
      envMasterGain = 0.55;
    } else if (elapsedTime < 30.0) {
      speedMult = 1.0;
      radiusOffset = 0.5; // Empujadas afuera de la membrana
      // El volumen baja suavemente de 0.55 a 0.14
      envMasterGain = Math.max(0.14, 0.55 - ((elapsedTime - 15.0) / 12.0) * 0.41);
    } else if (elapsedTime < 48.0) {
      speedMult = 1.2;
      radiusOffset = Math.sin(elapsedTime * 1.8) * 0.7;
      envMasterGain = 0.14;
    } else {
      speedMult = 0.75;
      radiusOffset = 1.2;
      envMasterGain = 0.10;
    }

    for (let i = 0; i < this.emitters.length; i++) {
      const em = this.emitters[i];

      // Aplicar volumen atenuado del entorno con rampa inicial suave
      if (em.gain) {
        // En los primeros 3 segundos el entorno emerge desde muy tenue
        const initialFadeIn = Math.min(1.0, elapsedTime / 3.5);
        em.gain.gain.setTargetAtTime(envMasterGain * initialFadeIn, now, 0.15);
      }

      // Actualizar ángulo en 360° (sentido horario y antihorario)
      em.currentAngle += em.angularSpeed * speedMult * 0.016;

      // Radio actual en metros virtuales con mayor modulación de proximidad
      const r = Math.max(1.1, em.baseRadius + radiusOffset + erraticJitter * (i % 2 === 0 ? 1.2 : -1.2));
      em.currentRadius = r;

      // Coordenadas 3D de audio HRTF
      // X = horizontal (izquierda/derecha), Y = elevación (arriba/abajo), Z = profundidad (frente/atrás)
      const x = r * Math.cos(em.currentAngle);
      const elevationWobble = Math.sin(em.currentAngle * 2.5 + i) * 0.8;
      const y = em.elevation + elevationWobble;
      const z = r * Math.sin(em.currentAngle);

      em.x = x;
      em.y = y;
      em.z = z;

      // Actualizar PannerNode sin clics
      const panner = em.panner;
      if (panner.positionX) {
        panner.positionX.setTargetAtTime(x, now, 0.02);
        panner.positionY.setTargetAtTime(y, now, 0.02);
        panner.positionZ.setTargetAtTime(z, now, 0.02);
      } else {
        panner.setPosition(x, y, z);
      }

      // Eventos acústicos deterministas por emisor
      // Granos: densos en Acto I, espaciados y sutiles a partir de Acto II
      const grainInterval = elapsedTime < 15.0 ? 0.09 : 0.38;
      if (em.type === 'granular' && now - em.lastGrainTime > grainInterval) {
        const grainVol = elapsedTime < 15.0 ? 1.0 : 0.35;
        this._triggerGrain(em, now, grainVol);
        em.lastGrainTime = now;
      } else if (em.type === 'crystalline' && now - em.lastChimeTime > 0.85) {
        this._triggerCrystallineChime(em, now);
        em.lastChimeTime = now;
      } else if (em.type === 'sweep' && em.internalNodes.filter && em.internalNodes.sweepGain) {
        if (elapsedTime < 15.0) {
          // Acto I: Barrido wa-wa activo y caótico
          const sweepFreq = 1200 + Math.sin(elapsedTime * 2.2 + i) * 900;
          em.internalNodes.filter.frequency.setTargetAtTime(sweepFreq, now, 0.05);
          em.internalNodes.sweepGain.gain.setTargetAtTime(0.12, now, 0.1);
        } else {
          // Acto II en adelante: El sonido wa-wa se atenúa drásticamente a un suspiro lejano
          const sweepVol = Math.max(0.012, 0.12 - ((elapsedTime - 15.0) / 8.0) * 0.108);
          em.internalNodes.sweepGain.gain.setTargetAtTime(sweepVol, now, 0.2);
          const slowSweep = 700 + Math.sin(elapsedTime * 0.35 + i) * 180;
          em.internalNodes.filter.frequency.setTargetAtTime(slowSweep, now, 0.1);
        }
      }
    }
  }

  /**
   * Genera un micro-grano de ruido filtrado de alta frecuencia (textura 8D).
   */
  _triggerGrain(emitter, time, volumeMultiplier = 1.0) {
    if (!this.noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200 + Math.random() * 2400, time);
    filter.Q.setValueAtTime(7.0, time);

    const gain = this.ctx.createGain();
    const dur = 0.035 + Math.random() * 0.025;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.18 * volumeMultiplier, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(emitter.gain);

    source.start(time, Math.random() * 0.5, dur);
  }

  /**
   * Genera un impulso cristalino en el espacio 8D.
   */
  _triggerCrystallineChime(emitter, time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const chimeFreqs = [2093.00, 2489.02, 2793.83, 3135.96, 3729.31]; // C7, D#7, F7, G7, A#7
    const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    const dur = 0.28;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.15, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.00001, time + dur);

    osc.connect(gain);
    gain.connect(emitter.gain);

    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  /**
   * Genera buffer de ruido blanco para síntesis granular sin librerías externas.
   */
  _generateNoiseBuffer() {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 1.0;
    this.noiseBuffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  stop() {
    if (!this.isStarted) return;
    const now = this.ctx.currentTime;
    this.emitters.forEach(em => {
      if (em.gain) {
        em.gain.gain.cancelScheduledValues(now);
        em.gain.gain.linearRampToValueAtTime(0, now + 0.2);
      }
    });
  }
}
