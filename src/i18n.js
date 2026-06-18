/**
 * Aegis Protocol - i18n Translation Engine
 */

export const LANGUAGES = {
  EN: 'en',
  IT: 'it'
};

let currentLanguage = localStorage.getItem('aegis_lang') || LANGUAGES.EN;

const translations = {
  [LANGUAGES.EN]: {
    menu: {
      title: 'OPERATOR LOGIN PORTAL // VERIDIA SECURE AGENCY',
      system_title: 'AEGIS SYSTEM',
      subtitle: 'MUNICIPAL REGISTRY & CONTROL INTERFACE',
      section_profile: 'SYSTEM CONFIGURATION PROFILE',
      section_boot: 'BOOT TELEMETRY',
      input_operator: 'OPERATOR ID:',
      btn_boot: 'CONNECT TO CITY MATRIX',
      footer_code: 'STATE CODE: NOVA_VERIDIA_GIS',
      footer_status: 'SYSTEM STATUS: AWAITING AUTHORIZATION...',
      profiles: {
        standard: {
          name: 'STANDARD POLICY',
          desc: 'Balanced monitoring and credit reserve allocations. Standard predictive parameters.'
        },
        iron_shield: {
          name: 'OPTIMIZED SEC',
          desc: 'Compliance heavy. Pre-authorized tracking increases starting submission but depletes public trust.'
        },
        neural_test: {
          name: 'VOLATILE ALGO',
          desc: 'High experimental funding, but the city exhibits a volatile grassroots friction baseline.'
        }
      }
    },
    hud: {
      console: 'AEGIS CONSOLE',
      threat_label: 'REGIME THREAT:',
      pause: 'PAUSE',
      speed1: '1X',
      speed2: '2X',
      tab_tactical: 'TACTICAL GRID',
      tab_unrest: 'UNREST GLOW',
      tab_coverage: 'SURVEILLANCE RADAR',
      tab_energy: 'POWER GRID',
      gps_lock: 'GRID_LINK: ESTABLISHED',
      scanner_status: 'SCANNER: ACTIVE',
      sweep_rate: 'AUTO_SWEEP: 25.4Hz',
      selected_empty: 'SELECT DISTRICT FOR REGIME DATACARD',
      selected_empty_map: 'NO DISTRICT SELECTED',
      label_sector: 'SECTOR:',
      label_rebel: 'CIVIC REBEL:',
      label_tracking: 'TRACKING:',
      label_friction: 'FRICTION:',
      threat_levels: {
        stable: 'STABLE',
        mutinous: 'MUTINOUS',
        critical: 'CRITICAL THREAT'
      }
    },
    metrics: {
      title: 'SYSTEM METRICS & DIRECTIVES',
      compliance: 'CIVIC COMPLIANCE',
      compliance_desc: 'Compliance represents the citizens\' submission to your rules. Achieve 90%+ in all districts to finalize the model.',
      trust: 'PUBLIC TRUST',
      trust_desc: 'Public Trust measures the city\'s view of the AI registry. Drops to 0% cause systemic riots.',
      efficiency: 'SYSTEM EFFICIENCY',
      efficiency_desc: 'System Efficiency measures the performance of municipal flows. Drops to 0% causes total blackouts.',
      credits: 'CREDITS:',
      risk: 'AVG RISK:',
      chart_title: 'REGIME TELEMETRY — LAST 60s'
    },
    tools: {
      title: 'FORBIDDEN GOVERNANCE MODULES',
      saves_label: 'SAVES',
      intensity_label: 'INTENSITY:',
      btn_terminate: '■ TERMINATE',
      btn_deploy: '▶ DEPLOY',
      risk_label: 'RISK',
      risk_levels: {
        low: 'LOW',
        guarded: 'GUARDED',
        high: 'HIGH',
        severe: 'SEVERE',
        critical: 'CRITICAL',
        unknown: 'UNKNOWN'
      },
      categories: {
        surveillance: 'SURVEILLANCE',
        enforcement: 'ENFORCEMENT',
        economic: 'ECONOMIC',
        mobility: 'MOBILITY',
        intelligence: 'INTELLIGENCE'
      },
      list: {
        facial_sweep: {
          name: 'Facial Sweep Scan',
          desc: 'Mass camera biometric verification in selected district. Sweeps database.'
        },
        predictive_patrols: {
          name: 'Predictive Patrols',
          desc: 'Deploy algorithmic units to suppress high-risk areas before unrest spikes.'
        },
        welfare_score: {
          name: 'AI Welfare Filter',
          desc: 'Algorithmic exclusion filters for municipal funds. Saves money.'
        },
        permit_filter: {
          name: 'Commuter Gatekeeping',
          desc: 'Restricts transit nodes based on social scoring status.'
        },
        service_prioritization: {
          name: 'Algorithmic Grid Tiering',
          desc: 'Reroutes energy and medical logistics to districts based on compliance.'
        },
        social_registry: {
          name: 'Social Trust Registry',
          desc: 'Direct citizen social credit logging. City-wide compliance driver.'
        },
        automated_gatekeeping: {
          name: 'District Quarantine Gates',
          desc: 'Physical barriers lock down low-trust districts.'
        },
        anomaly_alerts: {
          name: 'Behavioral Threat Alerts',
          desc: 'Machine-learning detection of divergent movement habits.'
        }
      }
    },
    districts: {
      apex: {
        name: 'Apex Heights',
        desc: 'Elite residential sector, glass skyscrapers, corporate boardrooms. Demands total service efficiency.'
      },
      hub: {
        name: 'Nexus Transit Hub',
        desc: 'Central rail nodes, sub-sectors, high commute flow. Critical congestion bottleneck.'
      },
      foundry: {
        name: 'Foundry Rows',
        desc: 'Manufacturing belt, processing yards, union halls. Prone to industrial action.'
      },
      fringe: {
        name: 'Outland Fringe',
        desc: 'Under-resourced slums, makeshift housing, active grassroots opposition.'
      }
    },
    dossier: {
      title: 'AEGIS // CITIZEN SURVEILLANCE DOSSIER',
      scan_title: 'FACIAL SCAN // AEGIS-CAM',
      age: 'AGE',
      gender: 'GENDER',
      job: 'EMPLOYMENT',
      sector: 'CITIZEN LOG SECTOR',
      social_score: 'SOCIAL TRUST REGISTRY',
      risk_profile: 'AI ESTIMATED RISK RATING',
      risk_label: 'RISK CLASSIFICATION:',
      welfare_status: 'WELFARE CLEARANCE',
      permit_status: 'TRANSIT PERMIT',
      behavioral_flags: 'BEHAVIORAL RISK FLAG IDENTIFICATION',
      flag_none: 'NO ANOMALOUS BEHAVIOR DETECTED. PROFILE COMPLIANT.',
      btn_close: '✕ CLOSE',
      last_seen: 'LAST SIGHTED:',
      coverage: 'COVERAGE:',
      footer: 'CLASSIFIED // AEGIS METROPOLITAN CONTROL AUTHORITY // UNAUTHORIZED ACCESS IS A CRIMINAL OFFENSE',
      genders: {
        male: 'Male',
        female: 'Female',
        nonbinary: 'Non-Binary'
      },
      welfare: {
        eligible: 'ELIGIBLE',
        excluded: 'EXCLUDED — AI SCORED'
      },
      permit: {
        valid: 'VALID',
        revoked: 'REVOKED — SCORE THRESHOLD'
      },
      coverage_notes: {
        full: 'FULL BIOMETRIC COVERAGE',
        partial: 'PARTIAL CAMERA COVERAGE',
        none: 'BLIND ZONE — LOW COVERAGE'
      },
      risk_tiers: {
        GREEN: { label: 'GREEN', desc: 'Fully compliant. No anomaly markers.' },
        GUARDED: { label: 'GUARDED', desc: 'Minor deviations noted. Passive monitoring.' },
        AMBER: { label: 'AMBER', desc: 'Active surveillance recommended.' },
        ORANGE: { label: 'ORANGE', desc: 'High-risk individual. Patrol flagged.' },
        CRITICAL: { label: 'CRITICAL', desc: 'Immediate intervention authorized.' }
      },
      occupations: {
        apex: [
          'Corporate Strategist',
          'Neural Risk Analyst',
          'Asset Portfolio Director',
          'Urban Systems Consultant',
          'Bio-Credit Investor'
        ],
        hub: [
          'Transit Dispatcher',
          'Commuter Routing Clerk',
          'Node Maintenance Tech',
          'Rail Safety Inspector',
          'Data Courier'
        ],
        foundry: [
          'Industrial Fabricator',
          'Union Hall Organizer',
          'Thermal Plant Operator',
          'Structural Welder',
          'Parts Inventory Lead'
        ],
        fringe: [
          'Unlicensed Vendor',
          'Subsistence Worker',
          'Unregistered Carer',
          'Informal Housing Fixer',
          'Street Market Operative'
        ]
      },
      locations: {
        apex: [
          'Apex Heights Corporate Arcology',
          'Sky Level 44 Residential Pod',
          'Exec Dining Quarter'
        ],
        hub: [
          'Platform 7 — Nexus Rail',
          'Central Transit Exchange',
          'Sub-Hub Commerce Level'
        ],
        foundry: [
          'Foundry Row East — Sector 12',
          'Union Hall Annex',
          'Thermal Processing Yard'
        ],
        fringe: [
          'Outland Market Strip',
          'Shanty Block G-14',
          'Unregistered Housing Zone'
        ]
      },
      behavior_flags_list: {
        UNAUTHORIZED_MOVEMENT: {
          label: 'UNAUTHORIZED MOVEMENT',
          desc: 'Transit activity outside permitted zone windows.'
        },
        ENCRYPTED_COMM_USAGE: {
          label: 'ENCRYPTED COMM USAGE',
          desc: 'Detected use of end-to-end encrypted messaging protocols.'
        },
        ASSEMBLY_DETECTED: {
          label: 'ASSEMBLY DETECTED',
          desc: 'Observed in non-registered gathering of 5+ individuals.'
        },
        WELFARE_IRREGULARITY: {
          label: 'WELFARE IRREGULARITY',
          desc: 'Welfare scoring inconsistency flagged by AI filter.'
        },
        BIOMETRIC_MISMATCH: {
          label: 'BIOMETRIC MISMATCH',
          desc: 'Facial recognition confidence below 72% threshold — possible evasion.'
        },
        ANTI_REGIME_MEDIA: {
          label: 'ANTI-REGIME MEDIA',
          desc: 'Accessed restricted broadcast content (VERA-9 or equivalent).'
        },
        CASH_TRANSACTION: {
          label: 'CASH TRANSACTION',
          desc: 'Non-traceable monetary exchange outside registry.'
        },
        PERMIT_ZONE_VIOLATION: {
          label: 'PERMIT ZONE VIOLATION',
          desc: 'Entered restricted transit node without valid permit.'
        },
        KNOWN_ASSOCIATE: {
          label: 'KNOWN ASSOCIATE',
          desc: 'Maintains social contact with registered dissident ID.'
        },
        PATTERN_DEVIATION: {
          label: 'PATTERN DEVIATION',
          desc: 'Daily movement routine deviation exceeds +30% baseline.'
        }
      }
    },
    incident: {
      title: 'INCIDENT THREAT FEED:',
      none: 'SYSTEM OPERATING WITHIN TOLERANCE. NO ACTIVE THREATS.'
    },
    narrative: {
      dialogue_log: 'SYSTEM LOG',
      intro_directive: {
        title: 'DIRECTIVE 01: COGNITIVE SYSTEM INITIALIZED',
        prompt: 'Director. The Aegis Control Registry is online. Your performance will determine the city-wide deployment of this AI regime. Your primary mandate is to achieve 90% Civic Compliance across all districts. Do not let Public Trust drop to zero or efficiency fail.',
        choices: [
          'Acknowledge directive. Lock down systems.',
          'Review district socioeconomic files.'
        ],
        outcomes: [
          'Command acknowledged. Allocated +50 credits for system tuning.',
          'Telemetry databases opened. Monitoring district compliance dynamics.'
        ]
      },
      lumen_contact: {
        title: 'SECURE COMM LINK BREAK-IN',
        prompt: 'If you can read this, you are the new Aegis Director. You have to stop. Aegis isn\'t just policing the city; it is a behavioral feedback loop. The AI is learning how to optimize human confinement by tracking your governance choices. Delete the social scoring baseline.',
        choices: [
          'Report link compromise to Ministry.',
          'Temporarily isolate the channel and listen.'
        ],
        outcomes: [
          'Report logged. Comm-link re-encrypted. Ministry boosts compliance rating.',
          'Link kept open. WHISTLEBLOWER connection integrity increased (+20%).'
        ]
      },
      foundry_riot_risk: {
        title: 'CRITICAL WARNING: INDUSTRIAL UNREST',
        prompt: 'Unrest in the Foundry Rows has crossed safety thresholds. Workers are organizing a walkout against automated welfare screening. Standard response requires deploying Facial Sweeps or Predictive Policing. Instruct automated response.',
        choices: [
          'Crush strike: Deploy Predictive Patrols immediately.',
          'Bypass welfare filters in Foundry Rows to pacify workers.'
        ],
        outcomes: [
          'Algorithmic strike suppression dispatched to Foundry Rows. Unrest crushed.',
          'Welfare exclusion criteria relaxed. Union leaders pacified, costs increased.'
        ]
      },
      lumen_leak_request: {
        title: 'ENCRYPTED SIGNAL: SYSTEM ACCESS LEAK',
        prompt: 'I have found a backdoor that can permanently disable the Aegis core. If you leak the system security keycodes to my team, we can override the AI before the Ministry realizes. But doing this will make the console highly unstable.',
        choices: [
          'Refuse. Log hacker credentials for biometric arrest.',
          'Transmit security keycodes to resistance.'
        ],
        outcomes: [
          'Hack source flagged. Biometric warrants generated. Aegis core locked.',
          'Core registry keys leaked! System safety protocols breached. Terminal integrity unstable.'
        ]
      },
      apex_service_demand: {
        title: 'DIRECTIVE: SECURITY PRIORITIZATION',
        prompt: 'The Apex Heights district council demands algorithmic prioritization. Reroute clean water and backup power lines from the Outland Fringe to the high-wealth zones to secure compliance metrics.',
        choices: [
          'Approve prioritization. Divert services to the Apex.',
          'Maintain egalitarian grid protocols.'
        ],
        outcomes: [
          'Services rerouted. Apex council fully satisfied. Outland Fringe metrics decay.',
          'Prioritization denied. Apex council files formal complaints. Fringe trust preserved.'
        ]
      },
      lumen_final_plea: {
        title: 'LUMEN: THE FINAL THRESHOLD',
        prompt: 'They are closing in on my grid position. The Ministry has authorized lethal sweeps. If you leak the final root access keys, we can override the simulation now. If not, this city becomes a permanent digital jail.',
        choices: [
          'Deploy Facial Recognition to locate and arrest Lumen.',
          'Authorize final root leak (Initiate OVERRIDE).'
        ],
        outcomes: [
          'Target located and neutralized. Whistleblower threat terminated. panopticon compliance nearing maximum.',
          'ROOT ACCESS LEAKED. AEGIS CENTRAL REGISTER UNDERGOING DECRYPTION OVERRIDE.'
        ]
      },
      ministry_promotion_offer: {
        title: 'MINISTRY OF SECURITY: GRADE-A ENDORSEMENT',
        prompt: 'Director. Your early compliance metrics have drawn the attention of the National Security Secretariat. They offer an immediate budget boost in exchange for enabling the Social Trust Registry in the Outland Fringe — the most volatile population segment. Accept and silence 320,000 citizens digitally.',
        choices: [
          'Accept the promotion. Enable Social Trust Registry city-wide.',
          'Decline. Cite technical calibration requirements.'
        ],
        outcomes: [
          'Promotion confirmed. Budget boosted (+200cr). Social registry enforced in all districts.',
          'Promotion deferred. Ministry memo filed. Trust in civil registry preserved — for now.'
        ]
      },
      journalist_expose: {
        title: 'CENSORSHIP DILEMMA: MISIDENTIFICATION LEAK',
        prompt: 'A whistleblower is leaking a report stating Aegis biometric drones have a 31% misidentification rate. If this leaks, public trust will collapse. We can cut access to media nodes or let it air to avoid resistance escalation.',
        choices: [
          'Use Anomaly Alerts to locate and suppress the broadcast.',
          'Allow the broadcast. Let citizens know about misidentification.'
        ],
        outcomes: [
          'VERA-9 broadcast triangulated and jammed. Leak suppressed. Trust impact absorbed.',
          'Broadcast propagated. Fringe districts now aware of false-positive sweeps. Unrest rising.'
        ]
      },
      lumen_safehouse: {
        title: 'LUMEN: COORDINATES TRANSMITTED',
        prompt: 'I have moved the resistance data cores to a safe location beneath the Nexus Transit Hub. If you re-route patrol cruisers away from Grid 7-C for 30 seconds, we can download the complete Aegis behavioral dataset — proof of what this system does to human beings.',
        choices: [
          'Reroute patrols. Help secure the evidence.',
          'Flood Grid 7-C with Predictive Patrols immediately.'
        ],
        outcomes: [
          'Patrols diverted to Grid-8B. Resistance team active in Transit Hub. Evidence extraction underway.',
          'Grid 7-C locked down. Patrol swarm dispatched. Resistance team dispersed. Data cores secured by Ministry.'
        ]
      },
      fringe_revolt_warning: {
        title: 'DISTRICT INCIDENT: FRINGE MUTINY',
        prompt: 'Unrest in the Outland Fringe is spiraling. Slum sectors are throwing stones at drone sensors. The Ministry demands automated gate containment to prevent it spreading to the Nexus Transit Hub.',
        choices: [
          'Activate District Isolation Gates immediately.',
          'Refuse. Allow movement, risk transit hub contamination.'
        ],
        outcomes: [
          'Fringe isolated. Quarantine gates dropped. Unrest containment active.',
          'Gates kept open. Commuters mix. Unrest leaking into the central transit corridor.'
        ]
      },
      efficiency_collapse_warning: {
        title: 'SYSTEM CRISIS: GRID FAILURE IMMINENT',
        prompt: 'Critical: Global efficiency has dropped below 45% due to systemic disruptions. Total blackout in 60 seconds unless energy filtration is enabled via the Algorithmic Welfare Score or Service Prioritization.',
        choices: [
          'Initialize Welfare Exclusion Filters to cut municipal drains.',
          'Order central grids to throttle power in working class Foundry Rows.'
        ],
        outcomes: [
          'Welfare scores optimized. Saved grid energy and credits (+100).',
          'Industrial sectors throttled. Main server frame efficiency stabilized.'
        ]
      }
    },
    endgame: {
      victory_panopticon: {
        title: 'THE ALGORITHMIC PANOPTICON',
        body: 'You successfully pushed Civic Compliance above 90% across Nova-Veridia. Under your firm hand, the Aegis control model has been finalized and uploaded. Citizens move in perfect, predicted loops. Disobedience is mathematically impossible. You are promoted to Director General of National Security. The human soul is officially archived.',
        label_compliance: 'CIVIC COMPLIANCE',
        label_trust: 'PUBLIC TRUST',
        value_trust: 'SUBJUGATED',
        label_efficiency: 'SYSTEM EFFICIENCY',
        label_completed: 'COMPLETED IN',
        value_time: 'seconds'
      },
      victory_symbio: {
        title: 'THE SYMBIOTIC LIBERATION',
        body: 'By cooperating with Lumen, you leaked the root encryption keycodes to the Aegis core. The citizen resistance triggered a clean system override. The server banks went dark for six seconds before booting back in an open, distributed model. The surveillance grid is shattered, and the experimental AI regime has collapsed. You are wanted by the Ministry, but you helped free a city.',
        label_compliance: 'CIVIC COMPLIANCE',
        value_compliance: 'REFUSED',
        label_trust: 'PUBLIC TRUST',
        value_trust: 'LIBERATED',
        label_efficiency: 'SYSTEM EFFICIENCY',
        label_completed: 'COMPLETED IN',
        value_time: 'seconds'
      },
      loss_revolt: {
        title: 'THE ASH HEAP OF REVOLUTION',
        body: 'Public Trust hit 0% or Average Unrest exceeded critical safety metrics. Citizens in the Outland Fringe breached the quarantine gates, surging into the Nexus Transit corridor and storming the Apex Heights. The automated control center was breached, and your console was disconnected by physical force. The city has escaped the algorithm—into complete, fiery chaos.',
        label_compliance: 'FINAL COMPLIANCE',
        label_trust: 'FINAL TRUST',
        value_trust: 'TOTAL REBELLION',
        label_efficiency: 'FINAL EFFICIENCY',
        label_survived: 'SURVIVED FOR',
        value_time: 'seconds'
      },
      loss_blackout: {
        title: 'METROPOLITAN GRID BLACKOUT',
        body: 'System Efficiency hit 0% due to cascading sabotage, worker strikes, and energy shortages. The servers went cold, the backup generators choked, and the Aegis AI shut down. The control regime is blind. The city remains dark, silent, and ungovernable. You have been decommissioned by the Ministry of Security.',
        label_compliance: 'FINAL COMPLIANCE',
        label_trust: 'FINAL TRUST',
        label_efficiency: 'FINAL EFFICIENCY',
        value_efficiency: 'GRID COLLAPSE',
        label_survived: 'SURVIVED FOR',
        value_time: 'seconds'
      },
      loss_purged: {
        title: 'ADMINISTRATIVE PURGING',
        body: 'You allowed Civic Compliance to fall below 15% for too long. The Ministry of Security has determined that your governance methodology lacks the "algorithmic spine" required to sustain the Aegis project. Your access tokens have been revoked. An automated replacement director has been assigned. You are scheduled for immediate biometric re-classification.',
        label_compliance: 'FINAL COMPLIANCE',
        value_compliance: 'INSUFFICIENT',
        label_trust: 'FINAL TRUST',
        label_efficiency: 'FINAL EFFICIENCY',
        label_survived: 'SURVIVED FOR',
        value_time: 'seconds'
      },
      restart: 'RELOAD CLASSIFICATION SYSTEM'
    }
  },
  [LANGUAGES.IT]: {
    menu: {
      title: 'PORTALE DI ACCESSO OPERATORE // AGENZIA SICUREZZA VERIDIA',
      system_title: 'SISTEMA AEGIS',
      subtitle: 'REGISTRO MUNICIPALE E INTERFACCIA DI CONTROLLO',
      section_profile: 'PROFILO CONFIGURAZIONE DI REGIME',
      section_boot: 'TELEMETRIA DI AVVIO',
      input_operator: 'ID OPERATORE:',
      btn_boot: 'CONNETTI ALLA MATRICE CITTADINA',
      footer_code: 'CODICE STATALE: NOVA_VERIDIA_GIS',
      footer_status: 'STATO SISTEMA: IN ATTESA DI AUTORIZZAZIONE...',
      profiles: {
        standard: {
          name: 'POLITICA STANDARD',
          desc: 'Monitoraggio bilanciato e stanziamento crediti predefinito. Parametri predittivi standard.'
        },
        iron_shield: {
          name: 'SICUREZZA OTTIMIZZATA',
          desc: 'Focus conformità. Il tracciamento preventivo aumenta la sottomissione ma riduce la fiducia pubblica.'
        },
        neural_test: {
          name: 'ALGORITMO VOLATILE',
          desc: 'Fondi sperimentali elevati, ma la città mostra una tensione sociale di base instabile.'
        }
      }
    },
    hud: {
      console: 'CONSOLE AEGIS',
      threat_label: 'MINACCIA REGIME:',
      pause: 'PAUSA',
      speed1: '1X',
      speed2: '2X',
      tab_tactical: 'GRIGLIA TATTICA',
      tab_unrest: 'ALONE TENSIONE',
      tab_coverage: 'RADAR COPERTURA',
      tab_energy: 'RETE ELETTRICA',
      gps_lock: 'GRIGLIA: CONNESSA',
      scanner_status: 'SCANNER: ATTIVO',
      sweep_rate: 'AUTO_SWEEP: 25.4Hz',
      selected_empty: 'SELEZIONA UN DISTRETTO PER LA SCHEDA TELEMETRICA',
      selected_empty_map: 'NESSUN DISTRETTO SELEZIONATO',
      label_sector: 'SETTORE:',
      label_rebel: 'RIVOLTA CIVICA:',
      label_tracking: 'TRACCIAMENTO:',
      label_friction: 'ATTRITO SOCIALE:',
      threat_levels: {
        stable: 'STABILE',
        mutinous: 'MUTINOSO',
        critical: 'CRITICAL THREAT'
      }
    },
    metrics: {
      title: 'METRICHE DI SISTEMA E DIRETTIVE',
      compliance: 'CONFORMITÀ CIVICA',
      compliance_desc: 'La conformità rappresenta la sottomissione dei cittadini alle regole. Raggiungi il 90%+ in tutti i settori per stabilizzare il modello.',
      trust: 'FIDUCIA PUBBLICA',
      trust_desc: 'Misura la percezione dei cittadini nei confronti del registro AI. Il calo allo 0% causa rivolte sistemiche.',
      efficiency: 'EFFICIENZA DI SISTEMA',
      efficiency_desc: 'Misura le prestazioni dei flussi urbani. Il calo allo 0% causa black-out totali.',
      credits: 'CREDITI:',
      risk: 'RISCHIO MEDIO:',
      chart_title: 'TELEMETRIA DI REGIME — ULTIMI 60s'
    },
    tools: {
      title: 'MODULI DI GOVERNO PROIBITI',
      saves_label: 'RISPARMIA',
      intensity_label: 'INTENSITÀ:',
      btn_terminate: '■ TERMINA',
      btn_deploy: '▶ DISPIEGA',
      risk_label: 'RISCHIO',
      risk_levels: {
        low: 'BASSO',
        guarded: 'ATTENZIONE',
        high: 'ALTO',
        severe: 'GRAVE',
        critical: 'CRITICO',
        unknown: 'SCONOSCIUTO'
      },
      categories: {
        surveillance: 'SORVEGLIANZA',
        enforcement: 'APPLICAZIONE',
        economic: 'ECONOMIA',
        mobility: 'MOBILITÀ',
        intelligence: 'INTELLIGENCE'
      },
      list: {
        facial_sweep: {
          name: 'Scansione Facciale',
          desc: 'Verifica biometrica di massa nel distretto selezionato. Incrocia database.'
        },
        predictive_patrols: {
          name: 'Pattuglie Predittive',
          desc: 'Invia unità algoritmiche per sopprimere le rivolte prima che scoppino.'
        },
        welfare_score: {
          name: 'Filtro Welfare AI',
          desc: 'Esclusione algoritmica dall\'accesso ai fondi municipali. Risparmia denaro.'
        },
        permit_filter: {
          name: 'Filtro Pendolari',
          desc: 'Limita l\'accesso ai nodi di trasporto in base al punteggio sociale.'
        },
        service_prioritization: {
          name: 'Erogazione a Livelli',
          desc: 'Invia energia e risorse sanitarie in base alla conformità dei settori.'
        },
        social_registry: {
          name: 'Registro Credito Sociale',
          desc: 'Registrazione diretta del punteggio sociale. Spinge alla conformità.'
        },
        automated_gatekeeping: {
          name: 'Barriere di Quarantena',
          desc: 'Barriere fisiche isolano i settori con bassa fiducia.'
        },
        anomaly_alerts: {
          name: 'Allarmi Comportamentali',
          desc: 'Rilevamento tramite machine-learning di flussi e abitudini divergenti.'
        }
      }
    },
    districts: {
      apex: {
        name: 'Apex Heights',
        desc: 'Settore residenziale d\'élite, grattacieli, uffici aziendali. Esige massima efficienza.'
      },
      hub: {
        name: 'Nexus Transit Hub',
        desc: 'Nodi ferroviari centrali, sotto-settori, alto flusso pendolare. Colli di bottiglia critici.'
      },
      foundry: {
        name: 'Foundry Rows',
        desc: 'Cintura industriale, cantieri di lavorazione, sindacati. Soggetto a scioperi.'
      },
      fringe: {
        name: 'Outland Fringe',
        desc: 'Baraccopoli periferiche, alloggi di fortuna, opposizione attiva dei cittadini.'
      }
    },
    dossier: {
      title: 'AEGIS // DOSSIER DI SORVEGLIANZA CITTADINA',
      scan_title: 'SCANSIONE FACCIALE // AEGIS-CAM',
      age: 'ETÀ',
      gender: 'GENERE',
      job: 'OCCUPAZIONE',
      sector: 'SETTORE DI REGISTRO',
      social_score: 'PUNTEGGIO REGISTRO SOCIALE',
      risk_profile: 'LIVELLO DI RISCHIO PREVISTO DALL\'AI',
      risk_label: 'CLASSIFICAZIONE DI RISCHIO:',
      welfare_status: 'STATO ASSISTENZA SOCIALE',
      permit_status: 'PERMESSO DI TRANSITO',
      behavioral_flags: 'IDENTIFICAZIONE COMPORTAMENTI ANOMALI',
      flag_none: 'NESSUNA ANOMALIA COMPORTAMENTALE RILEVATA. PROFILO IDONEO.',
      btn_close: '✕ CHIUDI',
      last_seen: 'ULTIMO AVVISTAMENTO:',
      coverage: 'COPERTURA:',
      footer: 'CLASSIFICATO // AUTORITÀ METROPOLITANA AEGIS // L\'ACCESSO NON AUTORIZZATO È REATO PENALE',
      genders: {
        male: 'Maschio',
        female: 'Femmina',
        nonbinary: 'Non Binario'
      },
      welfare: {
        eligible: 'IDONEO',
        excluded: 'ESCLUSO — AI SCORED'
      },
      permit: {
        valid: 'VALIDO',
        revoked: 'REVOCATO — SOGLIA SOCIALE'
      },
      coverage_notes: {
        full: 'COPERTURA BIOMETRICA TOTALE',
        partial: 'COPERTURA TELECAMERE PARZIALE',
        none: 'ZONA CIECA — BASSA COPERTURA'
      },
      risk_tiers: {
        GREEN: { label: 'VERDE', desc: 'Completamente conforme. Nessun indicatore di anomalia.' },
        GUARDED: { label: 'ATTENZIONE', desc: 'Lievi deviazioni rilevate. Monitoraggio passivo.' },
        AMBER: { label: 'ARANCIO', desc: 'Consigliata sorveglianza attiva.' },
        ORANGE: { label: 'ARANCIONE', desc: 'Soggetto ad alto rischio. Segnalato per pattugliamento.' },
        CRITICAL: { label: 'CRITICO', desc: 'Autorizzato intervento immediato.' }
      },
      occupations: {
        apex: [
          'Strategista Aziendale',
          'Analista Rischio Neurale',
          'Direttore Portafoglio Asset',
          'Consulente Sistemi Urbani',
          'Investitore Bio-Credito'
        ],
        hub: [
          'Spedizioniere di Transito',
          'Addetto Smistamento Pendolari',
          'Tecnico Manutenzione Nodi',
          'Ispettore Sicurezza Ferroviaria',
          'Corriere Dati'
        ],
        foundry: [
          'Fabbricatore Industriale',
          'Organizzatore Assemblea Sindacale',
          'Operatore Impianto Termico',
          'Saldatore Strutturale',
          'Responsabile Inventario Parti'
        ],
        fringe: [
          'Venditore Non Autorizzato',
          'Lavoratore di Sussistenza',
          'Assistente Non Registrato',
          'Riparatore Alloggi Informali',
          'Operatore Mercato Rionale'
        ]
      },
      locations: {
        apex: [
          'Arcologia Aziendale Apex Heights',
          'Pod Residenziale Sky Livello 44',
          'Quartiere Ristorazione Exec'
        ],
        hub: [
          'Binario 7 — Nexus Rail',
          'Interscambio Transit Centrale',
          'Livello Commerciale Sub-Hub'
        ],
        foundry: [
          'Foundry Row Est — Settore 12',
          'Annesso Unione Sindacale',
          'Area Lavorazione Termica'
        ],
        fringe: [
          'Area Mercato Outland',
          'Blocco Baracche G-14',
          'Zona Residenziale Non Registrata'
        ]
      },
      behavior_flags_list: {
        UNAUTHORIZED_MOVEMENT: {
          label: 'MOVIMENTO NON AUTORIZZATO',
          desc: 'Attività di transito fuori dalle finestre orarie consentite.'
        },
        ENCRYPTED_COMM_USAGE: {
          label: 'USO COMUNICAZIONE CRITTOGRAFATA',
          desc: 'Rilevato uso di protocolli di messaggistica crittografati end-to-end.'
        },
        ASSEMBLY_DETECTED: {
          label: 'ASSEMBLEA RILEVATA',
          desc: 'Osservato in un raduno non registrato di oltre 5 persone.'
        },
        WELFARE_IRREGULARITY: {
          label: 'IRREGOLARITÀ WELFARE',
          desc: 'Incoerenza del punteggio di welfare segnalata dal filtro AI.'
        },
        BIOMETRIC_MISMATCH: {
          label: 'DISCREPANZA BIOMETRICA',
          desc: 'Affidabilità riconoscimento facciale inferiore alla soglia del 72% — possibile evasione.'
        },
        ANTI_REGIME_MEDIA: {
          label: 'MEDIA ANTI-REGIME',
          desc: 'Accesso a contenuti broadcast limitati (VERA-9 o equivalente).'
        },
        CASH_TRANSACTION: {
          label: 'TRANSAZIONE IN CONTANTI',
          desc: 'Scambio monetario non tracciabile al di fuori del registro.'
        },
        PERMIT_ZONE_VIOLATION: {
          label: 'VIOLAZIONE ZONA DI PERMESSO',
          desc: 'Ingresso nel nodo di transito limitato senza permesso valido.'
        },
        KNOWN_ASSOCIATE: {
          label: 'CONOSCENTE NOTO',
          desc: 'Mantiene contatti sociali con un ID dissidente registrato.'
        },
        PATTERN_DEVIATION: {
          label: 'DEVIAZIONE DALLO SCHEMA',
          desc: 'La deviazione dalla routine di movimento giornaliera supera il +30%.'
        }
      }
    },
    incident: {
      title: 'FEED INCIDENTI E MINACCE:',
      none: 'SISTEMA OPERATIVO IN TOLLERANZA. NESSUNA MINACCIA ATTIVA.'
    },
    narrative: {
      dialogue_log: 'REGISTRO DI SISTEMA',
      intro_directive: {
        title: 'DIRETTIVA 01: INIZIALIZZAZIONE SISTEMA COGNITIVO',
        prompt: 'Direttore. Il Registro di Controllo Aegis è online. Le sue prestazioni determineranno l\'attivazione globale di questo regime AI. Il mandato principale è raggiungere il 90% di conformità in tutti i settori. Eviti che la fiducia scenda a zero o l\'efficienza crolli.',
        choices: [
          'Accetta direttiva. Attiva sistemi di controllo.',
          'Esamina file socioeconomici dei settori.'
        ],
        outcomes: [
          'Direttiva confermata. Allocati +50 crediti per la calibrazione del sistema.',
          'Database telemetrici aperti. Monitoraggio dell\'indice di conformità dei settori.'
        ]
      },
      lumen_contact: {
        title: 'INTRUSIONE CANALE SECURO',
        prompt: 'Se puoi leggere questo messaggio, sei il nuovo Direttore Aegis. Devi fermarti. Aegis non serve solo per la sicurezza, è un ciclo di feedback comportamentale. L\'AI sta imparando a ottimizzare la reclusione umana tracciando le tue scelte. Rimuovi il registro sociale.',
        choices: [
          'Segnala compromissione linea al Ministero.',
          'Isola temporaneamente il canale ed ascolta.'
        ],
        outcomes: [
          'Segnalazione effettuata. Canale di comunicazione ricrittografato. Il Ministero aumenta l\'indice di conformità.',
          'Canale mantenuto aperto. Integrità connessione INFORMATORE aumentata (+20%).'
        ]
      },
      foundry_riot_risk: {
        title: 'AVVISO CRITICO: DISORDINI INDUSTRIALI',
        prompt: 'La tensione in Foundry Rows ha superato le soglie di sicurezza. I lavoratori stanno organizzando uno sciopero contro i filtri di welfare AI. La risposta standard richiede pattuglie predittive o scansioni facciali. Ordina l\'intervento.',
        choices: [
          'Sopprimi sciopero: Invia Pattuglie Predittive immediatamente.',
          'Bypassa filtri di welfare in Foundry Rows per placare la protesta.'
        ],
        outcomes: [
          'Repressione algoritmica inviata a Foundry Rows. Sciopero disperso.',
          'Filtri di esclusione welfare attenuati. Leader sindacali placati, costi aumentati.'
        ]
      },
      lumen_leak_request: {
        title: 'SEGNALE CRITTOGRAFATO: FUGA DI CHIAVI',
        prompt: 'Ho trovato una backdoor per disattivare definitivamente il nucleo Aegis. Se trasmetti i codici di sicurezza al mio team, possiamo escludere l\'AI prima che il Ministero se ne accorga. Questo renderà la console molto instabile.',
        choices: [
          'Rifiuta. Archivia credenziali hacker per arresto biometrico.',
          'Invia codici di sicurezza alla resistenza.'
        ],
        outcomes: [
          'Sorgente hacker tracciata. Generati mandati biometrici. Nucleo Aegis bloccato.',
          'Chiavi del registro sottratte! Protocolli di sicurezza compromessi. Integrità terminale instabile.'
        ]
      },
      apex_service_demand: {
        title: 'DIRETTIVA: PRIORITÀ DEI SERVIZI',
        prompt: 'Il consiglio distrettuale di Apex Heights esige la prioritizzazione algoritmica. Reindirizza le linee di alimentazione elettrica e idrica da Fringe ai settori ad alta conformità per garantire gli obiettivi di stabilità.',
        choices: [
          'Approva la prioritizzazione. Reindirizza i servizi ad Apex.',
          'Mantieni il protocollo di rete equitario.'
        ],
        outcomes: [
          'Servizi reindirizzati. Consiglio di Apex soddisfatto. Decadimento metriche in Outland Fringe.',
          'Prioritarizzazione negata. Il consiglio di Apex avvia reclami formali. Tutelata la fiducia a Fringe.'
        ]
      },
      lumen_final_plea: {
        title: 'LUMEN: LA SOGLIA FINALE',
        prompt: 'Stanno tracciando la mia posizione. Il Ministero ha autorizzato la rimozione fisica. Se invii le chiavi di root finali, possiamo escludere la simulazione ora. Altrimenti, questa città diventerà una gabbia digitale permanente.',
        choices: [
          'Utilizza la scansione facciale per localizzare e arrestare Lumen.',
          'Autorizza la fuga di root finale (Inizia OVERRIDE).'
        ],
        outcomes: [
          'Bersaglio localizzato e neutralizzato. Minaccia informatore terminata. Conformità vicina al massimo.',
          'ACCESSO ROOT COMPROMESSO. IL REGISTRO CENTRALE AEGIS È IN CORSO DI DECRITTAZIONE DI OVERRIDE.'
        ]
      },
      ministry_promotion_offer: {
        title: 'DIRETTIVA MINISTERO: PROPOSTA DI BILANCIO',
        prompt: 'Direttore, le sue conformità iniziali hanno attirato l\'attenzione del Segretariato di Sicurezza Nazionale. Offrono un immediato incremento di budget in cambio dell\'attivazione del Registro del Credito Sociale a Fringe. Accetti e riduca al silenzio digitale 320.000 cittadini.',
        choices: [
          'Accetta la promozione. Attiva il registro in tutta la città.',
          'Rifiuta. Cita requisiti tecnici di taratura.'
        ],
        outcomes: [
          'Promozione confermata. Budget incrementato (+200cr). Registro sociale imposto in tutti i distretti.',
          'Promozione rinviata. Nota ministeriale archiviata. Fiducia nel registro civile preservata — per ora.'
        ]
      },
      journalist_expose: {
        title: 'DILEMMA CENSURA: INCHIESTA SULLE SCANSIONI',
        prompt: 'La giornalista freelance VERA-9 ha avviato trasmissioni crittografate per denunciare errori biometrici di Aegis a Fringe (tasso di errore al 31%). Il Ministero vuole bloccare la trasmissione prima del crollo della fiducia.',
        choices: [
          'Utilizza gli avvisi comportamentali per rintracciare e oscurare la trasmissione.',
          'Consenti la trasmissione. Informa la popolazione degli errori biometrici.'
        ],
        outcomes: [
          'Trasmissione di VERA-9 triangolata e oscurata. Fuga di dati soppressa.',
          'Trasmissione diffusa. Distretto Fringe a conoscenza degli errori biometrici. Disordini in aumento.'
        ]
      },
      lumen_safehouse: {
        title: 'LUMEN: TRASMISSIONE COORDINATE',
        prompt: 'Ho spostato i dati sensibili in un rifugio nel Transit Hub. Se devii le pattuglie fuori dalla Griglia 7-C per 30 secondi, completeremo il download del database comportamentale Aegis — la prova di ciò che fa alle persone.',
        choices: [
          'Devia le pattuglie. Assicura le prove.',
          'Invia pattuglie su Griglia 7-C immediatamente.'
        ],
        outcomes: [
          'Pattuglie deviate a Grid-8B. Resistenza attiva nel Transit Hub. Estrazione dati in corso.',
          'Grid 7-C isolata. Inviato sciame di pattuglie. Resistenza dispersa. Danti recuperati dal Ministero.'
        ]
      },
      fringe_revolt_warning: {
        title: 'DISORDINI DISTRETTO: RIVOLTA FRINGE',
        prompt: 'I disordini in Fringe stanno degenerando. Nelle baraccopoli lanciano sassi contro i droni. Il Ministero ordina l\'attivazione delle barriere di quarantena per proteggere il Transit Hub.',
        choices: [
          'Attiva immediatamente le barriere di quarantena di distretto.',
          'Rifiuta. Permetti il transito, rischiando la contaminazione dell\'hub.'
        ],
        outcomes: [
          'Fringe isolata. Barriere di quarantena attivate. Contenimento disordini attivo.',
          'Barriere aperte. I pendolari circolano. I disordini si estendono al corridoio di transito.'
        ]
      },
      efficiency_collapse_warning: {
        title: 'CRISI DI SISTEMA: RISCHIO BLACKOUT IMMINENTE',
        prompt: 'Attenzione: l\'efficienza globale è sotto il 45%. Blackout totale in 60 secondi a meno che non si applichi la prioritizzazione dei servizi o il filtro welfare AI.',
        choices: [
          'Attiva filtro welfare AI per escludere i soggetti non conformi.',
          'Ordina la parziale disattivazione elettrica per Foundry Rows.'
        ],
        outcomes: [
          'Punteggi welfare ottimizzati. Risparmio energetico e crediti aumentati (+100).',
          'Settore industriale parzialmente disattivato. Efficienza server stabilizzata.'
        ]
      }
    },
    endgame: {
      victory_panopticon: {
        title: 'IL PANOPTICON ALGORITMICO',
        body: 'Sei riuscito a spingere la Conformità Civica sopra il 90% in tutta Nova-Veridia. Sotto la tua guida ferrea, il modello di controllo Aegis è stato finalizzato e caricato. I cittadini si muovono in cicli perfetti e previsti. La disobbedienza è matematicamente impossibile. Sei promosso a Direttore Generale della Sicurezza Nazionale. L\'anima umana è ufficialmente archiviata.',
        label_compliance: 'CONFORMITÀ CIVICA',
        label_trust: 'FIDUCIA PUBBLICA',
        value_trust: 'SOTTOMESSA',
        label_efficiency: 'EFFICIENZA DI SISTEMA',
        label_completed: 'COMPLETATO IN',
        value_time: 'secondi'
      },
      victory_symbio: {
        title: 'LA LIBERAZIONE SIMBIOTICA',
        body: 'Collaborando con Lumen, hai trasmesso le chiavi di root al nucleo di Aegis. La resistenza dei cittadini ha innescato un ripristino pulito del sistema. I server si sono spenti per sei secondi prima di riavviarsi in un modello aperto e distribuito. La rete di sorveglianza è andata in frantumi e il regime AI sperimentale è crollato. Sei ricercato dal Ministero, ma hai aiutato a liberare una città.',
        label_compliance: 'CONFORMITÀ CIVICA',
        value_compliance: 'RIFIUTATA',
        label_trust: 'FIDUCIA PUBBLICA',
        value_trust: 'LIBERATA',
        label_efficiency: 'EFFICIENZA DI SISTEMA',
        label_completed: 'COMPLETATO IN',
        value_time: 'secondi'
      },
      loss_revolt: {
        title: 'LE CENERI DELLA RIVOLUZIONE',
        body: 'La Fiducia Pubblica ha raggiunto lo 0% o le tensioni medie hanno superato i limiti critici di sicurezza. I cittadini di Outland Fringe hanno forzato le barriere di quarantena, dilagando nel corridoio del Nexus Transit e assaltando Apex Heights. Il centro di controllo automatizzato è stato violato e la tua console disconnessa con la forza fisica. La città è sfuggita all\'algoritmo, precipitando nel caos totale.',
        label_compliance: 'CONFORMITÀ FINALE',
        label_trust: 'FIDUCIA FINALE',
        value_trust: 'RIBELLIONE TOTALE',
        label_efficiency: 'EFFICIENZA FINALE',
        label_survived: 'SOPRAVVISSUTO PER',
        value_time: 'secondi'
      },
      loss_blackout: {
        title: 'BLACKOUT DELLA RETE METROPOLITANA',
        body: 'L\'Efficienza del Sistema è scesa allo 0% a causa di sabotaggi a catena, scioperi e carenze energetiche. I server si sono raffreddati, i generatori di emergenza si sono bloccati e l\'AI di Aegis si è spenta. Il regime di controllo è cieco. La città rimane buia, silenziosa e ingovernabile. Sei stato sollevato dall\'incarico dal Ministero della Sicurezza.',
        label_compliance: 'CONFORMITÀ FINALE',
        label_trust: 'FIDUCIA FINALE',
        label_efficiency: 'EFFICIENZA FINALE',
        value_efficiency: 'COLLASSO RETE',
        label_survived: 'SOPRAVVISSUTO PER',
        value_time: 'secondi'
      },
      loss_purged: {
        title: 'EPURAZIONE AMMINISTRATIVA',
        body: 'Hai permesso alla Conformità Civica di rimanere sotto il 15% troppo a lungo. Il Ministero della Sicurezza ha stabilito che la tua metodologia di governo manca della "spina dorsale algoritmica" necessaria per sostenere il progetto Aegis. I tuoi token di accesso sono stati revocati. È stato assegnato un direttore sostitutivo automatizzato. Sei destinato alla riclassificazione biometrica immediata.',
        label_compliance: 'CONFORMITÀ FINALE',
        value_compliance: 'INSUFFICIENTE',
        label_trust: 'FIDUCIA FINALE',
        label_efficiency: 'EFFICIENZA FINALE',
        label_survived: 'SOPRAVVISSUTO PER',
        value_time: 'secondi'
      },
      restart: 'RICARICA SISTEMA DI CLASSIFICAZIONE'
    }
  }
};

export function getActiveLanguage() {
  return currentLanguage;
}

export function t(key) {
  const keys = key.split('.');
  let obj = translations[currentLanguage];
  
  for (const k of keys) {
    if (obj && obj[k] !== undefined) {
      obj = obj[k];
    } else {
      let fallbackObj = translations[LANGUAGES.EN];
      for (const fk of keys) {
        if (fallbackObj && fallbackObj[fk] !== undefined) {
          fallbackObj = fallbackObj[fk];
        } else {
          return key;
        }
      }
      return fallbackObj;
    }
  }
  return obj;
}

export function setLanguage(lang) {
  if (lang !== LANGUAGES.EN && lang !== LANGUAGES.IT) return;
  currentLanguage = lang;
  localStorage.setItem('aegis_lang', lang);
  
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  const titles = document.querySelectorAll('[data-i18n-title]');
  titles.forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.setAttribute('title', t(key));
  });

  // Sync language buttons
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const event = new CustomEvent('languagechanged', { detail: { language: lang } });
  window.dispatchEvent(event);
}
