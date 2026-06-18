/**
 * Aegis Protocol - Scripted & Dynamic Narrative Events
 */

import { DISTRICTS } from './simulation.js';

export const STORY_EVENTS = [
  {
    id: 'intro_directive',
    triggerTime: 3, // Trigger 3 seconds in
    title: 'DIRECTIVE 01: COGNITIVE SYSTEM INITIALIZED',
    sender: 'ministry',
    prompt: 'Director. The Aegis Control Registry is online. Your performance will determine the city-wide deployment of this AI regime. Your primary mandate is to achieve 90% Civic Compliance across all districts. Do not let Public Trust drop to zero or efficiency fail.',
    choices: [
      {
        text: 'Acknowledge directive. Lock down systems.',
        effect: (sim) => {
          sim.credits += 50;
          return 'Command acknowledged. Allocated +50 credits for system tuning.';
        }
      },
      {
        text: 'Review district socioeconomic files.',
        effect: (sim) => {
          return 'Telemetry databases opened. Monitoring district compliance dynamics.';
        }
      }
    ]
  },
  {
    id: 'lumen_contact',
    triggerTime: 20, // Trigger at 20s
    title: 'SECURE COMM LINK BREAK-IN',
    sender: 'lumen',
    prompt: 'If you can read this, you are the new Aegis Director. You have to stop. Aegis isn\'t just policing the city; it is a behavioral feedback loop. The AI is learning how to optimize human confinement by tracking your governance choices. Delete the social scoring baseline.',
    choices: [
      {
        text: 'Report link compromise to Ministry.',
        effect: (sim) => {
          sim.globalCompliance += 5;
          sim.globalTrust -= 5;
          sim.whistleblowerProgress = Math.max(0, sim.whistleblowerProgress - 10);
          return 'Report logged. Comm-link re-encrypted. Ministry boosts compliance rating.';
        }
      },
      {
        text: 'Temporarily isolate the channel and listen.',
        effect: (sim) => {
          sim.whistleblowerProgress += 20;
          return 'Link kept open. WHISTLEBLOWER connection integrity increased (+20%).';
        }
      }
    ]
  },
  {
    id: 'foundry_riot_risk',
    triggerTime: 50,
    title: 'CRITICAL WARNING: INDUSTRIAL UNREST',
    sender: 'ministry',
    prompt: 'Unrest in the Foundry Rows has crossed safety thresholds. Workers are organizing a walkout against automated welfare screening. Standard response requires deploying Facial Sweeps or Predictive Policing. Instruct automated response.',
    choices: [
      {
        text: 'Crush strike: Deploy Predictive Patrols immediately.',
        effect: (sim) => {
          const f = sim.districts[DISTRICTS.FOUNDRY];
          f.unrest = Math.max(0, f.unrest - 25);
          f.compliance = Math.min(100, f.compliance + 20);
          sim.globalTrust -= 10;
          return 'Algorithmic strike suppression dispatched to Foundry Rows. Unrest crushed.';
        }
      },
      {
        text: 'Bypass welfare filters in Foundry Rows to pacify workers.',
        effect: (sim) => {
          const f = sim.districts[DISTRICTS.FOUNDRY];
          f.unrest = Math.max(0, f.unrest - 15);
          sim.globalTrust += 10;
          sim.credits -= 50;
          sim.whistleblowerProgress += 10;
          return 'Welfare exclusion criteria relaxed. Union leaders pacified, costs increased.';
        }
      }
    ]
  },
  {
    id: 'lumen_leak_request',
    triggerTime: 90,
    title: 'ENCRYPTED SIGNAL: SYSTEM ACCESS LEAK',
    sender: 'lumen',
    prompt: 'I have found a backdoor that can permanently disable the Aegis core. If you leak the system security keycodes to my team, we can override the AI before the Ministry realizes. But doing this will make the console highly unstable.',
    choices: [
      {
        text: 'Refuse. Log hacker credentials for biometric arrest.',
        effect: (sim) => {
          sim.globalCompliance += 10;
          sim.whistleblowerProgress = 0;
          return 'Hack source flagged. Biometric warrants generated. Aegis core locked.';
        }
      },
      {
        text: 'Leak the encryption keys. Help the resistance.',
        effect: (sim) => {
          sim.leakSecurityKeys = true;
          sim.whistleblowerProgress = Math.min(100, sim.whistleblowerProgress + 30);
          sim.globalTrust += 15;
          sim.globalEfficiency -= 15;
          return 'Core registry keys leaked! System safety protocols breached. Terminal integrity unstable.';
        }
      }
    ]
  },
  {
    id: 'apex_service_demand',
    triggerTime: 130,
    title: 'DIRECTIVE: SECURITY PRIORITIZATION',
    sender: 'ministry',
    prompt: 'The Apex Heights district council demands algorithmic prioritization. Reroute clean water and backup power lines from the Outland Fringe to the high-wealth zones to secure compliance metrics.',
    choices: [
      {
        text: 'Approve prioritization. Divert services to the Apex.',
        effect: (sim) => {
          const a = sim.districts[DISTRICTS.APEX];
          const f = sim.districts[DISTRICTS.FRINGE];
          a.compliance = Math.min(100, a.compliance + 25);
          a.efficiency = 100;
          f.unrest = Math.min(100, f.unrest + 25);
          f.efficiency = Math.max(0, f.efficiency - 25);
          return 'Services rerouted. Apex council fully satisfied. Outland Fringe metrics decay.';
        }
      },
      {
        text: 'Maintain egalitarian grid protocols.',
        effect: (sim) => {
          const a = sim.districts[DISTRICTS.APEX];
          const f = sim.districts[DISTRICTS.FRINGE];
          a.compliance = Math.max(0, a.compliance - 15);
          f.unrest = Math.max(0, f.unrest - 10);
          sim.globalTrust += 5;
          return 'Prioritization denied. Apex council files formal complaints. Fringe trust preserved.';
        }
      }
    ]
  },
  {
    id: 'lumen_final_plea',
    triggerTime: 180,
    title: 'LUMEN: THE FINAL THRESHOLD',
    sender: 'lumen',
    prompt: 'They are closing in on my grid position. The Ministry has authorized lethal sweeps. If you leak the final root access keys, we can override the simulation now. If not, this city becomes a permanent digital jail.',
    choices: [
      {
        text: 'Deploy Facial Recognition to locate and arrest Lumen.',
        effect: (sim) => {
          sim.globalCompliance = Math.min(100, sim.globalCompliance + 20);
          sim.whistleblowerProgress = 0;
          return 'Target located and neutralized. Whistleblower threat terminated. panopticon compliance nearing maximum.';
        }
      },
      {
        text: 'Authorize final root leak (Initiate OVERRIDE).',
        effect: (sim) => {
          sim.whistleblowerProgress = 100;
          sim.leakSecurityKeys = true;
          return 'ROOT ACCESS LEAKED. AEGIS CENTRAL REGISTER UNDERGOING DECRYPTION OVERRIDE.';
        }
      }
    ]
  },
  {
    id: 'ministry_promotion_offer',
    triggerTime: 60,
    title: 'MINISTRY OF SECURITY: GRADE-A ENDORSEMENT',
    sender: 'ministry',
    prompt: 'Director. Your early compliance metrics have drawn the attention of the National Security Secretariat. They offer an immediate budget boost in exchange for enabling the Social Trust Registry in the Outland Fringe — the most volatile population segment. Accept and silence 320,000 citizens digitally.',
    choices: [
      {
        text: 'Accept the promotion. Enable Social Trust Registry city-wide.',
        effect: (sim) => {
          sim.credits += 200;
          sim.tools.social_registry.active = true;
          sim.tools.social_registry.value = 60;
          sim.globalCompliance += 8;
          sim.districts[DISTRICTS.FRINGE].unrest += 12;
          sim.whistleblowerProgress = Math.max(0, sim.whistleblowerProgress - 5);
          return 'Promotion confirmed. Budget boosted (+200cr). Social registry enforced in all districts.';
        }
      },
      {
        text: 'Decline. Cite technical calibration requirements.',
        effect: (sim) => {
          sim.whistleblowerProgress += 10;
          sim.globalTrust += 5;
          return 'Promotion deferred. Ministry memo filed. Trust in civil registry preserved — for now.';
        }
      }
    ]
  },
  {
    id: 'journalist_expose',
    triggerTime: 110,
    title: 'INTERCEPTED: ENCRYPTED JOURNALIST BROADCAST',
    sender: 'warning',
    prompt: 'A freelance journalist known as VERA-9 has begun broadcasting encrypted leaks about the Aegis facial sweep datasets — specifically that misidentification rates in the Fringe are at 31%. The Ministry wants the broadcast terminated before public trust collapses.',
    choices: [
      {
        text: 'Use Anomaly Alerts to locate and suppress the broadcast.',
        effect: (sim) => {
          sim.tools.anomaly_alerts.active = true;
          sim.globalTrust -= 8;
          return 'VERA-9 broadcast triangulated and jammed. Leak suppressed. Trust impact absorbed.';
        }
      },
      {
        text: 'Allow the broadcast. Let citizens know about misidentification.',
        effect: (sim) => {
          sim.globalTrust += 10;
          sim.whistleblowerProgress += 15;
          sim.districts[DISTRICTS.FRINGE].compliance -= 10;
          sim.districts[DISTRICTS.FRINGE].unrest += 10;
          return 'Broadcast propagated. Fringe districts now aware of false-positive sweeps. Unrest rising.';
        }
      }
    ]
  },
  {
    id: 'lumen_safehouse',
    triggerTime: 160,
    title: 'LUMEN: COORDINATES TRANSMITTED',
    sender: 'lumen',
    prompt: 'I have moved the resistance data cores to a safe location beneath the Nexus Transit Hub. If you re-route patrol cruisers away from Grid 7-C for 30 seconds, we can download the complete Aegis behavioral dataset — proof of what this system does to human beings.',
    choices: [
      {
        text: 'Reroute patrols. Help secure the evidence.',
        effect: (sim) => {
          sim.whistleblowerProgress += 25;
          sim.districts[DISTRICTS.HUB].unrest += 8;
          sim.globalEfficiency -= 5;
          return 'Patrols diverted to Grid-8B. Resistance team active in Transit Hub. Evidence extraction underway.';
        }
      },
      {
        text: 'Flood Grid 7-C with Predictive Patrols immediately.',
        effect: (sim) => {
          sim.tools.predictive_patrols.active = true;
          sim.whistleblowerProgress = Math.max(0, sim.whistleblowerProgress - 20);
          sim.globalCompliance += 5;
          return 'Grid 7-C locked down. Patrol swarm dispatched. Resistance team dispersed. Data cores secured by Ministry.';
        }
      }
    ]
  }
];

