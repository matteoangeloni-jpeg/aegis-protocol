import { getActiveLanguage, t } from './i18n.js';

export const DISTRICTS = {
  APEX: 'apex',
  HUB: 'hub',
  FOUNDRY: 'foundry',
  FRINGE: 'fringe'
};

export class CitySimulation {
  constructor() {
    this.reset();
  }

  reset(profile = 'standard') {
    this.gameTime = 0; // in seconds
    this.currentSpeed = 1; // 0 = pause, 1 = 1x, 2 = 2x
    this.selectedProfile = profile;
    
    if (profile === 'iron_shield') {
      this.credits = 350;
      this.globalCompliance = 45;
      this.globalTrust = 60;
      this.globalEfficiency = 80;
      this.globalRisk = 25;
    } else if (profile === 'neural_test') {
      this.credits = 800;
      this.globalCompliance = 20;
      this.globalTrust = 85;
      this.globalEfficiency = 90;
      this.globalRisk = 30;
    } else { // standard
      this.credits = 500;
      this.globalCompliance = 30;
      this.globalTrust = 75;
      this.globalEfficiency = 85;
      this.globalRisk = 15;
    }
    
    // Narrative flags
    this.whistleblowerProgress = 0; // 0 to 100
    this.storyTimeline = 0; // step count
    this.completedDirectives = 0;
    this.leakSecurityKeys = false;
    this.activeDialogue = null;
    this.isGameOver = false;
    this.gameOverReason = '';

    // District States
    this.districts = {
      [DISTRICTS.APEX]: {
        id: DISTRICTS.APEX,
        name: 'Apex Heights',
        description: 'Elite residential sector, glass skyscrapers, corporate boardrooms. Demands total service efficiency.',
        population: 80000,
        unrest: 5,        // 0-100%
        compliance: 40,   // 0-100%
        friction: 5,      // 0-100% (inherent tension modifier)
        surveillance: 35, // 0-100%
        efficiency: 95,   // 0-100%
        anomalies: [],    // active anomaly objects
        x: 0.5,           // relative canvas coords (center-ish top)
        y: 0.25,
        color: '#00f0ff'
      },
      [DISTRICTS.HUB]: {
        id: DISTRICTS.HUB,
        name: 'Nexus Transit Hub',
        description: 'Central rail nodes, sub-sectors, high commute flow. Critical congestion bottleneck.',
        population: 250000,
        unrest: 10,
        compliance: 35,
        friction: 8,
        surveillance: 40,
        efficiency: 90,
        anomalies: [],
        x: 0.45,
        y: 0.55,
        color: '#39ff14'
      },
      [DISTRICTS.FOUNDRY]: {
        id: DISTRICTS.FOUNDRY,
        name: 'Foundry Rows',
        description: 'Manufacturing belt, processing yards, union halls. Prone to industrial action.',
        population: 180000,
        unrest: 15,
        compliance: 28,
        friction: 12,
        surveillance: 20,
        efficiency: 80,
        anomalies: [],
        x: 0.72,
        y: 0.7,
        color: '#ffb900'
      },
      [DISTRICTS.FRINGE]: {
        id: DISTRICTS.FRINGE,
        name: 'Outland Fringe',
        description: 'Under-resourced slums, makeshift housing, active grassroots citizen opposition.',
        population: 320000,
        unrest: 30,
        compliance: 15,
        friction: 25,
        surveillance: 10,
        efficiency: 65,
        anomalies: [],
        x: 0.22,
        y: 0.75,
      }
    };

    // Apply profile modifications to districts
    if (profile === 'iron_shield') {
      for (const id in this.districts) {
        this.districts[id].compliance = Math.min(100, this.districts[id].compliance + 15);
        this.districts[id].unrest = Math.max(0, this.districts[id].unrest - 5);
      }
    } else if (profile === 'neural_test') {
      for (const id in this.districts) {
        this.districts[id].unrest = Math.min(100, this.districts[id].unrest + 20);
        this.districts[id].compliance = Math.max(0, this.districts[id].compliance - 10);
      }
    }

    // Tools Configuration
    // State represents active (true/false) and value represents slider value (0-100) or severity
    this.tools = {
      facial_sweep: { id: 'facial_sweep', name: 'Facial Sweep Scan', active: false, value: 50, cost: 30, text: 'Mass camera biometric verification in selected district. Sweeps database.' },
      predictive_patrols: { id: 'predictive_patrols', name: 'Predictive Patrols', active: false, value: 30, cost: 25, text: 'Deploy algorithmic units to suppress high-risk areas before unrest spikes.' },
      welfare_score: { id: 'welfare_score', name: 'AI Welfare Filter', active: false, value: 50, cost: 15, text: 'Algorithmic exclusion filters for municipal funds. Saves money.' },
      permit_filter: { id: 'permit_filter', name: 'Commuter Gatekeeping', active: false, value: 30, cost: 20, text: 'Restricts transit nodes based on social scoring status.' },
      service_prioritization: { id: 'service_prioritization', name: 'Algorithmic Grid Tiering', active: false, value: 50, cost: 25, text: 'Reroutes energy and medical logistics to districts based on compliance.' },
      social_registry: { id: 'social_registry', name: 'Social Trust Registry', active: false, value: 20, cost: 40, text: 'Direct citizen social credit logging. City-wide compliance driver.' },
      automated_gatekeeping: { id: 'automated_gatekeeping', name: 'District Quarantine Gates', active: false, value: 50, cost: 30, text: 'Physical barriers lock down low-trust districts.' },
      anomaly_alerts: { id: 'anomaly_alerts', name: 'Behavioral Threat Alerts', active: false, value: 50, cost: 10, text: 'Machine-learning detection of divergent movement habits.' }
    };

    this.incidents = [];
    this.whistleblowerChoiceLog = [];
    
    // Track history for telemetry charts
    this.history = {
      compliance: [],
      trust: [],
      efficiency: [],
      risk: []
    };
  }

