import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  initialIncidents,
  initialResponders,
  initialActivityLog,
  initialHistory,
} from '../data/initialData';
import {
  calculatePriority,
  getRecommendedActions,
} from '../utils/priorityEngine';
import {
  autoAssignAll,
  findBestResponder,
} from '../utils/responderAssignment';

// ── Context ───────────────────────────────────
const AppContext = createContext(null);

// ── Helpers ───────────────────────────────────
let incidentCounter = 2046;
let activityCounter = 10;

function makeId() {
  return `INC-${incidentCounter++}`;
}
function makeActId() {
  return `ACT-${activityCounter++}`;
}
function ts() {
  return new Date().toISOString();
}

// ── Reducer ───────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    // ── REPORT ───────────────────────────────
    case 'REPORT_INCIDENT': {
      const { formData } = action;
      const now = ts();
      const priority = calculatePriority(
        formData.type,
        formData.location,
        formData.description,
        now
      );
      const id = makeId();
      const newIncident = {
        id,
        type: formData.type,
        location: formData.location,
        description: formData.description,
        timestamp: now,
        priority,
        status: 'reported',
        assignedResponderId: null,
        reportedBy: formData.reportedBy || 'Anonymous',
        recommendedActions: getRecommendedActions(formData.type),
        history: [
          { action: 'Incident reported', timestamp: now, by: formData.reportedBy || 'Anonymous' },
          { action: `Auto-priority: ${priority}`, timestamp: now, by: 'System' },
        ],
        resolvedAt: null,
        resolutionNotes: null,
      };

      const logEntry = {
        id: makeActId(),
        text: `Incident ${id} reported: ${formData.type} at ${formData.location}`,
        timestamp: now,
        type: 'incident',
        priority,
      };

      // Attempt auto-assign
      const available = state.responders.filter((r) => r.status === 'available');
      const bestResponder = findBestResponder(newIncident, available);

      if (bestResponder) {
        const assignEntry = {
          id: makeActId(),
          text: `${bestResponder.name} auto-assigned to ${id} (${bestResponder.specialty} match)`,
          timestamp: now,
          type: 'assignment',
          priority,
        };

        return {
          ...state,
          incidents: [
            {
              ...newIncident,
              status: 'assigned',
              assignedResponderId: bestResponder.id,
              history: [
                ...newIncident.history,
                {
                  action: `${bestResponder.name} assigned (auto)`,
                  timestamp: now,
                  by: 'System (Auto-Assign)',
                },
              ],
            },
            ...state.incidents,
          ],
          responders: state.responders.map((r) =>
            r.id === bestResponder.id
              ? { ...r, status: 'busy', currentIncidentId: id }
              : r
          ),
          activityLog: [assignEntry, logEntry, ...state.activityLog],
        };
      }

      return {
        ...state,
        incidents: [newIncident, ...state.incidents],
        activityLog: [logEntry, ...state.activityLog],
      };
    }

    // ── ASSIGN RESPONDER (manual) ─────────────
    case 'ASSIGN_RESPONDER': {
      const { incidentId, responderId } = action;
      const now = ts();
      const responder = state.responders.find((r) => r.id === responderId);
      if (!responder) return state;

      const logEntry = {
        id: makeActId(),
        text: `${responder.name} manually assigned to ${incidentId}`,
        timestamp: now,
        type: 'assignment',
        priority: state.incidents.find((i) => i.id === incidentId)?.priority,
      };

      const incident = state.incidents.find((i) => i.id === incidentId);
      let updatedResponders = state.responders.map((r) => {
        if (r.id === responderId) return { ...r, status: 'busy', currentIncidentId: incidentId };
        if (incident?.assignedResponderId === r.id) return { ...r, status: 'available', currentIncidentId: null };
        return r;
      });

      return {
        ...state,
        incidents: state.incidents.map((i) =>
          i.id === incidentId
            ? {
                ...i,
                assignedResponderId: responderId,
                status: 'assigned',
                history: [
                  ...i.history,
                  { action: `${responder.name} assigned`, timestamp: now, by: 'Admin' },
                ],
              }
            : i
        ),
        responders: updatedResponders,
        activityLog: [logEntry, ...state.activityLog],
      };
    }

    // ── AUTO ASSIGN ALL ───────────────────────
    case 'AUTO_ASSIGN_ALL': {
      const now = ts();
      const assignments = autoAssignAll(state.incidents, state.responders);

      if (assignments.length === 0) return state;

      const assignmentMap = {};
      assignments.forEach((a) => {
        assignmentMap[a.incidentId] = a;
      });

      const logEntry = {
        id: makeActId(),
        text: `Auto-assign completed: ${assignments.length} incident(s) assigned to responders`,
        timestamp: now,
        type: 'assignment',
        priority: null,
      };

      return {
        ...state,
        incidents: state.incidents.map((i) => {
          const a = assignmentMap[i.id];
          if (!a) return i;
          return {
            ...i,
            assignedResponderId: a.responderId,
            status: 'assigned',
            history: [
              ...i.history,
              {
                action: `${a.responderName} assigned (auto — ${a.specialtyMatch ? 'specialty match' : 'cross-deployed'})`,
                timestamp: now,
                by: 'System (Auto-Assign)',
              },
            ],
          };
        }),
        responders: state.responders.map((r) => {
          const a = assignments.find((x) => x.responderId === r.id);
          if (!a) return r;
          return { ...r, status: 'busy', currentIncidentId: a.incidentId };
        }),
        activityLog: [logEntry, ...state.activityLog],
      };
    }

    // ── UPDATE STATUS ─────────────────────────
    case 'UPDATE_STATUS': {
      const { incidentId, status } = action;
      const now = ts();
      const labelMap = {
        assigned: 'Responder assigned',
        responding: 'Responder on scene — actively responding',
        resolved: 'Incident resolved',
      };

      return {
        ...state,
        incidents: state.incidents.map((i) =>
          i.id === incidentId
            ? {
                ...i,
                status,
                history: [
                  ...i.history,
                  { action: labelMap[status] || `Status: ${status}`, timestamp: now, by: 'Admin' },
                ],
              }
            : i
        ),
        activityLog: [
          {
            id: makeActId(),
            text: `${incidentId} status updated to: ${status}`,
            timestamp: now,
            type: 'status',
            priority: state.incidents.find((i) => i.id === incidentId)?.priority,
          },
          ...state.activityLog,
        ],
      };
    }

    // ── RESOLVE INCIDENT ─────────────────────
    case 'RESOLVE_INCIDENT': {
      const { incidentId, notes } = action;
      const now = ts();
      const incident = state.incidents.find((i) => i.id === incidentId);
      if (!incident) return state;

      const resolved = {
        ...incident,
        status: 'resolved',
        resolvedAt: now,
        resolutionNotes: notes || 'Incident resolved.',
        responseTime: Math.round(
          (new Date(now) - new Date(incident.timestamp)) / 60000
        ),
        history: [
          ...incident.history,
          { action: `Resolved: ${notes || 'Incident resolved.'}`, timestamp: now, by: 'Admin' },
        ],
      };

      return {
        ...state,
        incidents: state.incidents.filter((i) => i.id !== incidentId),
        responders: state.responders.map((r) =>
          r.currentIncidentId === incidentId
            ? { ...r, status: 'available', currentIncidentId: null, responseCount: r.responseCount + 1 }
            : r
        ),
        history: [resolved, ...state.history],
        activityLog: [
          {
            id: makeActId(),
            text: `Incident ${incidentId} resolved — ${incident.type} at ${incident.location}`,
            timestamp: now,
            type: 'resolution',
            priority: incident.priority,
          },
          ...state.activityLog,
        ],
      };
    }

    // ── TOGGLE RESPONDER STATUS ──────────────
    case 'TOGGLE_RESPONDER_DUTY': {
      const { responderId } = action;
      return {
        ...state,
        responders: state.responders.map((r) =>
          r.id === responderId
            ? {
                ...r,
                status:
                  r.status === 'off-duty'
                    ? 'available'
                    : r.status === 'available'
                    ? 'off-duty'
                    : r.status,
              }
            : r
        ),
      };
    }

    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    incidents: initialIncidents,
    responders: initialResponders,
    activityLog: initialActivityLog,
    history: initialHistory,
  });

  const reportIncident = useCallback(
    (formData) => dispatch({ type: 'REPORT_INCIDENT', formData }),
    []
  );
  const assignResponder = useCallback(
    (incidentId, responderId) =>
      dispatch({ type: 'ASSIGN_RESPONDER', incidentId, responderId }),
    []
  );
  const autoAssignAllIncidents = useCallback(
    () => dispatch({ type: 'AUTO_ASSIGN_ALL' }),
    []
  );
  const updateStatus = useCallback(
    (incidentId, status) =>
      dispatch({ type: 'UPDATE_STATUS', incidentId, status }),
    []
  );
  const resolveIncident = useCallback(
    (incidentId, notes) =>
      dispatch({ type: 'RESOLVE_INCIDENT', incidentId, notes }),
    []
  );
  const toggleResponderDuty = useCallback(
    (responderId) => dispatch({ type: 'TOGGLE_RESPONDER_DUTY', responderId }),
    []
  );

  // Computed stats
  const stats = {
    activeIncidents: state.incidents.length,
    criticalIncidents: state.incidents.filter((i) => i.priority === 'Critical').length,
    availableResponders: state.responders.filter((r) => r.status === 'available').length,
    resolvedToday: state.history.filter(
      (h) => h.resolvedAt && new Date(h.resolvedAt).toDateString() === new Date().toDateString()
    ).length,
    unassigned: state.incidents.filter((i) => i.status === 'reported').length,
    responding: state.incidents.filter((i) => i.status === 'responding').length,
  };

  return (
    <AppContext.Provider
      value={{
        incidents: state.incidents,
        responders: state.responders,
        activityLog: state.activityLog,
        history: state.history,
        stats,
        reportIncident,
        assignResponder,
        autoAssignAllIncidents,
        updateStatus,
        resolveIncident,
        toggleResponderDuty,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
