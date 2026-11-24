/**
 * ============================================================================
 * AUTOPOIESIS — Sonido del Sistema / Plano Interior (SystemSound.js)
 * Clausura operacional e identidad viva.
 * Anclado en el centro (0, 0, -0.5). Pulso sub-grave orgánico (latido cardíaco)
 * y pad etéreo generativo suspendido en Fmaj7(add9) / Am9 con filtro resonante.
 * ============================================================================
 */

export class SystemSound {
  get ctx() {
    return this.engine ? this.engine.ctx : null;
  }

  constructor(audioEngine) {
    this.engine = audioEngine;

    this.panner = null;
    this.outputGain = null;

    // Pad Armónico
    this.padFilter = null;
    this.padGain = null;
    this.padOscillators = [];
    this.padChords = {
      fMaj7add9: [87.31, 130.81, 164.81, 196.00, 220.00], // F2, C3, E3, G3, A3
      am9: [110.00, 164.81, 196.00, 246.94, 261.63]       // A2, E3, G3, B3, C4
    };

    // Planificador de Latidos determinista (sin setTimeout/setInterval)
    this.nextHeartbeatTime = 0;
    this.heartbeatInterval = 1.12; // ~53.5 BPM (latido orgánico profundo)
    this.heartbeatGain = null;

    // Bus de Reorganización (Acoplamiento Estructural)
    this.reorgGain = null;

    // Melodía de Organización (Notas largas que representan al organismo tomando y manteniendo estructura)
    this.melodyGain = null;
    this.melodyNotes = [
      // Acto II: Autoproducción y Frontera (15s - 30s) — Notas largas y cálidas
      { startTime: 15.6, freq: 220.00, duration: 4.8, gain: 0.28 }, // A3
      { startTime: 20.4, freq: 261.63, duration: 5.0, gain: 0.30 }, // C4
      { startTime: 25.2, freq: 329.63, duration: 5.0, gain: 0.32 }, // E4

      // Acto III: Acoplamiento Estructural (30s - 48s) — Estructura adaptativa sostenida
      { startTime: 30.2, freq: 392.00, duration: 5.4, gain: 0.33 }, // G4
      { startTime: 35.4, freq: 493.88, duration: 5.0, gain: 0.32 }, // B4
      { startTime: 40.2, freq: 440.00, duration: 5.5, gain: 0.34 }, // A4
      { startTime: 45.6, freq: 329.63, duration: 3.8, gain: 0.30 }, // E4

      // Acto IV: Identidad Viva (48s - 56.5s) — Coherencia armónica y plenitud
      { startTime: 48.6, freq: 349.23, duration: 4.0, gain: 0.32 }, // F4
      { startTime: 52.2, freq: 261.63, duration: 4.3, gain: 0.30 }  // C4 (resolución antes del oscurecimiento)
    ];
    this.nextMelodyIndex = 0;

    this.isStarted = false;
  }

  /**
   * Construye el grafo sonoro del Sistema anclado en (0, 0, -0.5).
   */
  start() {
    if (this.isStarted) return;
    const now = this.ctx.currentTime;

    // PannerNode estático central para el Sistema
    this.panner = this.engine.createHRTFPanner(0, 0, -0.5);

    this.outputGain = this.ctx.createGain();
    this.outputGain.gain.setValueAtTime(0.0001, now);
    this.outputGain.gain.linearRampToValueAtTime(0.85, now + 1.5);

    this.outputGain.connect(this.panner);
    this.panner.connect(this.engine.systemBus);

    // ==========================================
    // 1. PAD ARMÓNICO ETÉREO (Filtro paso bajo resonante)
    // ==========================================
    this.padFilter = this.ctx.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.frequency.setValueAtTime(320, now);
    this.padFilter.Q.setValueAtTime(2.8, now);

    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0.0001, now);
    // Entrada gradual entre 0s y 8s (Acto I a II)
    this.padGain.gain.exponentialRampToValueAtTime(0.28, now + 6.0);

    // Osciladores iniciales en Fmaj7(add9)
    const freqs = this.padChords.fMaj7add9;
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Mezcla de formas de onda cálidas y ricas en armónicos
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Micro-desafinación (detune en cents) para textura de coro orgánico vivo
      const detuneValue = (idx - 2) * 5;
      osc.detune.setValueAtTime(detuneValue, now);

      oscGain.gain.setValueAtTime(0.18 / freqs.length, now);

      osc.connect(oscGain);
      oscGain.connect(this.padFilter);
      osc.start(now);

