/**
 * Aegis Protocol – Citizen Dossier System
 * Procedurally generates surveillance profiles for city inhabitants.
 */

// ── Name tables ──────────────────────────────────────────────────────
const FIRST_NAMES = [
  'Maris', 'Caleb', 'Veda', 'Orin', 'Sela', 'Tomek', 'Lyra', 'Davan',
  'Neva', 'Riku', 'Zara', 'Cael', 'Esme', 'Talos', 'Wren', 'Brix',
  'Aiko', 'Sven', 'Lena', 'Dara', 'Fen', 'Hessa', 'Quill', 'Mika'
];
const FAMILY_NAMES = [
  'Vasek', 'Orel', 'Drinov', 'Syla', 'Marten', 'Korr', 'Phane', 'Ulas',
  'Thorn', 'Brek', 'Vyse', 'Nalis', 'Corten', 'Ashby', 'Praxis', 'Sone'
];

// ── Occupation tables by district ────────────────────────────────────
const OCCUPATIONS = {
  apex   : ['Corporate Strategist', 'Neural Risk Analyst', 'Asset Portfolio Director', 'Urban Systems Consultant', 'Bio-Credit Investor'],
  hub    : ['Transit Dispatcher', 'Commuter Routing Clerk', 'Node Maintenance Tech', 'Rail Safety Inspector', 'Data Courier'],
  foundry: ['Industrial Fabricator', 'Union Hall Organizer', 'Thermal Plant Operator', 'Structural Welder', 'Parts Inventory Lead'],
  fringe : ['Unlicensed Vendor', 'Subsistence Worker', 'Unregistered Carer', 'Informal Housing Fixer', 'Street Market Operative']
};

// ── Flagged behaviors ─────────────────────────────────────────────────
const BEHAVIOR_FLAGS = [
  { label: 'UNAUTHORIZED_MOVEMENT',  risk: 2, desc: 'Transit activity outside permitted zone windows.' },
  { label: 'ENCRYPTED_COMM_USAGE',   risk: 3, desc: 'Detected use of end-to-end encrypted messaging protocols.' },
  { label: 'ASSEMBLY_DETECTED',      risk: 3, desc: 'Observed in non-registered gathering of 5+ individuals.' },
  { label: 'WELFARE_IRREGULARITY',   risk: 2, desc: 'Welfare scoring inconsistency flagged by AI filter.' },
  { label: 'BIOMETRIC_MISMATCH',     risk: 4, desc: 'Facial recognition confidence below 72% threshold — possible evasion.' },
  { label: 'ANTI_REGIME_MEDIA',      risk: 5, desc: 'Accessed restricted broadcast content (VERA-9 or equivalent).' },
  { label: 'CASH_TRANSACTION',       risk: 1, desc: 'Non-traceable monetary exchange outside registry.' },
  { label: 'PERMIT_ZONE_VIOLATION',  risk: 2, desc: 'Entered restricted transit node without valid permit.' },
  { label: 'KNOWN_ASSOCIATE',        risk: 4, desc: 'Maintains social contact with registered dissident ID.' },
  { label: 'PATTERN_DEVIATION',      risk: 2, desc: 'Daily movement routine deviation exceeds +30% baseline.' }
];

// ── Risk tier definitions ─────────────────────────────────────────────
const RISK_TIERS = [
  { min: 0,  max: 19,  label: 'GREEN',    color: '#39ff14', desc: 'Fully compliant. No anomaly markers.' },
  { min: 20, max: 39,  label: 'GUARDED',  color: '#9df21c', desc: 'Minor deviations noted. Passive monitoring.' },
  { min: 40, max: 59,  label: 'AMBER',    color: '#ffb900', desc: 'Active surveillance recommended.' },
  { min: 60, max: 79,  label: 'ORANGE',   color: '#ff6600', desc: 'High-risk individual. Patrol flagged.' },
  { min: 80, max: 100, label: 'CRITICAL', color: '#ff0055', desc: 'Immediate intervention authorized.' }
];

