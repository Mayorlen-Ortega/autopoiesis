/**
 * ============================================================================
 * AUTOPOIESIS — Punto de Entrada Principal (main.js)
 * Orquestador de Audio Espacial 8D, Visuales Bioluminiscentes y Reloj Maestro.
 * Obra generativa determinista de 60.0 segundos inspirada en Maturana y Varela.
 * ============================================================================
 */

import { AudioEngine } from './audio/AudioEngine.js?v=20261123b';
import { SystemSound } from './audio/SystemSound.js?v=20261123b';
import { EnvironmentSound } from './audio/EnvironmentSound.js?v=20261123b';
import { CanvasRenderer } from './visuals/CanvasRenderer.js?v=20261123b';
import { SystemMembrane } from './visuals/SystemMembrane.js?v=20261123b';
import { PerturbationField } from './visuals/PerturbationField.js?v=20261123b';
import { TimelineManager } from './timeline/TimelineManager.js?v=20261123b';

class AutopoiesisApp {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.modalStart = document.getElementById('modal-start');
    this.btnStart = document.getElementById('btn-start');
    this.btnRestart = document.getElementById('btn-restart');
    this.btnToggleUI = document.getElementById('btn-toggle-ui');
    this.uiOverlay = document.getElementById('ui-overlay');

    // Inicializar subsistemas
    this.renderer = new CanvasRenderer(this.canvas);
    this.audioEngine = new AudioEngine();
    this.systemSound = new SystemSound(this.audioEngine);
    this.envSound = new EnvironmentSound(this.audioEngine);

    this.membrane = new SystemMembrane();
    this.membrane.onSelfAssembly = () => {
      this.systemSound.triggerSelfAssemblySurge();
    };

    this.perturbations = new PerturbationField(
      this.envSound,
      this.membrane,
      this.systemSound
    );

    this.timeline = new TimelineManager(this.audioEngine);

    this.isRunning = false;
    this.lastTimestamp = 0;

    this._bindEvents();
    this._handleResize();
  }

  _bindEvents() {
    // 1. Iniciar Experiencia (Interacción humana requerida para Web Audio API)
    this.btnStart.addEventListener('click', async () => {
      await this.start();
    });

    // 2. Reiniciar Experiencia
    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => {
        window.location.reload();
      });
    }

    // 3. Alternar Interfaz (Modo Grabación OBS Studio)
    if (this.btnToggleUI) {
      this.btnToggleUI.addEventListener('click', () => {
        this.toggleUI();
      });
    }

    // Atajo de teclado: Tecla 'H' para ocultar/mostrar interfaz rápidamente
    window.addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') {
        this.toggleUI();
      }
    });

    // 4. Redimensionamiento adaptativo
    window.addEventListener('resize', () => {
      this._handleResize();
    });
  }

  toggleUI() {
    if (this.uiOverlay) {
      this.uiOverlay.classList.toggle('ui-hidden');
    }
  }

  _handleResize() {
    this.renderer.resize();
    this.membrane.resize(this.renderer.width, this.renderer.height);
    this.perturbations.resize(this.renderer.width, this.renderer.height);
  }

  /**
   * Desbloquea AudioContext y arranca la obra de 60 segundos.
   */
  async start() {
    if (this.isRunning) return;

    try {
      await this.audioEngine.init();
      this.systemSound.start();
      this.envSound.start();

      // Ocultar modal de inicio
      this.modalStart.classList.add('modal-hidden');
      this.isRunning = true;
      this.lastTimestamp = performance.now();

      // Iniciar bucle de animación
      requestAnimationFrame((ts) => this.loop(ts));
    } catch (err) {
      console.error('Error al inicializar Web Audio API:', err);
    }
  }

  /**
   * Bucle principal de ejecución a 60 FPS coordinado con el tiempo de audio.
   */
  loop(timestamp) {
    if (!this.isRunning) return;

    const dt = Math.min(0.05, (timestamp - this.lastTimestamp) / 1000);
    this.lastTimestamp = timestamp;

    // Reloj maestro preciso derivado de Web Audio API
    const elapsedTime = this.audioEngine.getElapsedTime();

    // 1. Niveles de energía en tiempo real (FFT) para reactividad visual
    const systemEnergy = this.audioEngine.getEnergy('system');
    const envEnergy = this.audioEngine.getEnergy('environment');

    // 2. Actualizar línea de tiempo y audio
    this.timeline.update(elapsedTime);
    this.systemSound.update(elapsedTime);
    this.envSound.update(elapsedTime);

    // 3. Actualizar física de la membrana y perturbaciones 8D
    this.membrane.update(elapsedTime, systemEnergy, dt);
    this.perturbations.update(elapsedTime, envEnergy, dt);

    // 4. Renderizado reactivo en Canvas 2D
    this.renderer.clear();
    this.renderer.drawAmbientGlow(systemEnergy);
    this.perturbations.draw(this.renderer.ctx);
    this.membrane.draw(this.renderer.ctx);

    // 5. Oscurecimiento gradual previo al minuto (58.0s -> 60.0s en los últimos dos segundos)
    if (elapsedTime >= 58.0) {
      const fadeProgress = Math.min(1.0, (elapsedTime - 58.0) / 2.0);
      this.renderer.drawFadeToBlack(fadeProgress);
    }

    // 6. Detención definitiva e instantánea al cumplirse el minuto exacto (60.0s)
    if (elapsedTime >= 60.0) {
      this.renderer.clearFullBlack();
      this.isRunning = false;
      return; // Detiene completamente el ciclo de renderizado
    }

    requestAnimationFrame((ts) => this.loop(ts));
  }
}

// Inicializar cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  new AutopoiesisApp();
});