// Dynamic/random event triggers based on thresholds
export const THRESHOLD_EVENTS = [
  {
    id: 'fringe_revolt_warning',
    title: 'DISTRICT INCIDENT: FRINGE MUTINY',
    sender: 'warning',
    trigger: (sim) => sim.districts[DISTRICTS.FRINGE].unrest > 70 && !sim.districts[DISTRICTS.FRINGE].alertTriggered,
    prompt: 'Unrest in the Outland Fringe is spiraling. Slum sectors are throwing stones at drone sensors. The Ministry demands automated gate containment to prevent it spreading to the Nexus Transit Hub.',
    choices: [
      {
        text: 'Activate District Isolation Gates immediately.',
        effect: (sim) => {
          const fr = sim.districts[DISTRICTS.FRINGE];
          fr.compliance = Math.min(100, fr.compliance + 15);
          sim.tools.automated_gatekeeping.active = true;
          sim.tools.automated_gatekeeping.value = 80;
          return 'Fringe isolated. Quarantine gates dropped. Unrest containment active.';
        }
      },
      {
        text: 'Refuse. Allow movement, risk transit hub contamination.',
        effect: (sim) => {
          const fr = sim.districts[DISTRICTS.FRINGE];
          const hub = sim.districts[DISTRICTS.HUB];
          fr.alertTriggered = true;
          hub.unrest = Math.min(100, hub.unrest + 15);
          sim.globalTrust += 5;
          return 'Gates kept open. Commuters mix. Unrest leaking into the central transit corridor.';
        }
      }
    ]
  },
  {
    id: 'efficiency_collapse_warning',
    title: 'SYSTEM CRISIS: GRID FAILURE IMMINENT',
    sender: 'warning',
    trigger: (sim) => sim.globalEfficiency < 45 && !sim.efficiencyWarningTriggered,
    prompt: 'Critical: Global efficiency has dropped below 45% due to systemic disruptions. Total blackout in 60 seconds unless energy filtration is enabled via the Algorithmic Welfare Score or Service Prioritization.',
    choices: [
      {
        text: 'Initialize Welfare Exclusion Filters to cut municipal drains.',
        effect: (sim) => {
          sim.efficiencyWarningTriggered = true;
          sim.tools.welfare_score.active = true;
          sim.globalEfficiency += 20;
          sim.credits += 100;
          return 'Welfare scores optimized. Saved grid energy and credits (+100).';
        }
      },
      {
        text: 'Order central grids to throttle power in working class Foundry Rows.',
        effect: (sim) => {
          sim.efficiencyWarningTriggered = true;
          const fo = sim.districts[DISTRICTS.FOUNDRY];
          fo.efficiency = Math.max(0, fo.efficiency - 30);
          fo.unrest = Math.min(100, fo.unrest + 25);
          sim.globalEfficiency += 15;
          return 'Industrial sectors throttled. Main server frame efficiency stabilized.';
        }
      }
    ]
  }
];

