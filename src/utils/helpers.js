export function getTypeIcon(type) {
  const icons = {
    'Medical Emergency': '🚑',
    'Fire/Smoke': '🔥',
    'Electrical Hazard': '⚡',
    'Security Alert': '🔒',
    'Violence/Fight': '⚔️',
    'Water Leakage': '💧',
    'Theft/Robbery': '🔍',
    'Infrastructure Issue': '🏗️',
    'Natural Disaster': '🌪️',
    'Other': '⚠️',
  };
  return icons[type] || '⚠️';
}

export function getTypeBg(type) {
  const bgs = {
    'Medical Emergency': 'rgba(239,68,68,0.15)',
    'Fire/Smoke': 'rgba(249,115,22,0.15)',
    'Electrical Hazard': 'rgba(234,179,8,0.15)',
    'Security Alert': 'rgba(139,92,246,0.15)',
    'Violence/Fight': 'rgba(220,38,38,0.15)',
    'Water Leakage': 'rgba(6,182,212,0.15)',
    'Theft/Robbery': 'rgba(99,102,241,0.15)',
    'Infrastructure Issue': 'rgba(20,184,166,0.15)',
    'Natural Disaster': 'rgba(107,114,128,0.15)',
    'Other': 'rgba(107,114,128,0.15)',
  };
  return bgs[type] || 'rgba(107,114,128,0.15)';
}

export function timeAgo(isoString) {
  const diff = Math.round((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
