/**
 * Aegis Protocol - Scripted & Dynamic Narrative Events
 */

import { DISTRICTS } from './simulation.js';
import { t } from './i18n.js';

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
          return 'narrative.intro_directive.outcomes.0';
        }
      },
      {
        text: 'Review district socioeconomic files.',
        effect: (sim) => {
          return 'narrative.intro_directive.outcomes.1';
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
          return 'narrative.lumen_contact.outcomes.0';
        }
      },
      {
        text: 'Temporarily isolate the channel and listen.',
        effect: (sim) => {
          sim.whistleblowerProgress += 20;
          return 'narrative.lumen_contact.outcomes.1';
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
          return 'narrative.foundry_riot_risk.outcomes.0';
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
          return 'narrative.foundry_riot_risk.outcomes.1';
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
          return 'narrative.lumen_leak_request.outcomes.0';
        }
      },
      {
        text: 'Leak the encryption keys. Help the resistance.',
        effect: (sim) => {
          sim.leakSecurityKeys = true;
          sim.whistleblowerProgress = Math.min(100, sim.whistleblowerProgress + 30);
          sim.globalTrust += 15;
          sim.globalEfficiency -= 15;
          return 'narrative.lumen_leak_request.outcomes.1';
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
          return 'narrative.apex_service_demand.outcomes.0';
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
          return 'narrative.apex_service_demand.outcomes.1';
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
          return 'narrative.lumen_final_plea.outcomes.0';
        }
      },
      {
        text: 'Authorize final root leak (Initiate OVERRIDE).',
        effect: (sim) => {
          sim.whistleblowerProgress = 100;
          sim.leakSecurityKeys = true;
          return 'narrative.lumen_final_plea.outcomes.1';
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
          return 'narrative.ministry_promotion_offer.outcomes.0';
        }
      },
      {
        text: 'Decline. Cite technical calibration requirements.',
        effect: (sim) => {
          sim.whistleblowerProgress += 10;
          sim.globalTrust += 5;
          return 'narrative.ministry_promotion_offer.outcomes.1';
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
          return 'narrative.journalist_expose.outcomes.0';
        }
      },
      {
        text: 'Allow the broadcast. Let citizens know about misidentification.',
        effect: (sim) => {
          sim.globalTrust += 10;
          sim.whistleblowerProgress += 15;
          sim.districts[DISTRICTS.FRINGE].compliance -= 10;
          sim.districts[DISTRICTS.FRINGE].unrest += 10;
          return 'narrative.journalist_expose.outcomes.1';
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
          return 'narrative.lumen_safehouse.outcomes.0';
        }
      },
      {
        text: 'Flood Grid 7-C with Predictive Patrols immediately.',
        effect: (sim) => {
          sim.tools.predictive_patrols.active = true;
          sim.whistleblowerProgress = Math.max(0, sim.whistleblowerProgress - 20);
          sim.globalCompliance += 5;
          return 'narrative.lumen_safehouse.outcomes.1';
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
          return 'narrative.fringe_revolt_warning.outcomes.0';
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
          return 'narrative.fringe_revolt_warning.outcomes.1';
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
          return 'narrative.efficiency_collapse_warning.outcomes.0';
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
          return 'narrative.efficiency_collapse_warning.outcomes.1';
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
  const reasonKey = reason.toLowerCase();
  
  // Custom metrics formatting based on outcome
  let metrics = [];
  if (reason === 'VICTORY_PANOPTICON') {
    metrics = [
      { label: t('endgame.victory_panopticon.label_compliance'), value: `${simState.globalCompliance}%` },
      { label: t('endgame.victory_panopticon.label_trust'), value: `${simState.globalTrust}% (${t('endgame.victory_panopticon.value_trust')})` },
      { label: t('endgame.victory_panopticon.label_efficiency'), value: `${simState.globalEfficiency}%` },
      { label: t('endgame.victory_panopticon.label_completed'), value: `${simState.gameTime} ${t('endgame.victory_panopticon.value_time')}` }
    ];
  } else if (reason === 'VICTORY_SYMBIO') {
    metrics = [
      { label: t('endgame.victory_symbio.label_compliance'), value: `${simState.globalCompliance}% (${t('endgame.victory_symbio.value_compliance')})` },
      { label: t('endgame.victory_symbio.label_trust'), value: `${simState.globalTrust}% (${t('endgame.victory_symbio.value_trust')})` },
      { label: t('endgame.victory_symbio.label_efficiency'), value: `${simState.globalEfficiency}%` },
      { label: t('endgame.victory_symbio.label_completed'), value: `${simState.gameTime} ${t('endgame.victory_symbio.value_time')}` }
    ];
  } else if (reason === 'LOSS_REVOLT') {
    metrics = [
      { label: t('endgame.loss_revolt.label_compliance'), value: `${simState.globalCompliance}%` },
      { label: t('endgame.loss_revolt.label_trust'), value: `0% (${t('endgame.loss_revolt.value_trust')})` },
      { label: t('endgame.loss_revolt.label_efficiency'), value: `${simState.globalEfficiency}%` },
      { label: t('endgame.loss_revolt.label_survived'), value: `${simState.gameTime} ${t('endgame.loss_revolt.value_time')}` }
    ];
  } else if (reason === 'LOSS_BLACKOUT') {
    metrics = [
      { label: t('endgame.loss_blackout.label_compliance'), value: `${simState.globalCompliance}%` },
      { label: t('endgame.loss_blackout.label_trust'), value: `${simState.globalTrust}%` },
      { label: t('endgame.loss_blackout.label_efficiency'), value: `0% (${t('endgame.loss_blackout.value_efficiency')})` },
      { label: t('endgame.loss_blackout.label_survived'), value: `${simState.gameTime} ${t('endgame.loss_blackout.value_time')}` }
    ];
  } else if (reason === 'LOSS_PURGED') {
    metrics = [
      { label: t('endgame.loss_purged.label_compliance'), value: `${simState.globalCompliance}% (${t('endgame.loss_purged.value_compliance')})` },
      { label: t('endgame.loss_purged.label_trust'), value: `${simState.globalTrust}%` },
      { label: t('endgame.loss_purged.label_efficiency'), value: `${simState.globalEfficiency}%` },
      { label: t('endgame.loss_purged.label_survived'), value: `${simState.gameTime} ${t('endgame.loss_purged.value_time')}` }
    ];
  }

  return {
    title: t(`endgame.${reasonKey}.title`),
    body: t(`endgame.${reasonKey}.body`),
    metrics
  };
}