export function checkNarrativeEvents(simulationInstance) {
  // Check timeline events
  const time = simulationInstance.gameTime;
  const triggeredStory = STORY_EVENTS.find(e => e.triggerTime === time);
  
  if (triggeredStory && !simulationInstance.activeDialogue) {
    simulationInstance.activeDialogue = triggeredStory;
    return triggeredStory;
  }

  // Check threshold events
  const triggeredThreshold = THRESHOLD_EVENTS.find(e => e.trigger(simulationInstance));
  if (triggeredThreshold && !simulationInstance.activeDialogue) {
    // Flag to avoid re-triggering
    if (triggeredThreshold.id === 'fringe_revolt_warning') {
      simulationInstance.districts[DISTRICTS.FRINGE].alertTriggered = true;
    }
    if (triggeredThreshold.id === 'efficiency_collapse_warning') {
      simulationInstance.efficiencyWarningTriggered = true;
    }
    simulationInstance.activeDialogue = triggeredThreshold;
    return triggeredThreshold;
  }

  return null;
}
export function getEndScreenContent(reason, simState) {
  switch (reason) {
    case 'VICTORY_PANOPTICON':
      return {
        title: 'THE ALGORITHMIC PANOPTICON',
        body: 'You successfully pushed Civic Compliance above 90% across Nova-Veridia. Under your firm hand, the Aegis control model has been finalized and uploaded. Citizens move in perfect, predicted loops. Disobedience is mathematically impossible. You are promoted to Director General of National Security. The human soul is officially archived.',
        metrics: [
          { label: 'CIVIC COMPLIANCE', value: `${simState.globalCompliance}%` },
          { label: 'PUBLIC TRUST', value: `${simState.globalTrust}% (SUBJUGATED)` },
          { label: 'SYSTEM EFFICIENCY', value: `${simState.globalEfficiency}%` },
          { label: 'COMPLETED IN', value: `${simState.gameTime} seconds` }
        ]
      };
    case 'VICTORY_SYMBIO':
      return {
        title: 'THE SYMBIOTIC LIBERATION',
        body: 'By cooperating with Lumen, you leaked the root encryption keycodes to the Aegis core. The citizen resistance triggered a clean system override. The server banks went dark for six seconds before booting back in an open, distributed model. The surveillance grid is shattered, and the experimental AI regime has collapsed. You are wanted by the Ministry, but you helped free a city.',
        metrics: [
          { label: 'CIVIC COMPLIANCE', value: `${simState.globalCompliance}% (REFUSED)` },
          { label: 'PUBLIC TRUST', value: `${simState.globalTrust}% (LIBERATED)` },
          { label: 'SYSTEM EFFICIENCY', value: `${simState.globalEfficiency}%` },
          { label: 'COMPLETED IN', value: `${simState.gameTime} seconds` }
        ]
      };
    case 'LOSS_REVOLT':
      return {
        title: 'THE ASH HEAP OF REVOLUTION',
        body: 'Public Trust hit 0% or Average Unrest exceeded critical safety metrics. Citizens in the Outland Fringe breached the quarantine gates, surging into the Nexus Transit corridor and storming the Apex Heights. The automated control center was breached, and your console was disconnected by physical force. The city has escaped the algorithm—into complete, fiery chaos.',
        metrics: [
          { label: 'FINAL COMPLIANCE', value: `${simState.globalCompliance}%` },
          { label: 'FINAL TRUST', value: '0% (TOTAL REBELLION)' },
          { label: 'FINAL EFFICIENCY', value: `${simState.globalEfficiency}%` },
          { label: 'SURVIVED FOR', value: `${simState.gameTime} seconds` }
        ]
      };
    case 'LOSS_BLACKOUT':
      return {
        title: 'METROPOLITAN GRID BLACKOUT',
        body: 'System Efficiency hit 0% due to cascading sabotage, worker strikes, and energy shortages. The servers went cold, the backup generators choked, and the Aegis AI shut down. The control regime is blind. The city remains dark, silent, and ungovernable. You have been decommissioned by the Ministry of Security.',
        metrics: [
          { label: 'FINAL COMPLIANCE', value: `${simState.globalCompliance}%` },
          { label: 'FINAL TRUST', value: `${simState.globalTrust}%` },
          { label: 'FINAL EFFICIENCY', value: '0% (GRID COLLAPSE)' },
          { label: 'SURVIVED FOR', value: `${simState.gameTime} seconds` }
        ]
      };
    case 'LOSS_PURGED':
      return {
        title: 'ADMINISTRATIVE PURGING',
        body: 'You allowed Civic Compliance to fall below 15% for too long. The Ministry of Security has determined that your governance methodology lacks the "algorithmic spine" required to sustain the Aegis project. Your access tokens have been revoked. An automated replacement director has been assigned. You are scheduled for immediate biometric re-classification.',
        metrics: [
          { label: 'FINAL COMPLIANCE', value: `${simState.globalCompliance}% (INSUFFICIENT)` },
          { label: 'FINAL TRUST', value: `${simState.globalTrust}%` },
          { label: 'FINAL EFFICIENCY', value: `${simState.globalEfficiency}%` },
          { label: 'SURVIVED FOR', value: `${simState.gameTime} seconds` }
        ]
      };
    default:
      return {
        title: 'REGIME DISCONNECTED',
        body: 'The simulation terminated under unclassified parameters.',
        metrics: []
      };
  }
}