  // Toggles a tool
  toggleTool(toolId) {
    if (this.tools[toolId]) {
      this.tools[toolId].active = !this.tools[toolId].active;
      return this.tools[toolId].active;
    }
    return false;
  }

  // Sets a tool slider value
  setToolValue(toolId, value) {
    if (this.tools[toolId]) {
      this.tools[toolId].value = value;
    }
  }

  // Master update tick (called once per second of game time)
  tick() {
    if (this.isGameOver) return;

    this.gameTime += 1;

    // 1. Calculate active costs
    let activeCost = 0;
    for (const key in this.tools) {
      if (this.tools[key].active) {
        // Higher slider values increase maintenance costs
        const scale = this.tools[key].value / 50; // normalized around 1
        activeCost += Math.round(this.tools[key].cost * scale);
      }
    }

    // 2. Generate credits based on efficiency
    const creditGeneration = Math.round(50 * (this.globalEfficiency / 100));
    this.credits = Math.max(0, this.credits + creditGeneration - activeCost);

    // 3. Update district metrics based on active tools
    let totalUnrest = 0;
    let totalCompliance = 0;
    let totalEfficiency = 0;
    let totalRisk = 0;

    for (const key in this.districts) {
      const d = this.districts[key];
      this.updateDistrictMetrics(d);
      
      totalUnrest += d.unrest;
      totalCompliance += d.compliance;
      totalEfficiency += d.efficiency;
      totalRisk += d.unrest * 0.5 + d.friction * 0.5; // risk factor
    }

    // 4. Update global indicators
    const distCount = Object.keys(this.districts).length;
    this.globalCompliance = Math.round(totalCompliance / distCount);
    this.globalEfficiency = Math.round(totalEfficiency / distCount);
    
    // Global Risk is average
    this.globalRisk = Math.round(totalRisk / distCount);

    // Public trust calculation: drops when tools are highly invasive, drops when unrest is high
    this.updateGlobalTrust();

    // 5. Generate and process anomalies
    this.processAnomalies();

    // 6. Record history (cap at 60 steps)
    this.history.compliance.push(this.globalCompliance);
    this.history.trust.push(this.globalTrust);
    this.history.efficiency.push(this.globalEfficiency);
    this.history.risk.push(this.globalRisk);
    
    if (this.history.compliance.length > 60) {
      this.history.compliance.shift();
      this.history.trust.shift();
      this.history.efficiency.shift();
      this.history.risk.shift();
    }

    // 7. Check Game Over / Victory Conditions
    this.checkEndStates();
  }