// ── Seeded pseudo-random ──────────────────────────────────────────────
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Profile generator ─────────────────────────────────────────────────
export function generateCitizenProfile(civilian, simulationState) {
  // Deterministic seed from civilian identity
  const seed = Math.abs(Math.round(civilian.road.from.x * 137 + civilian.road.from.y * 293 + civilian.progress * 999));
  const rand = seededRand(seed);

  const districtId = civilian.districtId;
  const district   = simulationState.districts[districtId];

  // Name
  const firstName  = FIRST_NAMES [Math.floor(rand() * FIRST_NAMES.length)];
  const familyName = FAMILY_NAMES[Math.floor(rand() * FAMILY_NAMES.length)];
  const name       = `${firstName} ${familyName}`;

  // ID
  const citizenId = `NV-${Math.floor(rand() * 90000 + 10000)}-${String.fromCharCode(65 + Math.floor(rand() * 26))}`;

  // Age
  const age = 18 + Math.floor(rand() * 55);

  // Occupation
  const occs = OCCUPATIONS[districtId] || OCCUPATIONS.hub;
  const occupation = occs[Math.floor(rand() * occs.length)];

  // Social score base: district compliance drives it
  const baseScore = Math.max(5, Math.min(100, district.compliance + (rand() * 40 - 20)));
  const socialScore = Math.round(baseScore);

  // Risk score: inverse of social score + district unrest influence
  const rawRisk = (100 - socialScore) * 0.5 + district.unrest * 0.5 + rand() * 15;
  const riskScore = Math.round(Math.min(100, Math.max(0, rawRisk)));

  // Tier
  const tier = RISK_TIERS.find(t => riskScore >= t.min && riskScore <= t.max) || RISK_TIERS[0];

  // Welfare eligibility: low social score = excluded
  const welfareEligible = socialScore >= 55 || !simulationState.tools.welfare_score.active;
  const welfareStatus = welfareEligible
    ? { label: 'ELIGIBLE', color: '#39ff14' }
    : { label: 'EXCLUDED — AI SCORED', color: '#ff0055' };

  // Transit permit: gatekeeping tool
  const hasPermit = socialScore >= 45 || !simulationState.tools.permit_filter.active;
  const permitStatus = hasPermit
    ? { label: 'VALID', color: '#39ff14' }
    : { label: 'REVOKED — SCORE THRESHOLD', color: '#ff0055' };

  // Behavioral flags: more flags for higher risk / lower compliance districts
  const flagCount = Math.floor(riskScore / 25) + (rand() > 0.6 ? 1 : 0);
  const shuffled  = [...BEHAVIOR_FLAGS].sort(() => rand() - 0.5);
  const flags     = shuffled.slice(0, Math.min(flagCount, 4));

  // Surveillance coverage note
  const surveillanceLevel = district.surveillance;
  const coverageNote = surveillanceLevel > 70
    ? 'FULL BIOMETRIC COVERAGE'
    : surveillanceLevel > 40
    ? 'PARTIAL CAMERA COVERAGE'
    : 'BLIND ZONE — LOW COVERAGE';

  // Last seen location
  const locationLabels = {
    apex   : ['Apex Heights Corporate Arcology', 'Sky Level 44 Residential Pod', 'Exec Dining Quarter'],
    hub    : ['Platform 7 — Nexus Rail', 'Central Transit Exchange', 'Sub-Hub Commerce Level'],
    foundry: ['Foundry Row East — Sector 12', 'Union Hall Annex', 'Thermal Processing Yard'],
    fringe : ['Outland Market Strip', 'Shanty Block G-14', 'Unregistered Housing Zone']
  };
  const locations  = locationLabels[districtId] || locationLabels.hub;
  const lastSeen   = locations[Math.floor(rand() * locations.length)];

  // Consecutive days under registry monitoring
  const monitorDays = simulationState.tools.social_registry.active
    ? Math.floor(rand() * 180 + 1)
    : 0;

  return {
    name, citizenId, age, occupation,
    districtId, districtName: district.name,
    socialScore, riskScore, tier,
    welfareStatus, permitStatus,
    coverageNote, surveillanceLevel,
    flags, lastSeen, monitorDays,
    timestamp: simulationState.formatTime(simulationState.gameTime)
  };
}

