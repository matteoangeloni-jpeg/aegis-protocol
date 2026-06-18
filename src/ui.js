/**
 * Aegis Protocol - UI Rendering, Dialogues, and Web Audio Synth
 */

import { getEndScreenContent } from './events.js';

// Procedural audio synthesizer using Web Audio API
export class SynthAudio {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playType() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      // High pitched chirp
      osc.frequency.setValueAtTime(900 + Math.random() * 300, this.audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.012, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio block or error
    }
  }

  playToggle(on = true) {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      if (on) {
        osc.frequency.setValueAtTime(350, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(520, this.audioCtx.currentTime + 0.08);
      } else {
        osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(260, this.audioCtx.currentTime + 0.08);
      }
      
      gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  playAlarm() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, this.audioCtx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.4);
    } catch (e) {}
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(554, this.audioCtx.currentTime + 0.08);
      osc.frequency.setValueAtTime(659, this.audioCtx.currentTime + 0.16);
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime + 0.24);
      
      gain.gain.setValueAtTime(0.025, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.45);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.45);
    } catch (e) {}
  }
}

export const synthAudio = new SynthAudio();

/**
 * Core UI Controller Class
 */
export class GameUI {
  constructor(simulationInstance) {
    this.sim = simulationInstance;
    
    // Bind elements
    this.elements = {
      complianceText: document.getElementById('metricCompliance'),
      complianceBar: document.getElementById('barCompliance'),
      trustText: document.getElementById('metricTrust'),
      trustBar: document.getElementById('barTrust'),
      efficiencyText: document.getElementById('metricEfficiency'),
      efficiencyBar: document.getElementById('barEfficiency'),
      credits: document.getElementById('creditsValue'),
      avgRisk: document.getElementById('avgRiskValue'),
      gameTime: document.getElementById('gameTime'),
      threatLevel: document.getElementById('threatLevel'),
      ticker: document.getElementById('headerTicker'),
      
      // Dynamic lists
      terminalLogs: document.getElementById('terminalLogs'),
      incidentsList: document.getElementById('incidentsList'),
      
      // Dialogue
      dialogueBox: document.getElementById('dialogueBox'),
      dialoguePrompt: document.getElementById('dialoguePrompt'),
      dialogueChoices: document.getElementById('dialogueChoices'),

      // Sparkline chart
      sparklineCanvas: document.getElementById('sparklineCanvas'),
      
      // End game
      endScreen: document.getElementById('endScreen'),
      endTitle: document.getElementById('endTitle'),
      endBody: document.getElementById('endBody'),
      endMetrics: document.getElementById('endMetrics'),
      btnRestart: document.getElementById('btnRestart'),
      
      // Telemetry
      telGridEmpty: document.querySelector('.tel-grid-empty'),
      telGridContent: document.getElementById('telGridContent'),
      telName: document.getElementById('telName'),
      telUnrest: document.getElementById('telUnrest'),
      telSurveillance: document.getElementById('telSurveillance'),
      telFriction: document.getElementById('telFriction')
    };

    // Text writer memory
    this.typingQueue = [];
    this.isTyping = false;

    // Keyboard shortcut: press 1/2/3 to select dialogue choice
    window.addEventListener('keydown', e => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 3 && !this.elements.dialogueBox.classList.contains('hidden')) {
        const btns = this.elements.dialogueChoices.querySelectorAll('.choice-btn');
        if (btns[n - 1]) btns[n - 1].click();
      }
    });
  }

  updateMetrics() {
    const el = this.elements;
    
    // Compliance
    el.complianceText.textContent = `${this.sim.globalCompliance}%`;
    el.complianceBar.style.width = `${this.sim.globalCompliance}%`;
    
    // Trust
    el.trustText.textContent = `${this.sim.globalTrust}%`;
    el.trustBar.style.width = `${this.sim.globalTrust}%`;
    
    // Efficiency
    el.efficiencyText.textContent = `${this.sim.globalEfficiency}%`;
    el.efficiencyBar.style.width = `${this.sim.globalEfficiency}%`;

    // System alarm bars if dangerously low
    this.toggleBarAlert(el.trustBar, this.sim.globalTrust < 30);
    this.toggleBarAlert(el.efficiencyBar, this.sim.globalEfficiency < 35);
    this.toggleBarAlert(el.complianceBar, this.sim.globalCompliance < 15);
    
    // Credits & Risk values
    el.credits.textContent = this.sim.credits;
    el.avgRisk.textContent = `${this.sim.globalRisk}%`;
    
    // Game Clock
    el.gameTime.textContent = this.sim.formatTime(this.sim.gameTime);

    // Dynamic Regime Threat Labels
    if (this.sim.globalRisk > 60 || this.sim.globalTrust < 30) {
      el.threatLevel.textContent = 'CRITICAL THREAT';
      el.threatLevel.className = 'status-value threat-high';
    } else if (this.sim.globalRisk > 35) {
      el.threatLevel.textContent = 'MUTINOUS';
      el.threatLevel.className = 'status-value threat-med';
    } else {
      el.threatLevel.textContent = 'STABLE';
      el.threatLevel.className = 'status-value threat-low';
    }

    // Regime sparkline chart
    this.drawSparklines();
  }

  toggleBarAlert(barEl, isLow) {
    if (isLow) {
      barEl.classList.remove('bar-cyan', 'bar-green', 'bar-yellow');
      barEl.classList.add('bar-red');
    } else {
      barEl.classList.remove('bar-red');
      if (barEl.id === 'barCompliance') barEl.classList.add('bar-cyan');
      if (barEl.id === 'barTrust')      barEl.classList.add('bar-green');
      if (barEl.id === 'barEfficiency') barEl.classList.add('bar-yellow');
    }
  }

  /**
   * Draw a multi-line sparkline chart of the last 60s regime telemetry
   */
  drawSparklines() {
    const canvas = this.elements.sparklineCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W   = canvas.width;
    const H   = canvas.height;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = '#0d1c2a';
    ctx.lineWidth = 0.5;
    for (let y = 0; y <= H; y += H / 4) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const hist = this.sim.history;
    const series = [
      { data: hist.compliance, color: '#00f0ff', label: 'COMP' },
      { data: hist.trust,      color: '#39ff14', label: 'TRUST' },
      { data: hist.efficiency, color: '#ffb900', label: 'EFF' },
    ];

    series.forEach(s => {
      if (!s.data || s.data.length < 2) return;
      const pts = s.data;
      const n   = pts.length;
      ctx.strokeStyle = s.color;
      ctx.lineWidth   = 1.2;
      ctx.shadowColor = s.color;
      ctx.shadowBlur  = 3;
      ctx.beginPath();
      pts.forEach((v, i) => {
        const x = (i / (Math.max(n - 1, 1))) * W;
        const y = H - (v / 100) * (H - 4) - 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Label on right edge
      const last = pts[pts.length - 1];
      const lx   = W - 2;
      const ly   = H - (last / 100) * (H - 4) - 2;
      ctx.fillStyle   = s.color;
      ctx.font        = '7px monospace';
      ctx.textAlign   = 'right';
      ctx.fillText(`${s.label} ${Math.round(last)}%`, lx, Math.max(ly, 8));
      ctx.textAlign   = 'left';
    });
  }

  updateSelectedDistrictTelemetry(districtId) {
    const el = this.elements;
    
    if (!districtId) {
      el.telGridEmpty.classList.remove('hidden');
      el.telGridContent.classList.add('hidden');
      return;
    }

    const d = this.sim.districts[districtId];
    if (d) {
      el.telGridEmpty.classList.add('hidden');
      el.telGridContent.classList.remove('hidden');

      el.telName.textContent = d.name.toUpperCase();
      el.telUnrest.textContent = `${Math.round(d.unrest)}%`;
      el.telSurveillance.textContent = `${Math.round(d.surveillance)}%`;
      el.telFriction.textContent = `${Math.round(d.friction)}%`;
      
      // Update text color of unrest to represent danger
      if (d.unrest > 70) {
        el.telUnrest.className = 'tel-value text-red warning-blink';
      } else if (d.unrest > 40) {
        el.telUnrest.className = 'tel-value text-yellow';
      } else {
        el.telUnrest.className = 'tel-value text-green';
      }
    }
  }

  // Logs terminal messages
  logTerminalMessage(sender, text) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const time = this.sim.formatTime(this.sim.gameTime);
    
    let senderName = 'SYSTEM';
    let senderClass = 'sender-system';
    
    if (sender === 'ministry') {
      senderName = 'MINISTRY';
      senderClass = 'sender-ministry';
    } else if (sender === 'lumen') {
      senderName = 'LUMEN // HACK';
      senderClass = 'sender-lumen';
    } else if (sender === 'warning') {
      senderName = 'ALERT';
      senderClass = 'sender-warning';
    }

    entry.innerHTML = `
      <span class="log-time">[${time}]</span>
      <span class="log-sender ${senderClass}">${senderName}:</span>
      <span class="log-text"></span>
    `;
    
    this.elements.terminalLogs.appendChild(entry);
    this.elements.terminalLogs.scrollTop = this.elements.terminalLogs.scrollHeight;
    
    const textSpan = entry.querySelector('.log-text');
    this.queueTyping(textSpan, text);
  }

  // Queue writing letters for realistic terminal flow
  queueTyping(targetEl, text) {
    this.typingQueue.push({ el: targetEl, text, idx: 0 });
    this.processTyping();
  }

  processTyping() {
    if (this.isTyping || this.typingQueue.length === 0) return;
    
    this.isTyping = true;
    const task = this.typingQueue[0];
    
    const interval = setInterval(() => {
      if (task.idx < task.text.length) {
        task.el.textContent += task.text[task.idx];
        task.idx++;
        
        // Random typing sound chirp
        if (Math.random() < 0.25) {
          synthAudio.playType();
        }
      } else {
        clearInterval(interval);
        this.typingQueue.shift();
        this.isTyping = false;
        this.processTyping();
      }
    }, 15);
  }

  drawAvatar(sender) {
    const canvas = document.getElementById('avatarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    // Clear background
    ctx.fillStyle = '#030508';
    ctx.fillRect(0, 0, w, h);
    
    // Grid lines
    ctx.strokeStyle = '#0c1522';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 10) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, x); ctx.lineTo(w, x); ctx.stroke();
    }
    
    if (sender === 'ministry') {
      // Ministry Agent: Sleek dark blue helmet, cyan glowing visor
      ctx.fillStyle = '#102235';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      
      // Shoulders
      ctx.beginPath();
      ctx.moveTo(10, h);
      ctx.quadraticCurveTo(15, h - 22, 20, h - 24);
      ctx.lineTo(w - 20, h - 24);
      ctx.quadraticCurveTo(w - 15, h - 22, w - 10, h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Helmet head
      ctx.beginPath();
      ctx.arc(w / 2, 23, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Visor
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.fillRect(w / 2 - 8, 20, 16, 4);
      ctx.shadowBlur = 0;
    } else if (sender === 'lumen') {
      // Hacker Lumen: dark green hood, neon green glitch visor
      ctx.fillStyle = '#142a18';
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 1.5;
      
      // Hood
      ctx.beginPath();
      ctx.moveTo(10, h);
      ctx.quadraticCurveTo(10, 12, w / 2, 8);
      ctx.quadraticCurveTo(w - 10, 12, w - 10, h);
      ctx.lineTo(w - 20, h);
      ctx.quadraticCurveTo(w / 2, 24, 20, h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Mask Face inside
      ctx.fillStyle = '#041006';
      ctx.beginPath();
      ctx.arc(w / 2, 30, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Glitch neon eyes
      ctx.fillStyle = '#39ff14';
      ctx.shadowColor = '#39ff14';
      ctx.shadowBlur = 6;
      ctx.fillRect(w / 2 - 5, 27, 3, 2);
      ctx.fillRect(w / 2 + 2, 27, 3, 2);
      ctx.fillRect(w / 2 - 3, 33, 6, 1);
      ctx.shadowBlur = 0;
    } else if (sender === 'warning') {
      // Warning Alert: Blinking red hazard triangle
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(w / 2, 10);
      ctx.lineTo(10, h - 12);
      ctx.lineTo(w - 10, h - 12);
      ctx.closePath();
      ctx.stroke();
      
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 8;
      ctx.fillRect(w / 2 - 1.5, 20, 3, 14);
      ctx.fillRect(w / 2 - 1.5, 38, 3, 3);
      ctx.shadowBlur = 0;
    } else {
      // System: Rotating radar/gear
      ctx.strokeStyle = '#ffb900';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255, 185, 0, 0.1)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2);
      ctx.lineTo(w / 2 + 14, h / 2 - 14);
      ctx.stroke();
    }
  }

  showDialogue(dialogueObj, onChoiceSelected) {
    const el = this.elements;
    
    el.dialogueBox.classList.remove('hidden');
    el.dialoguePrompt.textContent = '';
    el.dialogueChoices.innerHTML = '';
    
    // Set sender name
    const senderNameEl = document.getElementById('dialogueSenderName');
    if (senderNameEl) {
      senderNameEl.textContent = dialogueObj.sender === 'lumen' ? 'LUMEN // HACK' : dialogueObj.sender.toUpperCase();
    }
    
    // Draw vector profile card
    this.drawAvatar(dialogueObj.sender);
    
    // Pause game or lower speed during story event decision
    // (Helps player think, but doesn't fully freeze simulation if they want to pause manually)
    synthAudio.playAlarm();

    // Type prompt
    this.queueTyping(el.dialoguePrompt, dialogueObj.prompt);

    // Build choices
    dialogueObj.choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `
        <span class="choice-key">[KEY_${index + 1}]</span>
        <span class="choice-text">${choice.text}</span>
      `;
      
      btn.addEventListener('click', () => {
        synthAudio.playToggle(true);
        el.dialogueBox.classList.add('hidden');
        
        // Run effect
        const logResult = choice.effect(this.sim);
        this.logTerminalMessage(dialogueObj.sender, logResult);
        
        // Callback
        onChoiceSelected();
      });

      el.dialogueChoices.appendChild(btn);
    });
  }

  updateIncidentTicker() {
    const el = this.elements;
    el.incidentsList.innerHTML = '';

    if (this.sim.incidents.length === 0) {
      el.incidentsList.innerHTML = '<div class="incident-item no-incidents">SYSTEM OPERATING WITHIN TOLERANCE. NO ACTIVE THREATS.</div>';
      return;
    }

    // Populate incidents
    this.sim.incidents.forEach(inc => {
      const item = document.createElement('div');
      item.className = `incident-item ${inc.severity === 'error' ? 'active-threat' : ''}`;
      
      const icon = inc.severity === 'error' ? '▲' : '◆';
      
      item.innerHTML = `
        <span class="${inc.severity === 'error' ? 'text-red warning-blink' : 'text-cyan'}">${icon} ${inc.code}</span>
        <span>${inc.text} (${inc.time})</span>
      `;
      
      el.incidentsList.appendChild(item);
    });
  }

  showEndGameScreen(reason) {
    const el = this.elements;
    const content = getEndScreenContent(reason, this.sim);

    el.endTitle.textContent = content.title;
    el.endBody.textContent = content.body;
    el.endMetrics.innerHTML = '';

    content.metrics.forEach(m => {
      const cell = document.createElement('div');
      cell.className = 'end-metric-item';
      cell.innerHTML = `
        <span class="end-metric-lbl">${m.label}</span>
        <span class="end-metric-val">${m.value}</span>
      `;
      el.endMetrics.appendChild(cell);
    });

    // Color theme matching ending
    if (reason.startsWith('VICTORY')) {
      el.endScreen.style.borderColor = 'var(--color-green)';
      el.endScreen.querySelector('.warning-glow').textContent = '▲ PROTOCOL COMPLETED ▲';
      el.endScreen.querySelector('.warning-glow').className = 'warning-glow text-green';
      synthAudio.playSuccess();
    } else {
      el.endScreen.style.borderColor = 'var(--color-red)';
      el.endScreen.querySelector('.warning-glow').textContent = '▲ REGIME CRITICAL FAIL ▲';
      el.endScreen.querySelector('.warning-glow').className = 'warning-glow text-red warning-blink';
      synthAudio.playAlarm();
    }

    el.endScreen.classList.remove('hidden');
  }

  hideEndGameScreen() {
    this.elements.endScreen.classList.add('hidden');
  }
}
