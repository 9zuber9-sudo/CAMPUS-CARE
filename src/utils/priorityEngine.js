// ──────────────────────────────────────────────
// PRIORITY ENGINE — CampusCare
// Calculates incident priority from type, location, description, time
// ──────────────────────────────────────────────

const TYPE_BASE_SCORES = {
  'Medical Emergency': 85,
  'Fire/Smoke': 82,
  'Violence/Fight': 78,
  'Electrical Hazard': 70,
  'Security Alert': 58,
  'Theft/Robbery': 52,
  'Water Leakage': 38,
  'Infrastructure Issue': 32,
  'Natural Disaster': 92,
  'Other': 22,
};

const CRITICAL_KEYWORDS = [
  'unconscious', 'not breathing', 'cardiac', 'heart attack',
  'bleeding heavily', 'explosion', 'bomb', 'trapped', 'collapsed',
  'attack', 'weapon', 'gun', 'knife', 'dead', 'overdose', 'poisoning',
  'severe', 'critical', 'life-threatening', 'arson',
];

const HIGH_KEYWORDS = [
  'injured', 'hurt', 'pain', 'smoke', 'gas leak', 'electric shock',
  'fight', 'threatening', 'breaking', 'flood', 'fell', 'fracture',
  'faint', 'assault', 'burn', 'bleed', 'emergency', 'urgent',
];

const MEDIUM_KEYWORDS = [
  'damage', 'broken', 'flooding', 'missing', 'suspicious',
  'argument', 'discomfort', 'nausea', 'lost', 'stuck', 'leak',
];

const HIGH_RISK_LOCATIONS = [
  'lybrary', 'hospital', 'eb block', 'eb', 'lab', 'hostel',
  'administrative block', 'law block', 'commerce block', 'main gate', 'royal cafe',
];

const MEDIUM_RISK_LOCATIONS = [
  'old law block', '1st floor', '2nd floor', 'ground floor',
];

const RECOMMENDED_ACTIONS = {
  'Medical Emergency': [
    '🚑 Dispatch medical team immediately',
    '📞 Call campus emergency: 112',
    '🔒 Clear area around victim — do not move them',
    '💊 Prepare first aid kit and AED if available',
    '🏥 Alert nearest hospital if critical',
    '📋 Document vital signs and symptoms',
  ],
  'Fire/Smoke': [
    '🔔 Activate fire alarm system',
    '🚪 Evacuate affected building immediately',
    '🚒 Call fire department: 101',
    '🧯 Dispatch fire safety team with extinguishers',
    '👥 Account for all personnel via roll call',
    '⚡ Shut off electricity in affected zone',
  ],
  'Electrical Hazard': [
    '⚡ Isolate electrical supply in affected area',
    '🚫 Keep everyone 10m away from hazard zone',
    '🔧 Dispatch qualified electrician immediately',
    '📞 Contact campus electrical department',
    '🏥 Check for electric shock victims',
    '📋 Document the nature of the electrical fault',
  ],
  'Security Alert': [
    '🔒 Lockdown affected area if necessary',
    '👮 Dispatch security personnel immediately',
    '📞 Notify campus security control room',
    '📹 Review CCTV footage for the area',
    '📢 Issue campus-wide alert if threat is high',
    '🚔 Contact police if situation escalates: 100',
  ],
  'Violence/Fight': [
    '👮 Dispatch security team immediately',
    '🚔 Contact police: 100 if weapons involved',
    '🏥 Prepare medical team for potential injuries',
    '📹 Preserve CCTV evidence',
    '🔒 Isolate combatants and witnesses',
    '📋 Take statements from all witnesses',
  ],
  'Water Leakage': [
    '🔧 Dispatch maintenance team immediately',
    '💧 Shut off water supply valve in zone',
    '⚡ Protect electrical equipment from water',
    '🚫 Post wet floor signs to prevent slipping',
    '📋 Assess extent of water damage',
    '🔌 Relocate affected equipment and items',
  ],
  'Theft/Robbery': [
    '👮 Dispatch security to scene immediately',
    '📹 Secure and review CCTV footage',
    '🚔 File police report: 100',
    '🔒 Lockdown exit points if suspect still on campus',
    '📋 Take inventory of stolen items',
    '👥 Interview all witnesses',
  ],
  'Infrastructure Issue': [
    '🔧 Dispatch maintenance team',
    '🚫 Cordon off the unsafe area',
    '⚠️ Post visible warning signs immediately',
    '📋 Assess structural damage and document',
    '📞 Contact facilities management department',
    '🏗️ Arrange temporary alternative if area is needed',
  ],
  'Natural Disaster': [
    '🚨 Issue campus-wide emergency alert',
    '🏃 Initiate evacuation to designated safe zones',
    '📞 Contact local disaster management: 1078',
    '🏥 Set up first aid stations at assembly points',
    '📻 Monitor official weather and disaster updates',
    '🔒 Secure all buildings, labs and facilities',
  ],
  'Other': [
    '🔍 Assess the situation on ground immediately',
    '📞 Contact relevant department head',
    '👮 Dispatch security team for safety assessment',
    '📋 Document all incident details thoroughly',
    '📢 Communicate updates to affected parties',
  ],
};