// ── Modal renderer ────────────────────────────────────────────────────
export function openDossierModal(profile) {
  const modal = document.getElementById('dossierModal');
  if (!modal) return;

  const scoreColor = profile.tier.color;

  // Danger bar fill
  const riskPct  = profile.riskScore;
  const scorePct = profile.socialScore;

  // Flags HTML
  const flagsHtml = profile.flags.length === 0
    ? `<div class="dos-flag-none">NO BEHAVIORAL FLAGS RECORDED</div>`
    : profile.flags.map(f => `
        <div class="dos-flag">
          <span class="dos-flag-label" style="color:${f.risk >= 4 ? '#ff0055' : f.risk >= 3 ? '#ffb900' : '#39ff14'}">
            ▲ ${f.label}
          </span>
          <span class="dos-flag-desc">${f.desc}</span>
        </div>
      `).join('');

  const monitorHtml = profile.monitorDays > 0
    ? `<div class="dos-monitor-badge">📋 REGISTRY: UNDER CONTINUOUS MONITORING — ${profile.monitorDays} CONSECUTIVE DAYS</div>`
    : `<div class="dos-monitor-badge dos-monitor-off">REGISTRY: NOT ENROLLED</div>`;

  modal.querySelector('#dosName').textContent       = profile.name;
  modal.querySelector('#dosId').textContent         = profile.citizenId;
  modal.querySelector('#dosAge').textContent        = `AGE: ${profile.age}`;
  modal.querySelector('#dosOcc').textContent        = profile.occupation;
  modal.querySelector('#dosDistrict').textContent   = profile.districtName.toUpperCase();
  modal.querySelector('#dosLastSeen').textContent   = profile.lastSeen;
  modal.querySelector('#dosCoverage').textContent   = profile.coverageNote;
  modal.querySelector('#dosCoverage').style.color   = profile.surveillanceLevel > 60 ? '#00f0ff' : '#ffb900';
  modal.querySelector('#dosTimestamp').textContent  = `ACCESSED: ${profile.timestamp}`;

  // Social Score bar
  modal.querySelector('#dosSocialScore').textContent = `${profile.socialScore}`;
  modal.querySelector('#dosSocialBar').style.width   = `${scorePct}%`;
  modal.querySelector('#dosSocialBar').style.background = scorePct > 55 ? '#39ff14' : scorePct > 35 ? '#ffb900' : '#ff0055';

  // Risk Score
  modal.querySelector('#dosRiskScore').textContent   = `${profile.riskScore}`;
  modal.querySelector('#dosRiskBar').style.width     = `${riskPct}%`;
  modal.querySelector('#dosRiskBar').style.background = scoreColor;
  modal.querySelector('#dosRiskTier').textContent    = `THREAT CLASS: ${profile.tier.label}`;
  modal.querySelector('#dosRiskTier').style.color    = scoreColor;
  modal.querySelector('#dosRiskDesc').textContent    = profile.tier.desc;

  // Welfare & Permit
  modal.querySelector('#dosWelfare').textContent     = profile.welfareStatus.label;
  modal.querySelector('#dosWelfare').style.color     = profile.welfareStatus.color;
  modal.querySelector('#dosPermit').textContent      = profile.permitStatus.label;
  modal.querySelector('#dosPermit').style.color      = profile.permitStatus.color;

  // Flags
  modal.querySelector('#dosFlagsContainer').innerHTML = flagsHtml;

  // Monitor badge
  modal.querySelector('#dosMonitorBadge').innerHTML  = monitorHtml;

  // Draw mini facial scan avatar
  drawFacialScan(modal.querySelector('#dosFaceCanvas'), profile);

  modal.classList.remove('hidden');
  modal.classList.add('dos-open');
}

export function closeDossierModal() {
  const modal = document.getElementById('dossierModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('dos-open');
  }
}

// ── Procedural facial scan art ─────────────────────────────────────────
function drawFacialScan(canvas, profile) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const seed  = parseInt(profile.citizenId.replace(/\D/g, '')) || 12345;
  const rand  = seededRand(seed);
  const color = profile.tier.color;

  ctx.fillStyle = '#030508';
  ctx.fillRect(0, 0, W, H);

  // Scan grid
  ctx.strokeStyle = '#0c1822';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < W; i += 8) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
  }

  // Face outline
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.shadowColor = color;
  ctx.shadowBlur  = 6;

  // Head shape
  ctx.beginPath();
  ctx.ellipse(W / 2, H * 0.42, W * 0.26, H * 0.32, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Neck/shoulders
  ctx.beginPath();
  ctx.moveTo(W * 0.4, H * 0.72);
  ctx.lineTo(W * 0.3, H);
  ctx.moveTo(W * 0.6, H * 0.72);
  ctx.lineTo(W * 0.7, H);
  ctx.stroke();

  // Eyes (position varies by person)
  const eyeY   = H * 0.38 + rand() * H * 0.06;
  const eyeOff = W * 0.10 + rand() * W * 0.04;
  const eyeW   = 5 + rand() * 4;

  ctx.fillStyle = color;
  ctx.fillRect(W / 2 - eyeOff - eyeW / 2, eyeY, eyeW, 3);
  ctx.fillRect(W / 2 + eyeOff - eyeW / 2, eyeY, eyeW, 3);

  // Nose bridge line
  ctx.beginPath();
  ctx.moveTo(W / 2, eyeY + 5);
  ctx.lineTo(W / 2, H * 0.52);
  ctx.stroke();

  // Mouth
  const mouthY = H * 0.56 + rand() * H * 0.04;
  ctx.beginPath();
  ctx.moveTo(W / 2 - W * 0.08, mouthY);
  ctx.lineTo(W / 2 + W * 0.08, mouthY);
  ctx.stroke();

  // Targeting reticle
  ctx.shadowBlur = 4;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;
  const cx = W / 2, cy = H * 0.42;
  const r  = W * 0.28;
  // Corner brackets
  const bs = 8;
  [[cx - r, cy - r], [cx + r, cy - r], [cx - r, cy + r], [cx + r, cy + r]].forEach(([bx, by]) => {
    const sx = bx < cx ? 1 : -1;
    const sy = by < cy ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + sx * bs, by); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + sy * bs); ctx.stroke();
  });

  // ID overlay text
  ctx.shadowBlur  = 0;
  ctx.fillStyle   = `${color}99`;
  ctx.font        = '6px monospace';
  ctx.fillText(`ID: ${profile.citizenId}`, 3, H - 8);
  ctx.fillText(`RISK: ${profile.riskScore}`, 3, H - 2);
}
