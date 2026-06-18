/**
 * Aegis Protocol – Fully Visualized City Tactical Map Renderer
 * v2 — Bug fixes + visual depth pass
 */

import { DISTRICTS } from './simulation.js';

export class TacticalMap {
  constructor(canvasId, simulationState, onDistrictSelected, onCivilianSelected) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.state = simulationState;
    this.onDistrictSelected   = onDistrictSelected;
    this.onCivilianSelected   = onCivilianSelected || (() => {});

    this.selectedDistrictId = null;
    this.hoveredDistrictId  = null;
    this.mapMode = 'tactical'; // 'tactical' | 'heatmap' | 'coverage' | 'energy'

    // Static geography
    this.roads       = [];
    this.riverPath   = [];
    this.bridges     = [];
    this.buildings   = {};
    this.maglevRails = [];

    // Actors
    this.actors = {
      civilians      : [],
      drones         : [],
      cruisers       : [],
      trains         : [],
      smokeParticles : [],
      rainDrops      : []
    };

    this.pulseAlpha    = 0;
    this.pulseDir      = 1;
    this.scanSweepAngle = 0;

    this.init();
  }

  /* ─── Init ─────────────────────────────────────────────────────── */

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.generateCityStructures();
      this.generateActors();
    });
    this.canvas.addEventListener('mousemove', e => this.handleMouseMove(e));
    this.canvas.addEventListener('mousedown', e => this.handleMouseDown(e));
    this.generateCityStructures();
    this.generateActors();
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width  = rect.width;
    this.canvas.height = rect.height;
  }

  setMapMode(mode) { this.mapMode = mode; }
  setSelectedDistrict(id) { this.selectedDistrictId = id; }

  /* ─── Helpers ───────────────────────────────────────────────────── */

  dc(d) {   // district → canvas coords
    return { x: d.x * this.canvas.width, y: d.y * this.canvas.height };
  }

  /* ─── City Structure Generation ────────────────────────────────── */

  generateCityStructures() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    if (W < 100 || H < 100) return;

    this.roads     = [];
    this.buildings = {
      [DISTRICTS.APEX]   : [],
      [DISTRICTS.HUB]    : [],
      [DISTRICTS.FOUNDRY]: [],
      [DISTRICTS.FRINGE] : []
    };

    const ap  = this.dc(this.state.districts[DISTRICTS.APEX]);
    const hub = this.dc(this.state.districts[DISTRICTS.HUB]);
    const fo  = this.dc(this.state.districts[DISTRICTS.FOUNDRY]);
    const fr  = this.dc(this.state.districts[DISTRICTS.FRINGE]);

    /* River */
    this.riverPath = [
      { x: W * 0.13, y: 0         },
      { x: W * 0.17, y: H * 0.28  },
      { x: W * 0.36, y: H * 0.58  },
      { x: W * 0.32, y: H * 0.82  },
      { x: W * 0.42, y: H         }
    ];

    /* Bridges */
    this.bridges = [
      { x: W * 0.155, y: H * 0.24, w: 44, angle:  0.12 },
      { x: W * 0.35,  y: H * 0.56, w: 48, angle: -0.18 }
    ];

    /* Roads – Main Corridors (stored as pixel coords, NOT district refs) */
    const road = (fx, fy, tx, ty, label = '') =>
      this.roads.push({ from: { x: fx, y: fy }, to: { x: tx, y: ty }, label });

    road(ap.x,  ap.y,  hub.x, hub.y, 'apex_hub');
    road(hub.x, hub.y, fo.x,  fo.y,  'hub_foundry');
    road(hub.x, hub.y, fr.x,  fr.y,  'hub_fringe');
    road(fr.x,  fr.y,  fo.x,  fo.y,  'fringe_foundry');

    // Apex local block loop
    road(ap.x - 55, ap.y + 22, ap.x + 55, ap.y + 22);
    road(ap.x + 55, ap.y + 22, ap.x + 32, ap.y - 42);
    road(ap.x - 55, ap.y + 22, ap.x - 32, ap.y - 42);
    road(ap.x - 32, ap.y - 42, ap.x + 32, ap.y - 42);
    road(ap.x,      ap.y - 42, ap.x,       ap.y + 22);

    // Foundry industrial grid
    road(fo.x - 65, fo.y - 22, fo.x + 65, fo.y - 22);
    road(fo.x - 65, fo.y + 22, fo.x + 65, fo.y + 22);
    road(fo.x - 42, fo.y - 42, fo.x - 42, fo.y + 42);
    road(fo.x,      fo.y - 42, fo.x,       fo.y + 42);
    road(fo.x + 42, fo.y - 42, fo.x + 42, fo.y + 42);

    // Hub spokes
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i;
      const r = 42;
      road(hub.x, hub.y, hub.x + Math.cos(a) * r, hub.y + Math.sin(a) * r);
    }

    // Fringe irregular sprawl
    for (let i = 0; i < 10; i++) {
      const sx = fr.x + (Math.random() - 0.5) * 130;
      const sy = fr.y + (Math.random() - 0.5) * 110;
      road(sx, sy, sx + (Math.random() - 0.5) * 55, sy + (Math.random() - 0.5) * 55);
    }

    /* Maglev Rail */
    this.maglevRails = [
      ap,
      { x: W * 0.54, y: H * 0.38 },
      hub,
      { x: W * 0.63, y: H * 0.64 },
      fo
    ];

    /* Buildings */
    // APEX – tall glass towers
    for (let i = 0; i < 9; i++) {
      const angle = (Math.PI * 2 / 9) * i;
      const r = 32 + Math.random() * 22;
      this.buildings[DISTRICTS.APEX].push({
        x: ap.x + Math.cos(angle) * r, y: ap.y + Math.sin(angle) * r,
        bw: 14 + Math.random() * 12, bh: 55 + Math.random() * 45,
        style: 'skyscraper', lights: Math.random() > 0.25,
        windowCols: 2 + Math.floor(Math.random() * 2),
        windowRows: 5 + Math.floor(Math.random() * 5),
        phase: Math.random() * Math.PI * 2  // for lighting animation
      });
    }

    // HUB – terminal domes
    for (let i = 0; i < 7; i++) {
      const angle = (Math.PI * 2 / 7) * i;
      const r = 38 + Math.random() * 14;
      this.buildings[DISTRICTS.HUB].push({
        x: hub.x + Math.cos(angle) * r, y: hub.y + Math.sin(angle) * r,
        bw: 18 + Math.random() * 10, bh: 18 + Math.random() * 18,
        style: 'terminal', lights: Math.random() > 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // FOUNDRY – warehouses & stacks
    for (let i = 0; i < 12; i++) {
      const fx = fo.x + (Math.random() - 0.5) * 120;
      const fy = fo.y + (Math.random() - 0.5) * 90;
      if (Math.hypot(fx - fo.x, fy - fo.y) < 16) continue;
      this.buildings[DISTRICTS.FOUNDRY].push({
        x: fx, y: fy,
        bw: 22 + Math.random() * 18, bh: 14 + Math.random() * 14,
        style: 'factory', isSmokestack: Math.random() > 0.45,
        lights: Math.random() > 0.5, phase: Math.random() * Math.PI * 2
      });
    }

    // FRINGE – chaotic shanties
    for (let i = 0; i < 28; i++) {
      const fx = fr.x + (Math.random() - 0.5) * 130;
      const fy = fr.y + (Math.random() - 0.5) * 100;
      if (Math.hypot(fx - fr.x, fy - fr.y) < 14) continue;
      this.buildings[DISTRICTS.FRINGE].push({
        x: fx, y: fy,
        bw: 7 + Math.random() * 8, bh: 5 + Math.random() * 9,
        angle: Math.random() * Math.PI,
        style: 'shack', lights: Math.random() > 0.65,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  /* ─── Actor Generation ──────────────────────────────────────────── */

  generateActors() {
    const W = this.canvas.width;
    const H = this.canvas.height;

    this.actors = {
      civilians: [], drones: [], cruisers: [],
      trains: [], smokeParticles: [], rainDrops: []
    };

    // Civilians – move along road segments using pixel coords
    for (let i = 0; i < 70; i++) {
      if (!this.roads.length) break;
      const road = this.roads[Math.floor(Math.random() * this.roads.length)];
      // Assign civilian to nearest district
      const midX = (road.from.x + road.to.x) / 2;
      const midY = (road.from.y + road.to.y) / 2;
      let nearestDist = Infinity;
      let nearestId   = DISTRICTS.HUB;
      for (const id in this.state.districts) {
        const dc = this.dc(this.state.districts[id]);
        const d  = Math.hypot(midX - dc.x, midY - dc.y);
        if (d < nearestDist) { nearestDist = d; nearestId = id; }
      }
      this.actors.civilians.push({
        road,
        progress : Math.random(),
        speed    : 0.001 + Math.random() * 0.003,
        direction: Math.random() > 0.5 ? 1 : -1,
        districtId: nearestId
      });
    }

    // Drones
    for (let i = 0; i < 5; i++) {
      this.actors.drones.push({
        x: Math.random() * W, y: Math.random() * H,
        targetX: Math.random() * W, targetY: Math.random() * H,
        speed: 0.7 + Math.random() * 0.8,
        scanRadius: 38 + Math.random() * 20,
        scanAngle: Math.random() * Math.PI * 2
      });
    }

    // Patrol cruisers
    const hubDc = this.dc(this.state.districts[DISTRICTS.HUB]);
    for (let i = 0; i < 2; i++) {
      this.actors.cruisers.push({
        x: hubDc.x + (Math.random() - 0.5) * 20,
        y: hubDc.y + (Math.random() - 0.5) * 20,
        speed: 2.0, sirenTick: Math.floor(Math.random() * 30),
        sirenRadius: 0
      });
    }

    // Two trains on the maglev line
    this.actors.trains.push({ progress: 0.0, speed: 0.0028, direction: 1 });
    this.actors.trains.push({ progress: 0.5, speed: 0.0025, direction: 1 });

    // Rain
    for (let i = 0; i < 55; i++) {
      this.actors.rainDrops.push({
        x: Math.random() * W, y: Math.random() * H,
        length: 9 + Math.random() * 12,
        speed : 7 + Math.random() * 7,
        alpha : 0.05 + Math.random() * 0.10
      });
    }
  }

  /* ─── Input Handlers ───────────────────────────────────────────── */

  handleMouseMove(e) {
    const rect  = this.canvas.getBoundingClientRect();
    const mx    = e.clientX - rect.left;
    const my    = e.clientY - rect.top;

    const el = document.getElementById('mapCoordinates');
    if (el) el.textContent = `COORD: ${(mx / this.canvas.width * 100).toFixed(2)} // ${(my / this.canvas.height * 100).toFixed(2)}`;

    // Check district hover
    let hover = null;
    for (const id in this.state.districts) {
      const c = this.dc(this.state.districts[id]);
      if (Math.hypot(mx - c.x, my - c.y) < 40) { hover = id; break; }
    }
    this.hoveredDistrictId = hover;

    // Check civilian hover
    const nearCiv = this.getCivilianAt(mx, my);
    if (hover) {
      this.canvas.style.cursor = 'pointer';
    } else if (nearCiv) {
      this.canvas.style.cursor = 'crosshair';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;

    // Check district click first
    for (const id in this.state.districts) {
      const c = this.dc(this.state.districts[id]);
      if (Math.hypot(mx - c.x, my - c.y) < 40) {
        this.setSelectedDistrict(id);
        this.onDistrictSelected(id);
        return;
      }
    }

    // Check civilian click
    const civ = this.getCivilianAt(mx, my);
    if (civ) {
      this.onCivilianSelected(civ);
    }
  }

  /**
   * Return the civilian nearest to (mx, my) within 7px, or null
   */
  getCivilianAt(mx, my) {
    let best = null;
    let bestDist = 7; // px threshold
    for (const civ of this.actors.civilians) {
      if (civ.cx === undefined) continue;
      const d = Math.hypot(mx - civ.cx, my - civ.cy);
      if (d < bestDist) { bestDist = d; best = civ; }
    }
    return best;
  }

  /* ─── Actor Updates ────────────────────────────────────────────── */

  updateActors() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const spd = this.state.currentSpeed;
    if (spd === 0) return;

    // Civilians along road pixel coords
    this.actors.civilians.forEach(civ => {
      civ.progress += civ.speed * civ.direction * spd;
      if (civ.progress >= 1) { civ.progress = 1; civ.direction = -1; }
      else if (civ.progress <= 0) { civ.progress = 0; civ.direction = 1; }
    });

    // Drones wander
    this.actors.drones.forEach(dr => {
      const dist = Math.hypot(dr.targetX - dr.x, dr.targetY - dr.y);
      if (dist < 6) {
        // Bias toward districts with anomalies
        let biasX = Math.random() * W, biasY = Math.random() * H;
        for (const id in this.state.districts) {
          const d = this.state.districts[id];
          if (d.anomalies.length > 0) {
            const c = this.dc(d);
            biasX = c.x + (Math.random() - 0.5) * 60;
            biasY = c.y + (Math.random() - 0.5) * 60;
            break;
          }
        }
        dr.targetX = biasX; dr.targetY = biasY;
      } else {
        dr.x += (dr.targetX - dr.x) / dist * dr.speed * spd;
        dr.y += (dr.targetY - dr.y) / dist * dr.speed * spd;
      }
      dr.scanAngle += 0.018 * spd;
    });

    // Cruisers dispatch toward anomalies
    this.actors.cruisers.forEach(cr => {
      cr.sirenTick = (cr.sirenTick + 1) % 28;

      let target = null;
      for (const id in this.state.districts) {
        const d = this.state.districts[id];
        if (d.anomalies.length > 0) { target = d; break; }
      }

      const goalDc = target
        ? this.dc(target)
        : this.dc(this.state.districts[DISTRICTS.HUB]);

      const dist = Math.hypot(goalDc.x - cr.x, goalDc.y - cr.y);
      if (dist > 6) {
        cr.x += (goalDc.x - cr.x) / dist * cr.speed * spd;
        cr.y += (goalDc.y - cr.y) / dist * cr.speed * spd;
      } else if (target) {
        const anomaly = target.anomalies[0];
        if (anomaly && Math.random() < 0.015 * spd) {
          this.state.resolveAnomaly(target.id, anomaly.id);
        }
      }

      // Siren pulse radius
      cr.sirenRadius = cr.sirenTick < 14
        ? cr.sirenRadius + 1.5 * spd
        : Math.max(0, cr.sirenRadius - 2 * spd);
      if (cr.sirenRadius > 22) cr.sirenRadius = 0;
    });

    // Trains along maglev rail
    this.actors.trains.forEach(t => {
      t.progress += t.speed * spd;
      if (t.progress >= 1) t.progress = 0;
    });

    // Rain drift
    this.actors.rainDrops.forEach(r => {
      r.y += r.speed * spd;
      r.x -= r.speed * 0.18 * spd;
      if (r.y > H) { r.y = -12; r.x = Math.random() * W; }
    });

    // Foundry smoke
    if (Math.random() < 0.3 * spd) {
      const fc = this.dc(this.state.districts[DISTRICTS.FOUNDRY]);
      this.actors.smokeParticles.push({
        x: fc.x + (Math.random() - 0.5) * 65,
        y: fc.y + (Math.random() - 0.5) * 38 - 8,
        vx: (Math.random() - 0.3) * 0.35,
        vy: -0.45 - Math.random() * 0.75,
        size: 3 + Math.random() * 4,
        alpha: 0.55
      });
    }
    this.actors.smokeParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.alpha -= 0.007; p.size += 0.06;
    });
    this.actors.smokeParticles = this.actors.smokeParticles.filter(p => p.alpha > 0);
  }

  /* ─── Drawing ─────────────────────────────────────────────────── */

  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = '#090f18';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    const s = 36;
    for (let x = 0; x < this.canvas.width;  x += s) { ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height); }
    for (let y = 0; y < this.canvas.height; y += s) { ctx.moveTo(0, y); ctx.lineTo(this.canvas.width, y); }
    ctx.stroke();
  }

  drawDistrictGlow() {
    // Soft ambient light pools distinguishing each district even before buildings
    const glowMap = {
      [DISTRICTS.APEX]   : { color: '0,240,255',   alpha: 0.04, r: 95  },
      [DISTRICTS.HUB]    : { color: '57,255,20',   alpha: 0.03, r: 85  },
      [DISTRICTS.FOUNDRY]: { color: '255,185,0',   alpha: 0.035, r: 90 },
      [DISTRICTS.FRINGE] : { color: '255,0,85',    alpha: 0.03, r: 100 }
    };
    for (const id in this.state.districts) {
      const d   = this.state.districts[id];
      const c   = this.dc(d);
      const cfg = glowMap[id];
      if (!cfg) continue;
      const unrestBoost = (d.unrest / 100) * 0.03;
      const grad = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, cfg.r);
      grad.addColorStop(0, `rgba(${cfg.color},${(cfg.alpha + unrestBoost).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${cfg.color},0)`);
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, cfg.r, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawRiver() {
    const ctx  = this.ctx;
    const path = this.riverPath;
    if (!path.length) return;

    // Outer bank shadow
    ctx.strokeStyle = '#020508';
    ctx.lineWidth = 30;
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Water fill
    ctx.strokeStyle = '#06111e';
    ctx.lineWidth = 22;
    ctx.stroke();

    // Subtle surface glimmer
    ctx.strokeStyle = 'rgba(0,80,130,0.25)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Bridges
    this.bridges.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);

      // Deck
      ctx.fillStyle = '#1c3448';
      ctx.fillRect(-12, -b.w / 2, 24, b.w);

      // Guard rails glow
      ctx.fillStyle = 'rgba(0,240,255,0.5)';
      ctx.fillRect(-11, -b.w / 2, 2, b.w);
      ctx.fillRect( 9,  -b.w / 2, 2, b.w);

      // Bridge label
      ctx.fillStyle = 'rgba(0,240,255,0.3)';
      ctx.font = '7px monospace';
      ctx.fillText('BRIDGE', -10, -b.w / 2 - 4);

      ctx.restore();
    });
  }

  drawRoads() {
    const ctx = this.ctx;

    // Road surface
    ctx.strokeStyle = '#0c1d2e';
    ctx.lineWidth   = 5;
    ctx.lineCap     = 'round';
    this.roads.forEach(r => {
      ctx.beginPath();
      ctx.moveTo(r.from.x, r.from.y);
      ctx.lineTo(r.to.x,   r.to.y);
      ctx.stroke();
    });

    // Centre dashes
    ctx.strokeStyle = '#193347';
    ctx.lineWidth   = 1.0;
    ctx.setLineDash([5, 7]);
    ctx.beginPath();
    this.roads.forEach(r => {
      ctx.moveTo(r.from.x, r.from.y);
      ctx.lineTo(r.to.x,   r.to.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Glow on corridor roads
    ctx.strokeStyle = 'rgba(0,240,255,0.04)';
    ctx.lineWidth   = 3;
    this.roads.filter(r => r.label).forEach(r => {
      ctx.beginPath();
      ctx.moveTo(r.from.x, r.from.y);
      ctx.lineTo(r.to.x,   r.to.y);
      ctx.stroke();
    });
  }

  drawMaglevRails() {
    const ctx   = this.ctx;
    const rails = this.maglevRails;
    if (!rails.length) return;

    // Support track
    ctx.strokeStyle = '#0f2232';
    ctx.lineWidth   = 5;
    ctx.lineCap     = 'butt';
    ctx.beginPath();
    ctx.moveTo(rails[0].x, rails[0].y);
    rails.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Electrified rail glow
    ctx.strokeStyle = 'rgba(0,240,255,0.20)';
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rail edge lines
    ctx.strokeStyle = 'rgba(0,240,255,0.08)';
    ctx.lineWidth   = 3;
    ctx.stroke();
  }

  drawBuildings() {
    const ctx = this.ctx;
    const isServicePrioritized = this.state.tools.service_prioritization.active;
    const t = Date.now() * 0.001; // for window flicker animation

    for (const dId in this.buildings) {
      const district  = this.state.districts[dId];
      const isBlackout = isServicePrioritized && district.compliance < 50;
      const blackoutFlicker = isBlackout && Math.sin(t * 8 + district.x * 10) > 0.5;

      this.buildings[dId].forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);

        if (b.style === 'skyscraper') {
          // — Depth: isometric right face
          const faceColor = isBlackout ? '#071018' : 'rgba(0,30,50,0.9)';
          ctx.fillStyle = faceColor;
          ctx.beginPath();
          ctx.moveTo(b.bw / 2,  -b.bh);
          ctx.lineTo(b.bw / 2 + 6, -b.bh + 8);
          ctx.lineTo(b.bw / 2 + 6, 8);
          ctx.lineTo(b.bw / 2,  0);
          ctx.closePath();
          ctx.fill();

          // — Main façade
          ctx.fillStyle = isBlackout ? 'rgba(3,6,10,0.97)' : 'rgba(4,18,28,0.88)';
          ctx.strokeStyle = (isBlackout || blackoutFlicker) ? '#0a1e2e' : '#00f0ff';
          ctx.lineWidth = 0.8;
          ctx.fillRect(-b.bw / 2, -b.bh, b.bw, b.bh);
          ctx.strokeRect(-b.bw / 2, -b.bh, b.bw, b.bh);

          // — Top glowing cap
          if (!isBlackout) {
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.fillRect(-b.bw / 2, -b.bh, b.bw, 2);
            ctx.shadowBlur = 0;
          }

          // — Window grid
          if (b.lights && !isBlackout) {
            const cols = b.windowCols || 2;
            const rows = b.windowRows || 5;
            const cellW = (b.bw - 4) / cols;
            const cellH = (b.bh - 8) / rows;
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const lit = Math.sin(t * 0.4 + b.phase + r * 0.7 + c * 1.3) > -0.3;
                ctx.fillStyle = lit ? 'rgba(0,240,255,0.85)' : 'rgba(0,40,60,0.4)';
                ctx.fillRect(-b.bw / 2 + 2 + c * cellW, -b.bh + 5 + r * cellH, cellW - 2, cellH - 2);
              }
            }
          }

        } else if (b.style === 'terminal') {
          // HUB dome terminals
          const dim = isServicePrioritized && district.compliance < 50;
          ctx.fillStyle   = dim ? 'rgba(5,20,8,0.85)' : 'rgba(5,28,10,0.82)';
          ctx.strokeStyle = dim ? '#1a3a1a' : '#39ff14';
          ctx.lineWidth   = 0.9;

          // Octagonal body
          ctx.beginPath();
          const r8 = b.bw / 2;
          for (let i = 0; i < 8; i++) {
            const a = (Math.PI / 4) * i - Math.PI / 8;
            const px = Math.cos(a) * r8;
            const py = Math.sin(a) * r8 - b.bh / 2;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Antenna
          if (!dim) {
            ctx.strokeStyle = '#39ff14';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -b.bh / 2);
            ctx.lineTo(0, -b.bh / 2 - 10);
            ctx.stroke();
            // Blinking light
            const blink = Math.sin(t * 3 + b.phase) > 0;
            ctx.fillStyle = blink ? '#39ff14' : 'transparent';
            ctx.shadowColor = '#39ff14';
            ctx.shadowBlur  = blink ? 6 : 0;
            ctx.beginPath();
            ctx.arc(0, -b.bh / 2 - 11, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }

        } else if (b.style === 'factory') {
          const blackout = isServicePrioritized && district.compliance < 50;
          ctx.fillStyle   = blackout ? 'rgba(8,6,3,0.95)' : 'rgba(22,17,4,0.88)';
          ctx.strokeStyle = blackout ? '#2a1f00' : '#ffb900';
          ctx.lineWidth   = 0.9;

          // Sawtooth industrial roof
          ctx.beginPath();
          ctx.moveTo(-b.bw / 2, 0);
          const teeth = 3;
          const tw    = b.bw / teeth;
          for (let i = 0; i < teeth; i++) {
            ctx.lineTo(-b.bw / 2 + i * tw + tw * 0.3, -b.bh + 4);
            ctx.lineTo(-b.bw / 2 + i * tw + tw * 0.6, -b.bh);
            ctx.lineTo(-b.bw / 2 + (i + 1) * tw, -b.bh + 4);
          }
          ctx.lineTo(b.bw / 2, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Smokestack
          if (b.isSmokestack && !blackout) {
            ctx.fillStyle = '#ffb900';
            ctx.fillRect(b.bw / 4 - 2, -b.bh - 8, 4, 9);
            // Hot band
            ctx.fillStyle = 'rgba(255,185,0,0.5)';
            ctx.fillRect(b.bw / 4 - 3, -b.bh - 9, 6, 2);
          }

          // Yellow warning windows
          if (b.lights && !blackout) {
            ctx.fillStyle = `rgba(255,185,0,${0.4 + 0.3 * Math.sin(t * 2 + b.phase)})`;
            ctx.fillRect(-b.bw / 2 + 3, -b.bh + 3, 4, 3);
            ctx.fillRect(-b.bw / 2 + 3, -b.bh + 8, 4, 3);
          }

        } else { // shack
          const hostile = district.unrest > 60;
          ctx.save();
          ctx.rotate(b.angle || 0);
          ctx.fillStyle   = 'rgba(10,3,6,0.92)';
          ctx.strokeStyle = hostile ? 'rgba(255,0,85,0.45)' : 'rgba(80,30,40,0.4)';
          ctx.lineWidth   = 0.7;
          ctx.fillRect(-b.bw / 2, -b.bh / 2, b.bw, b.bh);
          ctx.strokeRect(-b.bw / 2, -b.bh / 2, b.bw, b.bh);

          // Candle flicker light
          if (b.lights) {
            const flicker = 0.3 + 0.4 * Math.abs(Math.sin(t * 6 + b.phase));
            ctx.fillStyle = `rgba(255,80,0,${flicker})`;
            ctx.fillRect(-1, -1, 2, 2);
          }
          ctx.restore();
        }

        ctx.restore();
      });
    }
  }

  drawPolicyOverlays() {
    const ctx = this.ctx;
    const t   = Date.now() * 0.001;

    // Quarantine barriers across bridges
    if (this.state.tools.automated_gatekeeping.active) {
      this.bridges.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        const pulse = 0.6 + 0.4 * Math.abs(Math.sin(t * 4));
        ctx.strokeStyle = `rgba(255,0,85,${pulse})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -b.w / 2 - 3);
        ctx.lineTo(0,  b.w / 2 + 3);
        ctx.stroke();
        // Hazard stripes
        ctx.fillStyle = `rgba(255,0,85,${pulse * 0.15})`;
        ctx.fillRect(-8, -b.w / 2, 16, b.w);
        // Label
        ctx.fillStyle = '#ff0055';
        ctx.font = '7px monospace';
        ctx.fillText('⛔ SEALED', -16, -b.w / 2 - 6);
        ctx.restore();
      });
    }

    // Transit permit rings around Hub
    if (this.state.tools.permit_filter.active) {
      const hc = this.dc(this.state.districts[DISTRICTS.HUB]);
      const pulse = 0.4 + 0.3 * Math.abs(Math.sin(t * 2));
      ctx.strokeStyle = `rgba(255,185,0,${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(hc.x, hc.y, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = `rgba(255,185,0,${pulse * 0.06})`;
      ctx.beginPath();
      ctx.arc(hc.x, hc.y, 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // Welfare queue in Fringe
    if (this.state.tools.welfare_score.active) {
      const fc  = this.dc(this.state.districts[DISTRICTS.FRINGE]);
      ctx.fillStyle   = '#ff0055';
      ctx.strokeStyle = 'rgba(255,0,85,0.5)';
      ctx.lineWidth   = 1;
      ctx.fillRect(fc.x - 22, fc.y + 28, 44, 3);
      ctx.font      = '7px monospace';
      ctx.fillStyle = 'rgba(255,0,85,0.6)';
      ctx.fillText('◆ WELFARE EXCLUSION ZONE', fc.x - 38, fc.y + 42);
    }

    // Power Grid mode overlay
    if (this.mapMode === 'energy') {
      const ac  = this.dc(this.state.districts[DISTRICTS.APEX]);
      const hc  = this.dc(this.state.districts[DISTRICTS.HUB]);
      const foc = this.dc(this.state.districts[DISTRICTS.FOUNDRY]);
      const frc = this.dc(this.state.districts[DISTRICTS.FRINGE]);
      const prio = this.state.tools.service_prioritization.active;

      const drawPLine = (p1, p2, damaged) => {
        ctx.strokeStyle = damaged
          ? `rgba(255,185,0,${0.2 + 0.2 * Math.abs(Math.sin(t * 6))})`
          : 'rgba(57,255,20,0.6)';
        ctx.lineWidth = damaged ? 1 : 2;
        if (damaged) ctx.setLineDash([3, 9]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      ctx.save();
      drawPLine(ac,  hc,  false);
      drawPLine(hc,  foc, prio && this.state.districts[DISTRICTS.FOUNDRY].compliance < 50);
      drawPLine(hc,  frc, prio && this.state.districts[DISTRICTS.FRINGE].compliance  < 50);
      drawPLine(frc, foc, prio);
      ctx.restore();
    }
  }

  drawActors() {
    const ctx = this.ctx;
    const t   = Date.now() * 0.001;

    // 1 — Civilians (movement along road pixel coords)
    ctx.save();
    this.actors.civilians.forEach(civ => {
      const { from, to } = civ.road;
      const x = from.x + (to.x - from.x) * civ.progress;
      const y = from.y + (to.y - from.y) * civ.progress;

      // Store screen position for hit-testing
      civ.cx = x;
      civ.cy = y;

      const district = this.state.districts[civ.districtId];
      const isRebel  = district && Math.random() * 100 < district.unrest * 0.35;
      civ.isRebel    = isRebel;

      ctx.fillStyle = isRebel ? 'rgba(255,0,85,0.85)' : 'rgba(0,240,255,0.65)';
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 2 — Maglev trains (multi-car)
    this.actors.trains.forEach(train => {
      const rails = this.maglevRails;
      if (rails.length < 2) return;
      const total = rails.length - 1;
      const rawIdx = train.progress * total;
      const idx    = Math.min(Math.floor(rawIdx), total - 1);
      const frac   = rawIdx - idx;
      const p1     = rails[idx];
      const p2     = rails[idx + 1];
      if (!p1 || !p2) return;

      const tx  = p1.x + (p2.x - p1.x) * frac;
      const ty  = p1.y + (p2.y - p1.y) * frac;
      const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(ang);
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur  = 10;

      // 3-car train body
      for (let car = 0; car < 3; car++) {
        ctx.fillStyle = car === 0 ? '#00e5ff' : '#0097a7';
        ctx.strokeStyle = '#e0f7fa';
        ctx.lineWidth = 0.5;
        ctx.fillRect(-7 + car * (-14), -2.5, 12, 5);
        ctx.strokeRect(-7 + car * (-14), -2.5, 12, 5);
      }
      // Head light
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(5, 0, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.restore();
    });

    // 3 — Drones
    this.actors.drones.forEach(dr => {
      const isFacialActive = this.state.tools.facial_sweep.active;

      // Search cone (fan shape)
      ctx.save();
      ctx.translate(dr.x, dr.y);
      ctx.rotate(dr.scanAngle);
      const coneFill = ctx.createRadialGradient(0, 0, 3, 0, dr.scanRadius, dr.scanRadius);
      coneFill.addColorStop(0, `rgba(0,240,255,${isFacialActive ? 0.15 : 0.07})`);
      coneFill.addColorStop(1, 'rgba(0,240,255,0)');
      ctx.fillStyle = coneFill;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, dr.scanRadius, -0.35, 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Drone body
      ctx.save();
      ctx.translate(dr.x, dr.y);
      ctx.fillStyle   = '#d0e8f0';
      ctx.strokeStyle = isFacialActive ? '#00f0ff' : '#335566';
      ctx.lineWidth   = 1;
      ctx.shadowColor = isFacialActive ? '#00f0ff' : 'transparent';
      ctx.shadowBlur  = isFacialActive ? 4 : 0;
      ctx.beginPath();
      ctx.moveTo(0, -5); ctx.lineTo(-4, 5); ctx.lineTo(4, 5);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Rotors
      ctx.strokeStyle = 'rgba(0,240,255,0.4)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i + t * 8;
        ctx.beginPath();
        ctx.arc(0, 0, 4, a, a + 0.6);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    // 4 — Patrol Cruisers
    this.actors.cruisers.forEach(cr => {
      const isRed = cr.sirenTick < 14;
      const beaconColor = isRed ? '#ff0055' : '#00f0ff';

      // Siren radius pulse
      if (cr.sirenRadius > 0) {
        ctx.fillStyle = `rgba(${isRed ? '255,0,85' : '0,240,255'},${0.06 * (1 - cr.sirenRadius / 22)})`;
        ctx.beginPath();
        ctx.arc(cr.x, cr.y, cr.sirenRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vehicle body
      ctx.fillStyle   = '#cce8f0';
      ctx.strokeStyle = '#1a3344';
      ctx.lineWidth   = 0.8;
      ctx.fillRect(cr.x - 6, cr.y - 3, 12, 6);
      ctx.strokeRect(cr.x - 6, cr.y - 3, 12, 6);

      // Beacon light
      ctx.fillStyle  = beaconColor;
      ctx.shadowColor = beaconColor;
      ctx.shadowBlur  = 8;
      ctx.fillRect(cr.x - 2, cr.y - 2, 4, 4);
      ctx.shadowBlur = 0;
    });

    // 5 — Smoke particles
    this.actors.smokeParticles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha * 0.8;
      ctx.fillStyle = '#7a8a94';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawProtests() {
    const ctx = this.ctx;
    for (const id in this.state.districts) {
      const d  = this.state.districts[id];
      const c  = this.dc(d);
      if (d.unrest < 42) continue;

      const count = Math.floor((d.unrest - 42) / 4);
      ctx.save();
      for (let i = 0; i < count; i++) {
        const angle  = i * 1.48 + this.pulseAlpha * 1.2;
        const radius = 18 + Math.sin(i * 7.3 + this.pulseAlpha) * 13;
        const px     = c.x + Math.cos(angle) * radius;
        const py     = c.y + Math.sin(angle) * radius;

        // Torch flare
        const flicker = 0.5 + 0.5 * Math.abs(Math.sin(Date.now() * 0.008 + i));
        ctx.fillStyle   = `rgba(255,0,85,${flicker * 0.9})`;
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur  = 6 * flicker;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  drawRain() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(100,180,220,0.12)';
    ctx.lineWidth   = 0.8;
    ctx.beginPath();
    this.actors.rainDrops.forEach(r => {
      ctx.globalAlpha = r.alpha;
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - r.length * 0.12, r.y + r.length);
    });
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  drawHeatmaps() {
    for (const id in this.state.districts) {
      const d = this.state.districts[id];
      const c = this.dc(d);
      const radius = 45 + d.unrest * 1.5;
      const grad   = this.ctx.createRadialGradient(c.x, c.y, 4, c.x, c.y, radius);
      grad.addColorStop(0, `rgba(255,0,85,${d.unrest / 200})`);
      grad.addColorStop(0.5, `rgba(255,0,85,${d.unrest / 520})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawCoverage() {
    const ctx = this.ctx;
    for (const id in this.state.districts) {
      const d      = this.state.districts[id];
      const c      = this.dc(d);
      const radius = 28 + d.surveillance * 1.9;
      ctx.strokeStyle = 'rgba(0,240,255,0.11)';
      ctx.lineWidth   = 1;
      ctx.setLineDash([5, 9]);
      ctx.beginPath();
      ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(0,240,255,0.012)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawSweep() {
    if (!this.state.tools.facial_sweep.active && !this.state.tools.anomaly_alerts.active) return;
    this.scanSweepAngle += 0.014;
    const cx  = this.canvas.width  * 0.5;
    const cy  = this.canvas.height * 0.5;
    const r   = Math.min(this.canvas.width, this.canvas.height) * 0.44;
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.scanSweepAngle);
    const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, r);
    grad.addColorStop(0, 'rgba(0,240,255,0)');
    grad.addColorStop(0.85, 'rgba(0,240,255,0.007)');
    grad.addColorStop(1, 'rgba(0,240,255,0.045)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, -0.45, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,240,255,0.22)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r, 0);
    ctx.stroke();
    ctx.restore();
  }

  drawDistrictNodeBases() {
    const ctx = this.ctx;
    this.pulseAlpha += 0.011 * this.pulseDir;
    if (this.pulseAlpha >= 0.85) { this.pulseAlpha = 0.85; this.pulseDir = -1; }
    if (this.pulseAlpha <= 0.15) { this.pulseAlpha = 0.15; this.pulseDir =  1; }

    for (const id in this.state.districts) {
      const d     = this.state.districts[id];
      const c     = this.dc(d);
      const sel   = id === this.selectedDistrictId;
      const hover = id === this.hoveredDistrictId;

      let nodeColor = d.color;
      if (d.unrest > 55) nodeColor = '#ff0055';
      else if (d.unrest > 35) {
        // Interpolate toward warning amber
        const t = (d.unrest - 35) / 20;
        nodeColor = `rgba(255,${Math.floor(185 - 185 * t)},0,0.9)`;
      }

      ctx.save();

      // Outer glow ring (selected / alert)
      if (sel || d.unrest > 55) {
        ctx.strokeStyle = sel ? '#00f0ff' : '#ff0055';
        ctx.lineWidth   = sel ? 2 : 1.5;
        ctx.setLineDash([4, 10]);
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      } else if (hover) {
        ctx.strokeStyle = 'rgba(0,240,255,0.45)';
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 25, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Inner command ring
      ctx.strokeStyle = sel ? nodeColor : 'rgba(20,44,66,0.95)';
      ctx.lineWidth   = sel ? 2 : 1.2;
      ctx.shadowColor = nodeColor;
      ctx.shadowBlur  = sel ? 8 : 2;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Core dot
      ctx.fillStyle  = nodeColor;
      ctx.shadowBlur = sel ? 14 : 5;
      ctx.beginPath();
      ctx.arc(c.x, c.y, sel ? 6 : 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Compliance arc (clockwise progress ring)
      const comp   = d.compliance / 100;
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * comp);
      ctx.stroke();

      // Anomaly triangles orbiting district
      d.anomalies.forEach((a, i) => {
        const ang  = (Math.PI * 2 / Math.max(1, d.anomalies.length)) * i + this.scanSweepAngle * 0.6;
        const dist = 30;
        const ax   = c.x + Math.cos(ang) * dist;
        const ay   = c.y + Math.sin(ang) * dist;

        ctx.fillStyle   = '#ffb900';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth   = 1;
        ctx.shadowColor = '#ffb900';
        ctx.shadowBlur  = 5 * this.pulseAlpha;
        ctx.beginPath();
        ctx.moveTo(ax, ay - 5);
        ctx.lineTo(ax - 5, ay + 4);
        ctx.lineTo(ax + 5, ay + 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // District name label
      ctx.font      = `bold ${sel ? 11 : 10}px "Share Tech Mono", monospace`;
      ctx.fillStyle = sel ? '#ffffff' : '#6a8ea6';
      ctx.shadowColor = nodeColor;
      ctx.shadowBlur  = sel ? 4 : 0;
      const label   = d.name.toUpperCase();
      const lw      = ctx.measureText(label).width;
      ctx.fillText(label, c.x - lw / 2, c.y - 27);
      ctx.shadowBlur = 0;

      // Compact metric badge (below node)
      if (sel || hover) {
        const badge = `C:${Math.round(d.compliance)}%  U:${Math.round(d.unrest)}%  S:${Math.round(d.surveillance)}%`;
        ctx.font      = '9px "Share Tech Mono", monospace';
        ctx.fillStyle = 'rgba(0,240,255,0.7)';
        ctx.fillText(badge, c.x - ctx.measureText(badge).width / 2, c.y + 33);
      }

      ctx.restore();
    }
  }

  /* ─── Main Render ───────────────────────────────────────────────── */

  render() {
    this.updateActors();

    // Background
    this.ctx.fillStyle = '#04060a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawDistrictGlow();   // ambient light pools
    this.drawRiver();
    this.drawRoads();
    this.drawMaglevRails();

    // Mode overlays beneath buildings
    if (this.mapMode === 'heatmap') this.drawHeatmaps();
    else if (this.mapMode === 'coverage') this.drawCoverage();

    this.drawBuildings();
    this.drawPolicyOverlays();
    this.drawProtests();
    this.drawActors();
    this.drawSweep();
    this.drawDistrictNodeBases();
    this.drawRain();
  }
}
