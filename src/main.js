/**
 * Aegis Protocol - Main Entry Orchestrator
 */

import { CitySimulation, DISTRICTS } from './simulation.js';
import { TacticalMap } from './map.js';
import { renderToolsList } from './tools.js';
import { GameUI, synthAudio } from './ui.js';
import { checkNarrativeEvents } from './events.js';
import { generateCitizenProfile, openDossierModal, closeDossierModal } from './dossier.js';

class GameOrchestrator {
  constructor() {
    this.sim = new CitySimulation();
    this.ui = new GameUI(this.sim);
    this.map = null;
    
    this.lastTickTime = 0;
    this.selectedDistrictId = null;
    this.tickInterval = 1000; // 1s default
    this.animationFrameId = null;
    
    this.init();
  }

  init() {
    // 1. Initialize Tactical Canvas Map
    this.map = new TacticalMap(
      'cityCanvas',
      this.sim,
      (districtId) => this.handleDistrictSelected(districtId),
      (civilian)   => this.handleCivilianSelected(civilian)
    );

    // 2. Setup HUD Button Actions
    this.bindEvents();

    // 3. Render Governance Tools list
    this.updateToolsList();

    // 4. Print initial system logs
    this.runSystemBootSequence();

    // 5. Start Game Loop
    this.lastTickTime = performance.now();
    this.loop();
  }