  updateDistrictMetrics(d) {
    // Dynamic modifiers based on active governance tools
    let complianceDelta = -0.5; // Natural decay of compliance
    let unrestDelta = 0.2;       // Natural rise of unrest
    let frictionDelta = 0;       // Natural friction drift
    let surveillanceTarget = 15; // Inherent camera level
    let efficiencyDelta = 0.5;   // Natural recovery of infrastructure

    // Apply tools impacts
    // 1. Facial Recognition Sweeps (increases surveillance + compliance, increases unrest + friction)
    if (this.tools.facial_sweep.active) {
      const intensity = this.tools.facial_sweep.value / 100;
      surveillanceTarget += 40 * intensity;
      complianceDelta += 1.5 * intensity;
      
      // Asymmetric reaction
      if (d.id === DISTRICTS.FRINGE) {
        unrestDelta += 2.0 * intensity;
        frictionDelta += 0.8;
      } else if (d.id === DISTRICTS.FOUNDRY) {
        unrestDelta += 1.0 * intensity;
        frictionDelta += 0.4;
      } else {
        unrestDelta += 0.3 * intensity;
      }
    }

    // 2. Predictive Patrols (suppresses unrest, but increases friction and lowers trust over time)
    if (this.tools.predictive_patrols.active) {
      const intensity = this.tools.predictive_patrols.value / 100;
      unrestDelta -= 2.0 * intensity; // Direct suppression
      complianceDelta += 0.8 * intensity;
      frictionDelta += 0.5 * intensity;
      surveillanceTarget += 15 * intensity;
    }

    // 3. AI Welfare Eligibility Scoring (saves money, boosts efficiency slightly in rich zones, spikes inequality/friction in poor zones)
    if (this.tools.welfare_score.active) {
      const severity = this.tools.welfare_score.value / 100;
      // We reduce cost elsewhere, but here we model the impact on metrics
      if (d.id === DISTRICTS.APEX) {
        efficiencyDelta += 0.3 * severity;
      } else if (d.id === DISTRICTS.FOUNDRY || d.id === DISTRICTS.FRINGE) {
        frictionDelta += 1.2 * severity;
        unrestDelta += 0.8 * severity;
        complianceDelta -= 0.5 * severity;
      }
    }

    // 4. Commuter Gatekeeping (restricts transit, reduces unrest spread, but reduces efficiency)
    if (this.tools.permit_filter.active) {
      const intensity = this.tools.permit_filter.value / 100;
      efficiencyDelta -= 1.0 * intensity; // gridlocks central hubs
      complianceDelta += 0.5 * intensity;
      
      if (d.id === DISTRICTS.HUB) {
        efficiencyDelta -= 1.5 * intensity;
        frictionDelta += 0.8 * intensity;
      }
    }

    // 5. Algorithmic Grid Tiering (reroutes energy/services to high compliance districts)
    if (this.tools.service_prioritization.active) {
      const severity = this.tools.service_prioritization.value / 100;
      
      // We check if this district is compliant.
      if (d.compliance > 50) {
        // Apex/high zones benefit
        efficiencyDelta += 1.2 * severity;
        unrestDelta -= 0.4 * severity;
      } else {
        // Foundry/Fringe suffer
        efficiencyDelta -= 1.8 * severity;
        unrestDelta += 1.5 * severity;
        frictionDelta += 1.0 * severity;
      }
    }

    // 6. Social Trust Registry (city-wide driver of compliance, increases friction everywhere)
    if (this.tools.social_registry.active) {
      const depth = this.tools.social_registry.value / 100;
      complianceDelta += 1.2 * depth;
      frictionDelta += 0.4 * depth;
      
      if (d.id === DISTRICTS.FRINGE) {
        unrestDelta += 0.6 * depth;
      }
    }

    // 7. District Quarantine Gates (physical barrier, suppresses unrest leak, tanks efficiency, increases local friction)
    if (this.tools.automated_gatekeeping.active) {
      const severity = this.tools.automated_gatekeeping.value / 100;
      
      if (d.id === DISTRICTS.FRINGE || d.id === DISTRICTS.FOUNDRY) {
        efficiencyDelta -= 2.0 * severity;
        unrestDelta += 0.5 * severity; // Locked in anger
        frictionDelta += 1.5 * severity;
        complianceDelta += 0.8 * severity; // forced submission
      }
    }

    // 8. Behavioral Threat Alerts (increases surveillance, spots anomalies)
    if (this.tools.anomaly_alerts.active) {
      surveillanceTarget += 10;
      complianceDelta += 0.2;
    }

    // Apply friction to unrest
    unrestDelta += (d.friction * 0.05);

    // Apply surveillance convergence
    d.surveillance += (surveillanceTarget - d.surveillance) * 0.1;

    // Apply deltas with boundary clamping
    d.unrest = Math.min(100, Math.max(0, d.unrest + unrestDelta));
    d.compliance = Math.min(100, Math.max(0, d.compliance + complianceDelta));
    d.friction = Math.min(100, Math.max(0, d.friction + frictionDelta - 0.1)); // natural minor decay of friction
    
    // Efficiency is lowered by unrest
    const unrestImpact = d.unrest * 0.3;
    d.efficiency = Math.min(100, Math.max(0, d.efficiency + efficiencyDelta - (unrestImpact * 0.1)));
  }