const TYPE_TO_SPECIALTY = {
  'Medical Emergency': 'Medical',
  'Fire/Smoke': 'Fire Safety',
  'Violence/Fight': 'Security',
  'Security Alert': 'Security',
  'Theft/Robbery': 'Security',
  'Electrical Hazard': 'Maintenance',
  'Water Leakage': 'Maintenance',
  'Infrastructure Issue': 'Maintenance',
  'Natural Disaster': 'General',
  'Other': 'General',
};

export function calculatePriority(type, location, description, timestamp) {
  let score = TYPE_BASE_SCORES[type] || 22;

  const desc = (description || '').toLowerCase();
  const loc = (location || '').toLowerCase();

  // Keyword analysis
  if (CRITICAL_KEYWORDS.some((kw) => desc.includes(kw))) {
    score += 20;
  } else if (HIGH_KEYWORDS.some((kw) => desc.includes(kw))) {
    score += 10;
  } else if (MEDIUM_KEYWORDS.some((kw) => desc.includes(kw))) {
    score += 5;
  }

  // Location risk
  if (HIGH_RISK_LOCATIONS.some((l) => loc.includes(l))) {
    score += 10;
  } else if (MEDIUM_RISK_LOCATIONS.some((l) => loc.includes(l))) {
    score += 5;
  }

  // Time-of-day risk
  const hour = new Date(timestamp || Date.now()).getHours();
  if (hour >= 22 || hour < 5) score += 15; // late night / early morning
  else if (hour >= 20 || hour < 7) score += 8; // evening / early morning

  if (score >= 90) return 'Critical';
  if (score >= 65) return 'High';
  if (score >= 42) return 'Medium';
  return 'Low';
}

export function getPriorityFactors(type, location, description, timestamp) {
  const factors = [];
  const desc = (description || '').toLowerCase();
  const loc = (location || '').toLowerCase();
  const hour = new Date(timestamp || Date.now()).getHours();

  const baseScore = TYPE_BASE_SCORES[type] || 22;
  factors.push({ label: `Incident type: ${type}`, score: baseScore, icon: '📊' });

  if (CRITICAL_KEYWORDS.some((kw) => desc.includes(kw))) {
    factors.push({ label: 'Critical keywords detected in description', score: 20, icon: '🔴' });
  } else if (HIGH_KEYWORDS.some((kw) => desc.includes(kw))) {
    factors.push({ label: 'High-risk keywords in description', score: 10, icon: '🟠' });
  } else if (MEDIUM_KEYWORDS.some((kw) => desc.includes(kw))) {
    factors.push({ label: 'Moderate keywords in description', score: 5, icon: '🟡' });
  }

  if (HIGH_RISK_LOCATIONS.some((l) => loc.includes(l))) {
    factors.push({ label: 'High-density location (more people at risk)', score: 10, icon: '📍' });
  }

  if (hour >= 22 || hour < 5) {
    factors.push({ label: 'Late night hours (reduced visibility, fewer staff)', score: 15, icon: '🌙' });
  } else if (hour >= 20 || hour < 7) {
    factors.push({ label: 'Evening/early morning hours', score: 8, icon: '🌆' });
  }

  return factors;
}

export function getRecommendedActions(type) {
  return RECOMMENDED_ACTIONS[type] || RECOMMENDED_ACTIONS['Other'];
}

export function getPriorityScore(priority) {
  const scores = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  return scores[priority] || 0;
}

export function getResponderSpecialty(type) {
  return TYPE_TO_SPECIALTY[type] || 'General';
}

export const PRIORITY_COLORS = {
  Critical: '#ff3b30',
  High: '#ff8c00',
  Medium: '#ffd60a',
  Low: '#30d158',
};

export const PRIORITY_BG = {
  Critical: 'rgba(255,59,48,0.15)',
  High: 'rgba(255,140,0,0.15)',
  Medium: 'rgba(255,214,10,0.15)',
  Low: 'rgba(48,209,88,0.15)',
};
