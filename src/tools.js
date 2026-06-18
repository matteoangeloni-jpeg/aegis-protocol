/**
 * Aegis Protocol - Governance Tools Modifiers & DOM Builders
 */

import { t, getActiveLanguage } from './i18n.js';

export const GOVERNANCE_TOOLS = {
  facial_sweep: {
    id: 'facial_sweep',
    name: 'Facial Recognition Sweep',
    icon: '👁',
    category: 'SURVEILLANCE',
    dangerLevel: 4,
    cost: 35,
    minSlider: 10,
    maxSlider: 100,
    unit: 'FPS',
    desc: 'Conduct intensive biometric face sweeps. Forces submission in target zones, but severely strains civil liberty trust.',
    getImpactText(val) {
      if (getActiveLanguage() === 'it') {
        return `Sorveglianza +${(val * 0.4).toFixed(0)}%  ·  Conformità +${(val * 0.02).toFixed(1)}/s  ·  Disordini Fringe ↑↑`;
      }
      return `Surveillance +${(val * 0.4).toFixed(0)}%  ·  Compliance +${(val * 0.02).toFixed(1)}/s  ·  Fringe unrest ↑↑`;
    }
  },
  predictive_patrols: {
    id: 'predictive_patrols',
    name: 'Predictive Patrol Dispatch',
    icon: '🚔',
    category: 'ENFORCEMENT',
    dangerLevel: 3,
    cost: 30,
    minSlider: 10,
    maxSlider: 100,
    unit: 'units',
    desc: 'Deploy autonomous patrol units to preemptively lock down grids with emerging threat values.',
    getImpactText(val) {
      if (getActiveLanguage() === 'it') {
        return `Disordini -${(val * 0.03).toFixed(1)}/s  ·  Attrito +${(val * 0.005).toFixed(2)}/s  ·  Conformità ↑`;
      }
      return `Unrest -${(val * 0.03).toFixed(1)}/s  ·  Friction +${(val * 0.005).toFixed(2)}/s  ·  Compliance ↑`;
    }
  },
  welfare_score: {
    id: 'welfare_score',
    name: 'AI Welfare Filter',
    icon: '⚖',
    category: 'ECONOMIC',
    dangerLevel: 3,
    cost: -15,
    minSlider: 0,
    maxSlider: 100,
    unit: 'excl%',
    desc: 'Automate welfare and municipal benefit screening based on civic alignment. Saves resource credits.',
    getImpactText(val) {
      if (getActiveLanguage() === 'it') {
        return `Crediti +${(val * 0.4).toFixed(0)}/s  ·  Disordini classe operaia ↑  ·  Attrito Fringe ↑↑`;
      }
      return `Credits +${(val * 0.4).toFixed(0)}/s  ·  Working-class unrest ↑  ·  Fringe friction ↑↑`;
    }
  },
  permit_filter: {
    id: 'permit_filter',
    name: 'Commuter Gatekeeping',
    icon: '🚧',
    category: 'MOBILITY',
    dangerLevel: 2,
    cost: 20,
    minSlider: 10,
    maxSlider: 100,
    unit: 'restrict%',
    desc: 'Restricts travel permits through rail nodes for citizens below compliance thresholds.',
    getImpactText(val) {
      if (getActiveLanguage() === 'it') {
        return `Diffusione disordini bloccata  ·  Efficienza Hub -${(val * 0.02).toFixed(1)}%/s  ·  Attrito ↑`;
      }
      return `Unrest spread blocked  ·  Hub efficiency -${(val * 0.02).toFixed(1)}%/s  ·  Friction ↑`;
    }
  },
  service_prioritization: {
    id: 'service_prioritization',
    name: 'Algorithmic Grid Tiering',
    icon: '⚡',
    category: 'ECONOMIC',
    dangerLevel: 4,
    cost: 25,
    minSlider: 0,
    maxSlider: 100,
    unit: 'bias%',
    desc: 'Reroutes energy distribution and hospital priorities to highly-compliant loyalist districts.',
    getImpactText(val) {
      if (getActiveLanguage() === 'it') {
        return `Efficienza Elite ↑↑  ·  Zone bassa fiducia: blackout, disordini  ·  Visibile su mappa Rete`;
      }
      return `Elite efficiency ↑↑  ·  Low-trust zones: blackouts, unrest  ·  Visible on Power Grid map`;
    }
  },
  social_registry: {
    id: 'social_registry',
    name: 'Social Trust Registry',
    icon: '📋',
    category: 'SURVEILLANCE',
    dangerLevel: 5,
    cost: 45,
    minSlider: 10,
    maxSlider: 100,
    unit: 'depth%',
    desc: 'Mandatory social scoring registration city-wide. Continuous surveillance logging.',
    getImpactText(val) {
      if (getActiveLanguage() === 'it') {
        return `Conformità +${(val * 0.012).toFixed(2)}/s in tutta la città  ·  Fiducia globale ↓  ·  Pericolo massimo`;
      }
      return `Compliance +${(val * 0.012).toFixed(2)}/s city-wide  ·  Global trust ↓  ·  Max danger tool`;
    }
  },
  automated_gatekeeping: {
    id: 'automated_gatekeeping',
    name: 'District Isolation Gates',
    icon: '🔒',
    category: 'ENFORCEMENT',
    dangerLevel: 4,
    cost: 35,
    minSlider: 10,
    maxSlider: 100,
    unit: 'seal%',
    desc: 'Erect motorized barricades to quarantine sections with high rebellion levels.',
    getImpactText(val) {
      if (getActiveLanguage() === 'it') {
        return `Diffusione disordini arrestata  ·  Commercio distretto -${(val * 0.03).toFixed(0)}%  ·  Visibile sulla mappa`;
      }
      return `Unrest spread halted  ·  District commerce -${(val * 0.03).toFixed(0)}%  ·  Visible on map`;
    }
  },
  anomaly_alerts: {
    id: 'anomaly_alerts',
    name: 'Divergence Threat Alerts',
    icon: '📡',
    category: 'INTELLIGENCE',
    dangerLevel: 1,
    cost: 15,
    minSlider: 0,
    maxSlider: 100,
    unit: 'sens%',
    desc: 'Use machine learning to highlight anomalous patterns. Critical for locating threat nodes on the map.',
    getImpactText(val) {
      if (getActiveLanguage() === 'it') {
        return `Visibilità anomalie ↑  ·  Tracciamento +10%  ·  Attiva radar sulla mappa`;
      }
      return `Anomaly visibility ↑  ·  Tracking +10%  ·  Activates radar sweep on map`;
    }
  }
};