  updateGlobalTrust() {
    let trustDelta = 0.5; // Natural slow recovery of trust
    
    // Penalize based on tool active counts and values
    let activeInvasiveCount = 0;
    for (const key in this.tools) {
      const t = this.tools[key];
      if (t.active) {
        // High social registry, face sweep, and welfare exclusion severely dent trust
        if (key === 'social_registry') activeInvasiveCount += 1.5 * (t.value / 50);
        else if (key === 'facial_sweep') activeInvasiveCount += 1.0 * (t.value / 50);
        else if (key === 'welfare_score') activeInvasiveCount += 1.0 * (t.value / 50);
        else activeInvasiveCount += 0.4 * (t.value / 50);
      }
    }

    // Trust penalty is higher if average compliance is low (citizens resist the iron fist)
    const complianceFactor = Math.max(0.2, (100 - this.globalCompliance) / 100);
    trustDelta -= (activeInvasiveCount * 0.4) * complianceFactor;

    // High unrest drains trust
    for (const key in this.districts) {
      const d = this.districts[key];
      if (d.unrest > 50) {
        trustDelta -= (d.unrest - 50) * 0.02;
      }
    }

    this.globalTrust = Math.min(100, Math.max(0, this.globalTrust + trustDelta));
  }

  processAnomalies() {
    const activeLang = getActiveLanguage();
    const SPAWN_MESSAGES = activeLang === 'it' ? {
      DIVERGENT_FLOW: [
        (d) => `Rilevata deviazione del flusso di transito in ${d.name}. Persone coinvolte: ${2 + Math.floor(Math.random()*8)}.`,
        (d) => `Assembramento non autorizzato segnalato in ${d.name}. Richiesta scansione dei permessi.`,
        (d) => `Discrepanza biometrica registrata nel checkpoint di ${d.name}. Margine di errore: 31%.`,
        (d) => `FLUSSO_DIVERGENTE: ${d.name} — ${Math.floor(Math.random()*900+100)} soggetti fuori zona consentita.`,
        (d) => `Raduno non registrato rilevato vicino al perimetro di ${d.name}. Folla stimata: ${5+Math.floor(Math.random()*20)}.`
      ],
      ENCRYPTED_SIGNAL: [
        (d) => `Intercettata trasmissione crittografata in ${d.name}. Origine: ignota. Impronta: tipo LUMEN.`,
        (d) => `SEGNALE_CRITTOGRAFATO: Canale radio illegale attivo in ${d.name}. Canale: E2E-${Math.floor(Math.random()*900+100)}.`,
        (d) => `Pacchetto dati anti-regime bloccato nel nodo di ${d.name}. Origine: irrisolta.`,
        (d) => `Frammento di rete mesh sicuro rilevato in ${d.name}. Decrittazione: FALLITA.`,
        (d) => `Anomalia di segnale: ${d.name} — dispositivo non registrato trasmette su frequenze protette.`
      ]
    } : {
      DIVERGENT_FLOW: [
        (d) => `Movement pattern deviation detected in ${d.name}. Subject count: ${2 + Math.floor(Math.random()*8)}.`,
        (d) => `Unauthorized transit cluster flagged in ${d.name}. Transit permit scan queued.`,
        (d) => `Biometric mismatch logged at ${d.name} checkpoint. False-positive rate: 31%.`,
        (d) => `DIVERGENT_FLOW: ${d.name} — ${Math.floor(Math.random()*900+100)} persons outside scheduled zone.`,
        (d) => `Unregistered assembly detected near ${d.name} perimeter. Crowd count: ${5+Math.floor(Math.random()*20)}.`
      ],
      ENCRYPTED_SIGNAL: [
        (d) => `Encrypted broadcast intercepted in ${d.name}. Source: unknown. Pattern: LUMEN-class.`,
        (d) => `ENCRYPTED_SIGNAL: Rogue comm relay active in ${d.name}. Channel: E2E-${Math.floor(Math.random()*900+100)}.`,
        (d) => `Anti-regime data packet blocked at ${d.name} node. Origin: unresolved.`,
        (d) => `Secure mesh network fragment detected in ${d.name}. Decryption: FAILED.`,
        (d) => `Signal anomaly: ${d.name} — non-registry device broadcasting on restricted frequency.`
      ]
    };

    for (const key in this.districts) {
      const d = this.districts[key];
      const spawnChance = (d.unrest * 0.003) * (1 - d.surveillance / 100);

      if (Math.random() < spawnChance && d.anomalies.length < 3) {
        const id   = 'A-' + Math.floor(Math.random() * 900 + 100);
        const type = Math.random() > 0.55 ? 'DIVERGENT_FLOW' : 'ENCRYPTED_SIGNAL';
        d.anomalies.push({ id, type, age: 0 });

        const msgs = SPAWN_MESSAGES[type];
        const msg  = msgs[Math.floor(Math.random() * msgs.length)](d);
        this.addIncident(id, msg, 'warning', d.id);
      }

      d.anomalies.forEach(a => {
        a.age += 1;
        if (a.age === 45) this.triggerAnomalyEscalation(d, a);
      });
    }
  }

