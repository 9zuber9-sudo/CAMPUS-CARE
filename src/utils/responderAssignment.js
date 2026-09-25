// ──────────────────────────────────────────────
// RESPONDER ASSIGNMENT ENGINE — CampusCare
// Matches incidents to responders by specialty and priority
// ──────────────────────────────────────────────
import { getPriorityScore, getResponderSpecialty } from './priorityEngine';

/**
 * Finds the best available responder for an incident.
 * Strategy: specialty match → general → any available
 */
export function findBestResponder(incident, availableResponders) {
  if (!availableResponders || availableResponders.length === 0) return null;

  const neededSpecialty = getResponderSpecialty(incident.type);

  // 1. Exact specialty match
  const specialtyMatch = availableResponders.find(
    (r) => r.specialty === neededSpecialty && r.status === 'available'
  );
  if (specialtyMatch) return specialtyMatch;

  // 2. General responder
  const generalMatch = availableResponders.find(
    (r) => r.specialty === 'General' && r.status === 'available'
  );
  if (generalMatch) return generalMatch;

  // 3. Any available (cross-deployment)
  return availableResponders.find((r) => r.status === 'available') || null;
}

/**
 * Auto-assigns all unassigned incidents sorted by priority.
 * Higher-priority incidents get first pick of responders.
 * Returns array of { incidentId, responderId } pairs.
 */
export function autoAssignAll(incidents, responders) {
  // Sort unassigned incidents by priority (Critical first)
  const unassigned = [...incidents]
    .filter((i) => i.status === 'reported')
    .sort((a, b) => getPriorityScore(b.priority) - getPriorityScore(a.priority));

  const available = responders.filter((r) => r.status === 'available');
  const assignments = [];

  for (const incident of unassigned) {
    if (available.length === 0) break;

    const neededSpecialty = getResponderSpecialty(incident.type);
    let chosen = available.find((r) => r.specialty === neededSpecialty);
    if (!chosen) chosen = available.find((r) => r.specialty === 'General');
    if (!chosen) chosen = available[0];

    if (chosen) {
      assignments.push({
        incidentId: incident.id,
        responderId: chosen.id,
        responderName: chosen.name,
        specialtyMatch: chosen.specialty === neededSpecialty,
      });
      // Remove from available pool for next iteration
      const idx = available.indexOf(chosen);
      available.splice(idx, 1);
    }
  }

  return assignments;
}

/**
 * Returns incidents sorted by priority for the response queue.
 * Unresolved incidents only, Critical first, then by age (oldest first).
 */
export function getResponseQueue(incidents) {
  return [...incidents]
    .filter((i) => i.status !== 'resolved')
    .sort((a, b) => {
      const pd = getPriorityScore(b.priority) - getPriorityScore(a.priority);
      if (pd !== 0) return pd;
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
}

/**
 * Checks if any available responders match the incident specialty.
 */
export function hasSpecialtyAvailable(incident, responders) {
  const specialty = getResponderSpecialty(incident.type);
  return responders.some(
    (r) => r.specialty === specialty && r.status === 'available'
  );
}
