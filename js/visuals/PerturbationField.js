/**
 * ============================================================================
 * AUTOPOIESIS — Campo de Perturbaciones del Entorno (PerturbationField.js)
 * Partículas exteriores en cian luminoso (#22d3ee) matemáticamente sincronizadas
 * con los PannerNode 8D (x, y, z) del audio espacial HRTF.
 * Al chocar con la membrana, la deforman físicamente, absorben energía y
 * gatillan la reorganización interna (Acoplamiento Estructural).
 * ============================================================================
 */

export class PerturbationField {
  constructor(environmentSound, systemMembrane, systemSound) {
    this.envSound = environmentSound;
    this.membrane = systemMembrane;
    this.sysSound = systemSound;

    this.cx = 0;
    this.cy = 0;
    this.scale = 75; // Proyección de metros de audio a píxeles de pantalla

    // Partículas principales vinculadas 1:1 a los emisores 8D
    this.anchorParticles = [];

    // Enjambre de micro-perturbaciones (texturas granulares visuales)
    this.microCount = 45;
    this.microParticles = [];

    // Chispas de impacto bioluminiscentes generadas en colisiones
    this.impactSparks = [];

    this._initMicroParticles();
  }

  resize(width, height) {
    this.cx = width / 2;
    this.cy = height / 2;
    this.scale = Math.min(width, height) * 0.085;
  }

  _initMicroParticles() {
    this.microParticles = [];
    for (let i = 0; i < this.microCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 2.4 + Math.random() * 2.8;
      this.microParticles.push({
        angle,
        radius: dist,
        speed: (0.15 + Math.random() * 0.25) * (Math.random() > 0.5 ? 1 : -1),
        elevation: (Math.random() - 0.5) * 1.5,
        size: 1.5 + Math.random() * 2.0,
        alpha: 0.3 + Math.random() * 0.6,
        trails: []
      });
    }
  }

  /**
   * Actualización determinista en cada frame.
   */
  update(elapsedTime, envEnergy, dt = 0.016) {
    const emitters = this.envSound.emitters;

    // ==========================================
    // 1. PARTÍCULAS ANCLA (Sincronizadas con PannerNode 8D)
    // ==========================================
    if (this.anchorParticles.length !== emitters.length) {
      this.anchorParticles = emitters.map(em => ({
        id: em.id,
        screenX: 0,
        screenY: 0,
        screenZ: 0,
        angle: 0,
        radius: 0,
        trails: [],
        cooldown: 0
      }));
    }

    for (let i = 0; i < emitters.length; i++) {
      const em = emitters[i];
      const p = this.anchorParticles[i];

      // Proyección isométrica 3D a pantalla 2D
      // X = horizontal, Z = profundidad, Y = elevación
      p.screenX = this.cx + em.x * this.scale;
      p.screenY = this.cy + em.z * this.scale * 0.72 - em.y * this.scale * 0.35;
      p.screenZ = em.z;
      p.angle = em.currentAngle;

      const distFromCenter = Math.hypot(p.screenX - this.cx, p.screenY - this.cy);
      p.radius = distFromCenter;

      // Almacenar estela de movimiento
      p.trails.unshift({ x: p.screenX, y: p.screenY, z: p.screenZ });
      if (p.trails.length > 14) p.trails.pop();

      // Detección de colisión / Acoplamiento Estructural con la membrana
      if (this.membrane.opacity > 0.1 && p.cooldown <= 0) {
        // Ángulo de impacto relativo al centro
        const impactAngle = Math.atan2(p.screenY - this.cy, p.screenX - this.cx);
        const membraneRadius = this.membrane.getRadiusAtAngle(impactAngle);

        // Si la perturbación toca la frontera celular
        if (distFromCenter <= membraneRadius + 14 && distFromCenter >= membraneRadius - 30) {
          // A. Deformación elástica de la membrana en el punto de contacto
          const impactForce = 1.0 + envEnergy * 1.5;
          this.membrane.deformAtAngle(impactAngle, impactForce);

          // B. Respuesta de reorganización armónica interna (Autopoiesis)
          this.sysSound.triggerInternalReorganization(impactForce);

          // C. Generación de chispas bioluminiscentes de impacto
          this._spawnSparks(p.screenX, p.screenY, impactAngle);

          p.cooldown = 0.45; // Evitar colisiones repetidas instantáneas
        }
      }

      if (p.cooldown > 0) p.cooldown -= dt;
    }

    // ==========================================
    // 2. ENJAMBRE DE MICRO-PERTURBACIONES
    // ==========================================
    for (let i = 0; i < this.microParticles.length; i++) {
      const mp = this.microParticles[i];

      // Movimiento orbital
      mp.angle += mp.speed * dt * (1.0 + envEnergy * 0.8);

      // En Acto III convergen hacia el sistema
      let currentR = mp.radius;
      if (elapsedTime >= 30.0 && elapsedTime < 48.0) {
        currentR = mp.radius - Math.sin(elapsedTime * 1.5 + i) * 0.6;
      }

      const worldX = Math.cos(mp.angle) * currentR;
      const worldZ = Math.sin(mp.angle) * currentR;
      const worldY = mp.elevation + Math.sin(elapsedTime * 2 + i) * 0.2;

      mp.screenX = this.cx + worldX * this.scale;
      mp.screenY = this.cy + worldZ * this.scale * 0.72 - worldY * this.scale * 0.35;

      mp.trails.unshift({ x: mp.screenX, y: mp.screenY });
      if (mp.trails.length > 5) mp.trails.pop();
    }

    // ==========================================
    // 3. ACTUALIZACIÓN DE CHISPAS DE IMPACTO
    // ==========================================
    for (let i = this.impactSparks.length - 1; i >= 0; i--) {
      const s = this.impactSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= dt * 2.2;
      if (s.life <= 0) {
        this.impactSparks.splice(i, 1);
      }
    }
  }