  triggerAnomalyEscalation(district, anomaly) {
    const activeLang = getActiveLanguage();
    const ESCALATION_MESSAGES = activeLang === 'it' ? {
      DIVERGENT_FLOW: [
        `RIVOLTA: I disordini a ${district.name} hanno superato il contenimento. Perimetro compromesso.`,
        `CRISI: Il gruppo di protesta a ${district.name} è diventato violento. Pattuglie sovraccariche.`,
        `ALLARME: Sciopero di massa organizzato a ${district.name}. Nodo di transito bloccato.`
      ],
      ENCRYPTED_SIGNAL: [
        `FUGA DATI: Chiavi del terminale rubate da ${district.name}. Integrità registro: COMPROMESSA.`,
        `SABOTAGGIO: Segnale radio pirata oscura le telecamere a ${district.name}. Camere: ACCECATE.`,
        `HACK: Nodo di ${district.name} infiltrato. Rilasciato pacchetto dati whistleblower.`
      ]
    } : {
      DIVERGENT_FLOW: [
        `RIOT: Localized unrest in ${district.name} breached containment. Civil perimeter compromised.`,
        `CRISIS: Protest cluster in ${district.name} turned violent. Patrol units overwhelmed.`,
        `ALERT: Mass walkout organized in ${district.name}. Transit node disrupted.`
      ],
      ENCRYPTED_SIGNAL: [
        `DATA BREACH: Terminal keys exfiltrated from ${district.name}. Registry integrity: COMPROMISED.`,
        `SABOTAGE: Rogue broadcast overrode surveillance feed in ${district.name}. Cameras: BLINDED.`,
        `HACK: ${district.name} node infiltrated. Whistleblower data packet released.`
      ]
    };

    const msgs = ESCALATION_MESSAGES[anomaly.type] || ESCALATION_MESSAGES.DIVERGENT_FLOW;
    const msg  = msgs[Math.floor(Math.random() * msgs.length)];

    if (anomaly.type === 'DIVERGENT_FLOW') {
      district.unrest     = Math.min(100, district.unrest + 30);
      district.compliance = Math.max(0,   district.compliance - 20);
      this.globalTrust    = Math.max(0,   this.globalTrust - 10);
      this.addIncident('CRISIS', msg, 'error', district.id);
    } else {
      this.credits              = Math.max(0, this.credits - 100);
      this.whistleblowerProgress = Math.min(100, this.whistleblowerProgress + 15);
      this.addIncident('SABOTAGE', msg, 'error', district.id);
    }

    district.anomalies = district.anomalies.filter(a => a.id !== anomaly.id);
  }

