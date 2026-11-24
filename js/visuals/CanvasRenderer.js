/**
 * ============================================================================
 * AUTOPOIESIS — Renderizador de Canvas 2D (CanvasRenderer.js)
 * Manejo de alta resolución DPI (1080p/4K), fondo profundo (#05030a),
 * bioluminiscencia y composición reactiva en tiempo real.
 * ============================================================================
 */

export class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d', { alpha: false });

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = window.devicePixelRatio || 1;

    this.resize();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = window.devicePixelRatio || 1;

    // Buffer de alta densidad de píxeles
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Escalar contexto para coordenadas lógicas
    this.ctx.scale(this.dpr, this.dpr);
  }

  /**
   * Limpia el lienzo preservando una leve persistencia luminosa (#05030a).
   */
  clear() {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Coordenadas físicas

    // Limpieza con desvanecimiento sutil para estelas bioluminiscentes
    ctx.fillStyle = 'rgba(5, 3, 10, 0.28)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.restore();
  }

  /**
   * Dibuja un sutil gradiente radial en el centro para dar profundidad cósmica / biológica.
   */
  drawAmbientGlow(systemEnergy) {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const maxRadius = Math.max(this.width, this.height) * 0.55;

    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
    const centerAlpha = 0.06 + systemEnergy * 0.08;
    grad.addColorStop(0, `rgba(139, 92, 246, ${centerAlpha})`);
    grad.addColorStop(0.4, 'rgba(13, 10, 26, 0.1)');
    grad.addColorStop(1, 'rgba(5, 3, 10, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Aplica una capa de oscurecimiento progresivo hacia negro profundo (#05030a).
   * @param {number} progress Factor de 0.0 (transparente) a 1.0 (negro opaco total).
   */
  drawFadeToBlack(progress) {
    if (progress <= 0) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Curva suave (smoothstep) para una transición cinematográfica
    const p = Math.min(1.0, Math.max(0, progress));
    const eased = p * p * (3 - 2 * p);

    ctx.fillStyle = `rgba(5, 3, 10, ${eased})`;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.restore();
  }

  /**
   * Cubre el lienzo completamente de negro absoluto (#05030a) al cumplirse los 60.0s.
   */
  clearFullBlack() {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#05030a';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
  }
}
