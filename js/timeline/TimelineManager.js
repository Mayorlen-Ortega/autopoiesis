/**
 * ============================================================================
 * AUTOPOIESIS — Gestor de Línea de Tiempo Determinista (TimelineManager.js)
 * Reloj maestro exacto gobernado por AudioContext.currentTime (60.0 segundos).
 * Transiciones de los 4 Actos y Reinos Biológicos (Célula, Planta, Pez, Escarabajo).
 * Visualización HUD, subtítulos sincronizados y fade-out maestro.
 * ============================================================================
 */

export class TimelineManager {
  constructor(audioEngine) {
    this.seenCues = new Set();
    this.engine = audioEngine;

    // Elementos del DOM
    this.timeCurrentEl = document.getElementById('time-current');
    this.timeTotalEl = document.getElementById('time-total');
    this.progressBarEl = document.getElementById('progress-bar');
    this.actBadgeEl = document.getElementById('act-badge');
    this.narrativeTextEl = document.getElementById('narrative-text');
    this.modalEndEl = document.getElementById('modal-end');

    this.totalDuration = 60.0;
    this.currentAct = '';
    this.isCompleted = false;
    this.fadeTriggered = false;

    // Configuración poética y temporal de los Actos y Reinos Biológicos
    this.cues = [
      {
        id: 'ACT_I',
        name: 'Acto I: Caos y Autogénesis',
        startTime: 0.0,
        endTime: 15.0,
        text: '“Todo ser vivo es una red que se fabrica a sí misma.”',
        textIn: 2.5,
        textOut: 13.0,
        isAuthor: false,
        duckAudio: false
      },
      {
        id: 'ACT_II_CELL',
        name: 'Acto II: Célula Primordial',
        startTime: 15.0,
        endTime: 25.0,
        text: '“Traza su propia frontera para distinguir el adentro del afuera.”',
        textIn: 16.0,
        textOut: 23.5,
        isAuthor: false,
        duckAudio: false
      },
      {
        id: 'ACT_II_PLANT',
        name: 'Acto II: Reino Vegetal (Planta)',
        startTime: 25.0,
        endTime: 36.0,
        text: '“Autoproducción”',
        textIn: 26.5,
        textOut: 34.5,
        isAuthor: false,
        duckAudio: true
      },
      {
        id: 'ACT_III_FISH',
        name: 'Acto III: Reino Animal (Pez)',
        startTime: 36.0,
        endTime: 46.5,
        text: '“Clausura operacional”',
        textIn: 37.5,
        textOut: 45.0,
        isAuthor: false,
        duckAudio: true
      },
      {
        id: 'ACT_IV_BEETLE',
        name: 'Acto IV: Reino Artrópodo (Escarabajo)',
        startTime: 46.5,
        endTime: 53.5,
        text: '“Conservación de la organización.”',
        textIn: 47.5,
        textOut: 52.8,
        isAuthor: false,
        duckAudio: true
      },
      {
        id: 'ACT_IV_CREDIT',
        name: 'AUTOPOIESIS (1972)',
        startTime: 53.5,
        endTime: 60.0,
        text: 'AUTOPOIESIS — Humberto Maturana & Francisco Varela (1972)',
        textIn: 53.8,
        textOut: 56.5,
        isAuthor: true,
        duckAudio: false
      }
    ];

    this.activeCue = null;
  }

  /**
   * Actualiza el reloj HUD y los textos narrativos en cada fotograma.
   */
  update(elapsedTime) {
    if (this.isCompleted) return;

    // Limitar estrictamente a 60.0 segundos
    const t = Math.min(this.totalDuration, elapsedTime);

    // 1. Temporizador formateado (mm:ss)
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (this.timeCurrentEl) {
      this.timeCurrentEl.textContent = formatted;
    }

    // 2. Barra de progreso determinista (0% -> 100%)
    const progressPercent = (t / this.totalDuration) * 100;
    if (this.progressBarEl) {
      this.progressBarEl.style.width = `${progressPercent.toFixed(2)}%`;
    }

    // 3. Gestión de Actos y Textos Narrativos
    for (let i = 0; i < this.cues.length; i++) {
      const cue = this.cues[i];
      if (t >= cue.startTime && t < cue.endTime) {
        if (this.currentAct !== cue.id) {
          this.currentAct = cue.id;
          if (this.actBadgeEl) {
            this.actBadgeEl.textContent = cue.name;
          }
        }

        // ----- Texto del cue -------------------------------------------------
        // Mostrar solo la primera vez que el cue entra en su ventana de texto.
        // `seenCues` evita que el mismo cue se vuelva a activar mientras su
        // intervalo sigue activo (esto era la causa de la triple aparición).
        if (t >= cue.textIn && t <= cue.textOut) {
          // Si aún no se mostró este cue, hacerlo ahora.
          if (!this.seenCues.has(cue.id)) {
            this._showText(cue.text, cue.isAuthor);
            this.seenCues.add(cue.id);
            this.activeCue = cue.id;

            // Duck‑ing de la música mientras la voz está presente
            if (cue.duckAudio && this.engine && this.engine.duckForVoice) {
              this.engine.duckForVoice(10.0, 0.35);
            }
          }
        } else {
          // Salir del rango del texto: ocultar y limpiar estado.
          if (this.activeCue === cue.id) {
            this._hideText();
            this.activeCue = null;
          }
        }
        break;
      }
    }

    // 4. Fade-out maestro determinista sincronizado en los últimos 2.0 segundos (58.0s a 60.0s)
    if (t >= 58.0 && !this.fadeTriggered) {
      this.fadeTriggered = true;
      if (this.engine && this.engine.ctx) {
        const audioNow = this.engine.ctx.currentTime;
        const remainingSeconds = Math.max(0.05, 60.0 - t);
        this.engine.fadeMaster(audioNow, audioNow + remainingSeconds);
      }
    }

    // 5. Cierre definitivo al segundo 60.0
    if (elapsedTime >= this.totalDuration) {
      if (!this.isCompleted) {
        this._complete();
      }
    }
  }

  _showText(text, isAuthor = false) {
    if (!this.narrativeTextEl) return;
    // Reset animation to avoid cumulative scaling on repeated shows
    this.narrativeTextEl.classList.remove('visible');
    // Force reflow so the removal takes effect before re‑adding
    void this.narrativeTextEl.offsetWidth;
    this.narrativeTextEl.textContent = text;
    if (isAuthor) {
      this.narrativeTextEl.classList.add('author-credit');
    } else {
      this.narrativeTextEl.classList.remove('author-credit');
    }
    this.narrativeTextEl.classList.add('visible');
  }

  _hideText() {
    if (!this.narrativeTextEl) return;
    this.narrativeTextEl.classList.remove('visible');
  }

  _complete() {
    this.isCompleted = true;
    if (this.engine) {
      this.engine.stop();
    }
    this._hideText();

    if (this.timeCurrentEl) {
      this.timeCurrentEl.textContent = '01:00';
    }
    if (this.progressBarEl) {
      this.progressBarEl.style.width = '100%';
    }
    if (this.actBadgeEl) {
      this.actBadgeEl.textContent = 'Obra Completa';
    }

    // Revelar modal final
    if (this.modalEndEl) {
      this.modalEndEl.classList.remove('modal-hidden');
    }
  }

  reset() {
    this.isCompleted = false;
    this.fadeTriggered = false;
    this.currentAct = '';
    this.activeCue = null;
    this._hideText();
    if (this.modalEndEl) {
      this.modalEndEl.classList.add('modal-hidden');
    }
  }
}