  bindEvents() {
    const el = this.ui.elements;

    // Time speed adjustments
    document.getElementById('btnSpeed0').addEventListener('click', (e) => this.setGameSpeed(0, e.target));
    document.getElementById('btnSpeed1').addEventListener('click', (e) => this.setGameSpeed(1, e.target));
    document.getElementById('btnSpeed2').addEventListener('click', (e) => this.setGameSpeed(2, e.target));

    // Canvas overlay tab switches
    document.getElementById('mapTabTactical').addEventListener('click', (e) => this.setMapMode('tactical', e.target));
    document.getElementById('mapTabHeatmap').addEventListener('click', (e) => this.setMapMode('heatmap', e.target));
    document.getElementById('mapTabCoverage').addEventListener('click', (e) => this.setMapMode('coverage', e.target));
    document.getElementById('mapTabEnergy').addEventListener('click', (e) => this.setMapMode('energy', e.target));

    // Restart game listener
    el.btnRestart.addEventListener('click', () => this.handleRestart());

    // Dossier close button
    const dosClose = document.getElementById('dosCloseBtn');
    if (dosClose) dosClose.addEventListener('click', () => closeDossierModal());

    // Escape closes dossier
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDossierModal();
    });

    // Developer tool for fast testing (~ key)
    window.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~') {
        this.toggleDevAutoplay();
      }
    });
    
    // First user click boots Audio Context due to browser safety rules
    window.addEventListener('click', () => {
      synthAudio.init();
    }, { once: true });
  }

  runSystemBootSequence() {
    this.ui.logTerminalMessage('system', 'SECURE HOST KERNEL INITIALIZED.');
    setTimeout(() => {
      this.ui.logTerminalMessage('system', 'LINKING METROPOLITAN SENSOR ARRAY [APEX-GRID-01] [FRINGE-CONE-04]... ESTABLISHED.');
    }, 1200);
    setTimeout(() => {
      this.ui.logTerminalMessage('system', 'DEPLOYNIG METRIC REGISTRY. AUTOMATED CRITERIA FILTERS STANDING BY.');
    }, 2500);
  }

  setGameSpeed(speed, clickedBtn) {
    synthAudio.playToggle(speed > 0);
    
    // Adjust speeds: 0 (Pause), 1 (1x), 2 (2x)
    this.sim.currentSpeed = speed;
    
    // Update active class on HUD
    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
    if (clickedBtn) {
      clickedBtn.classList.add('active');
    }

    if (speed === 0) {
      this.ui.logTerminalMessage('system', 'AEGIS TICK ENGINE PAUSED.');
    } else {
      this.ui.logTerminalMessage('system', `AEGIS TICK ENGINE RUNNING AT ${speed}X SPEED.`);
    }
  }

  setMapMode(mode, clickedTab) {
    synthAudio.playToggle(true);
    
    this.map.setMapMode(mode);
    
    document.querySelectorAll('.map-tab').forEach(tab => tab.classList.remove('active'));
    if (clickedTab) {
      clickedTab.classList.add('active');
    }
  }

  handleDistrictSelected(districtId) {
    synthAudio.playToggle(true);
    this.selectedDistrictId = districtId;
    this.map.setSelectedDistrict(districtId);
    this.ui.updateSelectedDistrictTelemetry(districtId);
    const indicator = document.getElementById('selectedDistrictName');
    if (indicator) {
      const d = this.sim.districts[districtId];
      indicator.textContent = d ? d.name.toUpperCase() : 'NO DISTRICT SELECTED';
    }
  }

  handleCivilianSelected(civilian) {
    synthAudio.playToggle(true);
    const profile = generateCitizenProfile(civilian, this.sim);
    openDossierModal(profile);
    // Log to terminal
    this.ui.logTerminalMessage('system', `CITIZEN FILE ACCESSED: ${profile.citizenId} — RISK ${profile.tier.label}`);
  }

  updateToolsList() {
    const listContainer = document.getElementById('toolsList');
    
    renderToolsList(
      listContainer,
      this.sim,
      (toolId) => this.handleToolToggle(toolId),
      (toolId, value) => this.handleToolSlider(toolId, value)
    );
  }

  handleToolToggle(toolId) {
    const isNowActive = this.sim.toggleTool(toolId);
    synthAudio.playToggle(isNowActive);
    
    // Terminal logging for realism
    const toolName = this.sim.tools[toolId].name;
    const actionText = isNowActive ? 'INITIALIZED // ACTIVE' : 'TERMINATED // SYSTEM DEACTIVATED';
    this.ui.logTerminalMessage('system', `Module [${toolName.toUpperCase()}] ${actionText}.`);

    // Redraw list to disable sliders if off
    this.updateToolsList();
    this.ui.updateMetrics();
  }

  handleToolSlider(toolId, val) {
    this.sim.setToolValue(toolId, val);
  }

  handleRestart() {
    synthAudio.playSuccess();
    
    this.sim.reset();
    this.selectedDistrictId = null;
    
    this.ui.hideEndGameScreen();
    this.ui.elements.terminalLogs.innerHTML = '';
    
    this.map.setSelectedDistrict(null);
    this.ui.updateSelectedDistrictTelemetry(null);
    const indicator = document.getElementById('selectedDistrictName');
    if (indicator) indicator.textContent = 'NO DISTRICT SELECTED';
    
    this.updateToolsList();
    this.runSystemBootSequence();
    
    // Reset speeds
    this.setGameSpeed(1, document.getElementById('btnSpeed1'));
    
    this.lastTickTime = performance.now();
  }

  // Developer Fast play testing mode
  toggleDevAutoplay() {
    if (this.isDevMode) {
      this.isDevMode = false;
      this.tickInterval = 1000;
      this.ui.logTerminalMessage('system', 'DEV TESTING OVERRIDE COMPLETED. RETURNING TO 1X TICK SCALE.');
    } else {
      this.isDevMode = true;
      this.tickInterval = 100; // 10x faster ticks
      this.ui.logTerminalMessage('system', 'WARNING: DEVELOPER CRON OVERRIDE TRIGGERED. SIMULATION MULTIPLIER x10.');
    }
  }

  loop() {
    // 1. Draw Map (Runs at 60 FPS)
    this.map.render();
    
    // 2. Ticks checks
    const now = performance.now();
    const elapsed = now - this.lastTickTime;
    
    // Adjust target time based on simulation speeds (and skip if paused)
    if (this.sim.currentSpeed > 0 && !this.sim.activeDialogue) {
      const speedMultiplier = this.sim.currentSpeed;
      const targetInterval = this.tickInterval / speedMultiplier;
      
      if (elapsed >= targetInterval) {
        this.lastTickTime = now;
        this.tick();
      }
    } else {
      // Keep last tick sliding during paused states to prevent immediate jump on resume
      this.lastTickTime = now - Math.min(elapsed, this.tickInterval);
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  tick() {
    // Ticks state values
    this.sim.tick();

    // Redraw Telemetry
    this.ui.updateSelectedDistrictTelemetry(this.selectedDistrictId);

    // Sync metrics dashboard
    this.ui.updateMetrics();

    // Check story checkpoints
    const narrativeEvent = checkNarrativeEvents(this.sim);
    if (narrativeEvent) {
      // Pause timeline tick and display choices dialog
      this.ui.showDialogue(narrativeEvent, () => {
        // Choice selection callback
        this.sim.activeDialogue = null;
        this.ui.updateMetrics();
        this.updateToolsList();
      });
    }

    // Incidents update
    this.ui.updateIncidentTicker();

    // Check game concluded
    if (this.sim.isGameOver) {
      cancelAnimationFrame(this.animationFrameId);
      this.ui.showEndGameScreen(this.sim.gameOverReason);
    }
  }
}

// Bootstrap application on load
window.addEventListener('DOMContentLoaded', () => {
  new GameOrchestrator();
});