      this.padOscillators.push({ osc, oscGain, baseFreq: freq });
    });

    this.padFilter.connect(this.padGain);
    this.padGain.connect(this.outputGain);

    // Bus de latidos
    this.heartbeatGain = this.ctx.createGain();
    this.heartbeatGain.gain.setValueAtTime(0.7, now);
    this.heartbeatGain.connect(this.outputGain);

    // Bus para respuesta de reorganización estructural
    this.reorgGain = this.ctx.createGain();
    this.reorgGain.gain.setValueAtTime(0.4, now);
    this.reorgGain.connect(this.outputGain);

    // Bus de melodía de organización (tonos largos estructurales)
    this.melodyGain = this.ctx.createGain();
    this.melodyGain.gain.setValueAtTime(1.0, now);
    this.melodyGain.connect(this.outputGain);

    this.nextHeartbeatTime = now + 0.3;
    this.isStarted = true;
  }

  /**
   * Actualización determinista por frame (llamada desde requestAnimationFrame).
   * Planifica eventos acústicos en base a this.ctx.currentTime.
   */
  update(elapsedTime) {
    if (!this.isStarted) return;
    const now = this.ctx.currentTime;

    // 1. Modulación y expansión de frecuencia de corte del filtro (LFO orgánico y crecimiento armónico)
    // Se expande gradualmente a medida que el organismo crece (0.0s -> 50.0s)
    if (this.padFilter) {
      const lfoSpeed = 0.14; // Ciclo lento (~7.1s)
      const growthFactor = Math.min(1.0, elapsedTime / 46.0);
      const baseCutoff = 320 + growthFactor * 960; // Se abre progresivamente hasta casi 1300Hz
      const cutoffVal = baseCutoff + Math.sin(elapsedTime * lfoSpeed * Math.PI * 2) * 240;
      this.padFilter.frequency.setTargetAtTime(Math.max(120, cutoffVal), now, 0.1);
    }

    // 2. Transición armónica según los Actos
    // Acto III (30s): Transición sutil hacia Am9
    if (elapsedTime >= 30.0 && elapsedTime < 48.0 && !this._transitionedToAm9) {
      this._transitionChord(this.padChords.am9, 3.5);
      this._transitionedToAm9 = true;
    } else if (elapsedTime >= 48.0 && !this._transitionedToFmaj7) {
      // Acto IV (48s): Retorno en plenitud a Fmaj7(add9)
      this._transitionChord(this.padChords.fMaj7add9, 4.0);
      this._transitionedToFmaj7 = true;
    }

    // 3. Planificador de Latido Cardíaco (Sub-grave orgánico que gana cuerpo con el crecimiento)
    const heartbeatVolume = elapsedTime < 15.0
      ? 0.2 + (elapsedTime / 15.0) * 0.8
      : 1.0 + Math.min(0.3, ((elapsedTime - 15.0) / 33.0) * 0.3);

    while (this.nextHeartbeatTime < now + 0.2) {
      this._scheduleHeartbeat(this.nextHeartbeatTime, heartbeatVolume);
      this.nextHeartbeatTime += this.heartbeatInterval;
    }

    // 4. Planificador de la Melodía de Organización (Notas largas del organismo)
    while (
      this.nextMelodyIndex < this.melodyNotes.length &&
      elapsedTime >= this.melodyNotes[this.nextMelodyIndex].startTime - 0.05
    ) {
      const note = this.melodyNotes[this.nextMelodyIndex];
      this._synthesizeLongMelodicTone(note, now);
      this.nextMelodyIndex++;
    }

    // 5. Expansión cálida del Pad al organizarse el sistema (a partir de los 15s)
    if (elapsedTime >= 15.0 && this.padGain) {
      const padTarget = Math.min(0.42, 0.28 + ((elapsedTime - 15.0) / 15.0) * 0.14);
      this.padGain.gain.setTargetAtTime(padTarget, now, 0.5);
    }
  }

  /**
   * Genera el doble pulso del latido ("lub-dub") con ondas senoidales puras
   * moduladas en envolvente y caída de tono orgánico (62Hz -> 42Hz).
   */
  _scheduleHeartbeat(time, volumeMultiplier = 1.0) {
    if (time < this.ctx.currentTime - 0.05) return;

    // Pulso 1: Sístole principal ("Lub")
    this._synthesizeHeartPulse(time, 58, 42, 0.75 * volumeMultiplier, 0.18);

    // Pulso 2: Diástole secundaria ("Dub" a los 260ms)
    this._synthesizeHeartPulse(time + 0.26, 52, 40, 0.45 * volumeMultiplier, 0.14);
  }

  _synthesizeHeartPulse(time, startFreq, endFreq, peakGain, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), time + duration);

    // Envolvente de ganancia con ataque suave (0.015s) y caída exponencial
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(peakGain, time + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.heartbeatGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  /**
   * Modifica suavemente las frecuencias base del acorde sin interrumpir osciladores.
   */
  _transitionChord(newChordFreqs, duration = 3.0) {
    const now = this.ctx.currentTime;
    this.padOscillators.forEach((item, index) => {
      const targetFreq = newChordFreqs[index % newChordFreqs.length];
      item.osc.frequency.cancelScheduledValues(now);
      item.osc.frequency.setValueAtTime(item.osc.frequency.value, now);
      item.osc.frequency.exponentialRampToValueAtTime(targetFreq, now + duration);
    });
  }

  /**
   * Sintetiza una nota melódica larga y expresiva que representa al organismo
   * tomando y manteniendo su estructura autopoiética.
   */
  _synthesizeLongMelodicTone(note, now) {
    if (!this.ctx) return;

    // Oscilador principal cálido (seno puro)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(note.freq, now);

    // Oscilador secundario (triángulo suave con sutil detune para cuerpo biológico)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(note.freq, now);
    osc2.detune.setValueAtTime(-4, now); // -4 cents

    // LFO de vibrato orgánico sutil
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(4.0, now); // 4 Hz (respiración viva)
    vibratoGain.gain.setValueAtTime(2.5, now);  // Modulación muy delicada
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibratoGain.connect(osc2.frequency);

    // Filtro pasa-bajo musical para envolver el tono en calidez
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1300, now);
    filter.Q.setValueAtTime(1.8, now);

    // Envolvente de ganancia con ataque suave, largo sostenido y caída expresiva
    const noteGain = this.ctx.createGain();
    const attack = 0.8;
    const release = 1.2;
    const sustainTime = Math.max(0.2, note.duration - attack - release);

    noteGain.gain.setValueAtTime(0.0001, now);
    // Ataque suave que emerge sin clics
    noteGain.gain.linearRampToValueAtTime(note.gain, now + attack);
    // Sostenido prolongado representando la estructura que se mantiene
    noteGain.gain.setValueAtTime(note.gain, now + attack + sustainTime);
    // Caída exponencial suave
    noteGain.gain.exponentialRampToValueAtTime(0.00001, now + note.duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.melodyGain);

    vibrato.start(now);
    osc1.start(now);
    osc2.start(now);

    const stopTime = now + note.duration + 0.15;
    vibrato.stop(stopTime);
    osc1.stop(stopTime);
    osc2.stop(stopTime);
  }

  /**
   * Acoplamiento Estructural:
   * Cuando una perturbación del entorno impacta la membrana, el sistema
   * responde internamente sintetizando un armónico resonante cálido (reorganización).
   */
  triggerInternalReorganization(intensity = 0.5) {
    if (!this.isStarted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Resonancia de campana cálida interior (sin romper la clausura)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Frecuencias armónicas concordantes con Fmaj7 / Am9
    const notes = [261.63, 329.63, 392.00, 440.00, 523.25];
    const chosenNote = notes[Math.floor(Math.random() * notes.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(chosenNote, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(chosenNote, now);
    filter.Q.setValueAtTime(8.0, now);

    const dur = 0.8 + intensity * 0.6;
    const peak = 0.12 * Math.min(1.0, intensity);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.reorgGain);

    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  /**
   * Disparo acústico de autogénesis:
   * Al agruparse los puntos con fuerza y voluntad (~7.2s), el sistema
   * despierta con un pulso sub-grave firme y un florecimiento armónico resonante.
   */
  triggerSelfAssemblySurge() {
    if (!this.ctx || !this.isStarted) return;
    const now = this.ctx.currentTime;

    // 1. Pulso sub-grave vigoroso ("el primer latido intencional")
    this._synthesizeHeartPulse(now, 65, 38, 0.95, 0.32);

    // 2. Acorde armónico ascendente que florece (Fmaj7 add9)
    const freqs = [261.63, 329.63, 392.00, 440.00];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.setValueAtTime(6.0, now);

      const dur = 1.6;
      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + idx * 0.08 + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.outputGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + dur + 0.1);
    });
  }

  stop() {
    if (!this.isStarted) return;
    const now = this.ctx.currentTime;
    if (this.outputGain) {
      this.outputGain.gain.cancelScheduledValues(now);
      this.outputGain.gain.linearRampToValueAtTime(0, now + 0.2);
    }
  }
}