// Category color map
const CATEGORY_COLORS = {
  SURVEILLANCE: '#00f0ff',
  ENFORCEMENT : '#ff0055',
  ECONOMIC    : '#ffb900',
  MOBILITY    : '#39ff14',
  INTELLIGENCE: '#9f7aea'
};

// Danger level label
function dangerLabel(level) {
  const labelKeys = ['', 'low', 'guarded', 'high', 'severe', 'critical'];
  const colors = ['', '#39ff14', '#9df21c', '#ffb900', '#ff6600', '#ff0055'];
  const key = labelKeys[level] || 'unknown';
  return { text: t('tools.risk_levels.' + key), color: colors[level] || '#999' };
}

/**
 * Render the list of governance tools into the UI container
 */
export function renderToolsList(containerEl, simulationState, onToggle, onSliderChange) {
  containerEl.innerHTML = '';

  Object.keys(GOVERNANCE_TOOLS).forEach(key => {
    const cfg   = GOVERNANCE_TOOLS[key];
    const state = simulationState.tools[key];
    if (!state) return;

    const isActive = state.active;
    const catColor = CATEGORY_COLORS[cfg.category] || '#799bb3';
    const danger   = dangerLabel(cfg.dangerLevel);
    const costText = cfg.cost < 0
      ? `<span class="tool-cost-save">${t('tools.saves_label')} +${Math.abs(cfg.cost)}cr/s</span>`
      : `<span class="tool-cost">${cfg.cost}cr/s</span>`;

    const toolItem = document.createElement('div');
    toolItem.className = `tool-item ${isActive ? 'tool-active' : ''}`;
    toolItem.id = `tool-${cfg.id}`;

    // Active bar indicator on left edge
    toolItem.style.setProperty('--tool-cat-color', catColor);

    const localizedName = t('tools.list.' + cfg.id + '.name');
    const localizedDesc = t('tools.list.' + cfg.id + '.desc');
    const localizedCategory = t('tools.categories.' + cfg.category.toLowerCase());
    const toggleButtonText = isActive ? t('tools.btn_terminate') : t('tools.btn_deploy');

    toolItem.innerHTML = `
      <div class="tool-header-row">
        <div class="tool-name-group">
          <span class="tool-icon">${cfg.icon}</span>
          <span class="tool-title">${localizedName}</span>
        </div>
        <button class="tool-toggle-btn ${isActive ? 'btn-terminate' : 'btn-initialize'}" data-id="${cfg.id}">
          ${toggleButtonText}
        </button>
      </div>

      <div class="tool-meta-row">
        <span class="tool-category-badge" style="color:${catColor};border-color:${catColor}33">${localizedCategory}</span>
        <span class="tool-danger-badge" style="color:${danger.color};border-color:${danger.color}55">
          ${t('tools.risk_label')}: ${danger.text} ${'■'.repeat(cfg.dangerLevel)}${'□'.repeat(5 - cfg.dangerLevel)}
        </span>
        ${costText}
      </div>

      <div class="tool-desc">${localizedDesc}</div>

      <div class="slider-container ${!isActive ? 'slider-disabled' : ''}">
        <div class="slider-label-row">
          <span>${t('tools.intensity_label')} <span id="val-${cfg.id}" class="slider-val">${state.value}</span> ${cfg.unit}</span>
        </div>
        <div class="slider-track-wrap">
          <input
            type="range"
            class="tool-slider"
            data-id="${cfg.id}"
            min="${cfg.minSlider}"
            max="${cfg.maxSlider}"
            value="${state.value}"
            ${!isActive ? 'disabled' : ''}
          />
          <div class="slider-fill" id="fill-${cfg.id}" style="width:${((state.value - cfg.minSlider) / (cfg.maxSlider - cfg.minSlider)) * 100}%;background:${catColor}"></div>
        </div>
      </div>

      <div class="tool-stats-row" id="impact-${cfg.id}">${cfg.getImpactText(state.value)}</div>
    `;

    // Toggle button
    toolItem.querySelector('.tool-toggle-btn').addEventListener('click', () => onToggle(cfg.id));

    // Slider
    const slider = toolItem.querySelector('.tool-slider');
    slider.addEventListener('input', e => {
      const val = parseInt(e.target.value);
      const pct = ((val - cfg.minSlider) / (cfg.maxSlider - cfg.minSlider)) * 100;
      document.getElementById(`val-${cfg.id}`).textContent   = val;
      document.getElementById(`fill-${cfg.id}`).style.width  = pct + '%';
      document.getElementById(`impact-${cfg.id}`).textContent = cfg.getImpactText(val);
      onSliderChange(cfg.id, val);
    });

    containerEl.appendChild(toolItem);
  });
}
