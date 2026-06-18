/**
 * Aegis Protocol - Governance Tools Modifiers & DOM Builders
 */

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
      return `Elite efficiency ↑↑  ·  Low-trust zones: blackouts, unrest ↑  ·  Visible on Power Grid map`;
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
  const labels = ['', 'LOW', 'GUARDED', 'HIGH', 'SEVERE', 'CRITICAL'];
  const colors = ['', '#39ff14', '#9df21c', '#ffb900', '#ff6600', '#ff0055'];
  return { text: labels[level] || 'UNKNOWN', color: colors[level] || '#999' };
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
      ? `<span class="tool-cost-save">SAVES +${Math.abs(cfg.cost)}cr/s</span>`
      : `<span class="tool-cost">${cfg.cost}cr/s</span>`;

    const toolItem = document.createElement('div');
    toolItem.className = `tool-item ${isActive ? 'tool-active' : ''}`;
    toolItem.id = `tool-${cfg.id}`;

    // Active bar indicator on left edge
    toolItem.style.setProperty('--tool-cat-color', catColor);

    toolItem.innerHTML = `
      <div class="tool-header-row">
        <div class="tool-name-group">
          <span class="tool-icon">${cfg.icon}</span>
          <span class="tool-title">${cfg.name}</span>
        </div>
        <button class="tool-toggle-btn ${isActive ? 'btn-terminate' : 'btn-initialize'}" data-id="${cfg.id}">
          ${isActive ? '■ TERMINATE' : '▶ DEPLOY'}
        </button>
      </div>

      <div class="tool-meta-row">
        <span class="tool-category-badge" style="color:${catColor};border-color:${catColor}33">${cfg.category}</span>
        <span class="tool-danger-badge" style="color:${danger.color};border-color:${danger.color}55">
          RISK: ${danger.text} ${'■'.repeat(cfg.dangerLevel)}${'□'.repeat(5 - cfg.dangerLevel)}
        </span>
        ${costText}
      </div>

      <div class="tool-desc">${cfg.desc}</div>

      <div class="slider-container ${!isActive ? 'slider-disabled' : ''}">
        <div class="slider-label-row">
          <span>INTENSITY: <span id="val-${cfg.id}" class="slider-val">${state.value}</span> ${cfg.unit}</span>
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