  /**
   * Genera una explosión de chispas bioluminiscentes en el punto de contacto.
   */
  _spawnSparks(x, y, angle) {
    const count = 9;
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 1.8;
      const sparkAngle = angle + Math.PI + spread; // Rebote hacia afuera
      const speed = 2.0 + Math.random() * 4.5;
      this.impactSparks.push({
        x,
        y,
        vx: Math.cos(sparkAngle) * speed,
        vy: Math.sin(sparkAngle) * speed,
        size: 1.5 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#22d3ee' : '#d946ef',
        life: 1.0
      });
    }
  }

  /**
   * Renderizado en Canvas 2D.
   */
  draw(ctx) {
    // 1. Estelas y partículas del Enjambre de Micro-perturbaciones
    for (let i = 0; i < this.microParticles.length; i++) {
      const mp = this.microParticles[i];
      if (mp.trails.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(mp.trails[0].x, mp.trails[0].y);
        for (let t = 1; t < mp.trails.length; t++) {
          ctx.lineTo(mp.trails[t].x, mp.trails[t].y);
        }
        ctx.strokeStyle = `rgba(34, 211, 238, ${mp.alpha * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(mp.screenX, mp.screenY, mp.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${mp.alpha})`;
      ctx.fill();
    }

    // 2. Partículas Ancla Principales 8D (Cian bioluminiscente de alta energía)
    for (let i = 0; i < this.anchorParticles.length; i++) {
      const p = this.anchorParticles[i];

      // Estela larga
      if (p.trails.length >= 2) {
        for (let t = 0; t < p.trails.length - 1; t++) {
          const ptA = p.trails[t];
          const ptB = p.trails[t + 1];
          const trailAlpha = (1 - t / p.trails.length) * 0.7;

          ctx.beginPath();
          ctx.moveTo(ptA.x, ptA.y);
          ctx.lineTo(ptB.x, ptB.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${trailAlpha})`;
          ctx.lineWidth = 2.5 * (1 - t / p.trails.length);
          ctx.stroke();
        }
      }

      // Proyección de profundidad Z para realismo 3D
      const depthScale = 1.0 + (p.screenZ / 6.0) * 0.4;
      const particleRadius = 6.0 * Math.max(0.6, depthScale);

      // Partícula central con resplandor cian
      ctx.beginPath();
      ctx.arc(p.screenX, p.screenY, particleRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 18;
      ctx.fill();

      // Centro blanco de máxima energía
      ctx.beginPath();
      ctx.arc(p.screenX, p.screenY, particleRadius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    // 3. Chispas de Impacto (Rebote elástico)
    for (let i = 0; i < this.impactSparks.length; i++) {
      const s = this.impactSparks[i];
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8 * s.life;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}