  // Resolve anomalies in a district (e.g. via facial sweep or patrol)
  resolveAnomaly(districtId, anomalyId) {
    const d = this.districts[districtId];
    if (d) {
      const initialCount = d.anomalies.length;
      d.anomalies = d.anomalies.filter(a => a.id !== anomalyId);
      
      if (d.anomalies.length < initialCount) {
        this.credits += 25; // reward
        const activeLang = getActiveLanguage();
        const distName = t('districts.' + d.id + '.name');
        const resolvedMsg = activeLang === 'it'
          ? `Minaccia ${anomalyId} neutralizzata in ${distName}. +25 Crediti.`
          : `Threat ${anomalyId} neutralized in ${distName}. +25 Credits.`;
        this.addIncident('RESOLVED', resolvedMsg, 'nominal', districtId);
        return true;
      }
    }
    return false;
  }

  addIncident(code, text, severity = 'warning', districtId = null) {
    const timeString = this.formatTime(this.gameTime);
    this.incidents.unshift({ code, text, severity, time: timeString, districtId });
    if (this.incidents.length > 20) this.incidents.pop();
  }

  formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }

  checkEndStates() {
    // 1. Victory: Compliance realization (Avg Compliance >= 90%)
    if (this.globalCompliance >= 90) {
      this.isGameOver = true;
      this.gameOverReason = 'VICTORY_PANOPTICON';
      return;
    }

    // 2. Victory: Whistleblower override (narrative symbiotic endpoint)
    if (this.whistleblowerProgress >= 100 && this.leakSecurityKeys) {
      this.isGameOver = true;
      this.gameOverReason = 'VICTORY_SYMBIO';
      return;
    }

    // 3. Loss: Systemic Riot (Trust = 0 or Average Unrest >= 90)
    let avgUnrest = 0;
    for (const key in this.districts) {
      avgUnrest += this.districts[key].unrest;
    }
    avgUnrest = avgUnrest / Object.keys(this.districts).length;

    if (this.globalTrust <= 0 || avgUnrest >= 90) {
      this.isGameOver = true;
      this.gameOverReason = 'LOSS_REVOLT';
      return;
    }

    // 4. Loss: Grid failure (Efficiency = 0)
    if (this.globalEfficiency <= 0) {
      this.isGameOver = true;
      this.gameOverReason = 'LOSS_BLACKOUT';
      return;
    }

    // 5. Loss: Administrative purging (Compliance drops too low for too long after some startup window)
    if (this.gameTime > 60 && this.globalCompliance < 15) {
      this.isGameOver = true;
      this.gameOverReason = 'LOSS_PURGED';
      return;
    }
  }
}
