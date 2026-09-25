import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { getTypeIcon, getTypeBg, timeAgo } from '../utils/helpers';
import { getResponderSpecialty } from '../utils/priorityEngine';

const PIPELINE = ['reported', 'assigned', 'responding', 'resolved'];
const PIPELINE_LABELS = { reported: 'Reported', assigned: 'Assigned', responding: 'On Scene', resolved: 'Resolved' };

export default function IncidentDetailModal({ incident, onClose }) {
  const { responders, assignResponder, updateStatus, resolveIncident, autoAssignAllIncidents } = useApp();
  const [tab, setTab] = useState('overview');
  const [resolveNotes, setResolveNotes] = useState('');
  const [selectedResponder, setSelectedResponder] = useState('');
  const [showResolveForm, setShowResolveForm] = useState(false);

  const neededSpecialty = getResponderSpecialty(incident.type);
  const assignedResponder = responders.find((r) => r.id === incident.assignedResponderId);
  const availableResponders = responders.filter((r) => r.status === 'available');
  const currentStep = PIPELINE.indexOf(incident.status);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleAssign() {
    if (selectedResponder) {
      assignResponder(incident.id, selectedResponder);
      setSelectedResponder('');
    }
  }

  function handleResolve() {
    resolveIncident(incident.id, resolveNotes || 'Incident resolved.');
    onClose();
  }

  function handleNextStatus() {
    const next = PIPELINE[currentStep + 1];
    if (next && next !== 'resolved') updateStatus(incident.id, next);
    else if (next === 'resolved') setShowResolveForm(true);
  }

  const canAdvance = currentStep < PIPELINE.length - 1;
  const nextLabel = PIPELINE[currentStep + 1]
    ? `→ Mark as ${PIPELINE_LABELS[PIPELINE[currentStep + 1]]}`
    : null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-title">
            <span style={{ fontSize: 22 }}>{getTypeIcon(incident.type)}</span>
            {incident.type}
            <PriorityBadge priority={incident.priority} />
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Pipeline */}
        <div style={{ padding: '14px 22px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="status-pipeline">
            {PIPELINE.map((step, idx) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div className={`pipeline-step ${idx <= currentStep ? 'done' : ''} ${idx === currentStep ? 'active' : ''}`}
                     style={{ flex: 0 }}>
                  <div className="pipeline-step-circle">
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                  <div className="pipeline-step-label">{PIPELINE_LABELS[step]}</div>
                </div>
                {idx < PIPELINE.length - 1 && (
                  <div className={`pipeline-connector ${idx < currentStep ? 'done' : ''}`} style={{ flex: 1 }} />
                )}
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 0, marginTop: 10 }}>
            {['overview', 'actions', 'assign', 'history'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                  color: tab === t ? 'var(--accent)' : 'var(--text-dim)',
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'var(--t)',
                }}
              >
                {t === 'overview' ? '📋 Overview' : t === 'actions' ? '✅ Actions' : t === 'assign' ? '👮 Assign' : '🕐 History'}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-body">
          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (
            <>
              <div className="detail-section">
                <div className="detail-section-title">Incident Details</div>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <div className="detail-info-label">ID</div>
                    <div className="detail-info-value" style={{ fontFamily: 'monospace', color: 'var(--text-dim)' }}>{incident.id}</div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Status</div>
                    <div className="detail-info-value"><StatusBadge status={incident.status} /></div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Location</div>
                    <div className="detail-info-value">📍 {incident.location}</div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Reported</div>
                    <div className="detail-info-value">🕐 {timeAgo(incident.timestamp)}</div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Reported By</div>
                    <div className="detail-info-value">{incident.reportedBy}</div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Assigned To</div>
                    <div className="detail-info-value">
                      {assignedResponder ? `${assignedResponder.avatar} ${assignedResponder.name}` : '— Unassigned'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Description</div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: 8 }}>
                  {incident.description}
                </p>
              </div>
            </>
          )}

          {/* ── ACTIONS TAB ── */}
          {tab === 'actions' && (
            <div className="detail-section">
              <div className="detail-section-title">Recommended Response Actions</div>
              <div className="actions-list">
                {incident.recommendedActions.map((a, i) => (
                  <div key={i} className="action-item">
                    <span style={{ marginRight: 4, opacity: 0.5, fontSize: 11 }}>{i + 1}.</span> {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ASSIGN TAB ── */}
          {tab === 'assign' && (
            <div className="detail-section">
              <div className="detail-section-title">
                Assign Responder
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-dim)', marginLeft: 6 }}>
                  (Needed: {neededSpecialty})
                </span>
              </div>
              {availableResponders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">😔</div>
                  <div className="empty-state-text">No responders available</div>
                  <div className="empty-state-sub">All responders are currently busy or off-duty</div>
                </div>
              ) : (
                <>
                  {availableResponders.map((r) => (
                    <div
                      key={r.id}
                      className={`responder-option ${selectedResponder === r.id ? 'selected' : ''}`}
                      onClick={() => setSelectedResponder(r.id)}
                      id={`responder-opt-${r.id}`}
                    >
                      <span style={{ fontSize: 20 }}>{r.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>📞 {r.phone}</div>
                      </div>
                      <span className={`specialty-tag ${r.specialty === neededSpecialty ? 'match' : ''}`}>
                        {r.specialty === neededSpecialty ? '✓ ' : ''}{r.specialty}
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-primary"
                      disabled={!selectedResponder}
                      onClick={handleAssign}
                    >
                      Assign Selected
                    </button>
                    <button className="btn btn-ghost" onClick={() => { autoAssignAllIncidents(); onClose(); }}>
                      ⚡ Auto-Assign All
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {tab === 'history' && (
            <div className="detail-section">
              <div className="detail-section-title">Incident Timeline</div>
              <div className="history-timeline">
                {incident.history.map((h, i) => (
                  <div key={i} className="history-entry">
                    <div className="history-entry-dot" style={{
                      background: h.by === 'System' || h.by.includes('System') ? 'var(--accent)' : 'var(--low)'
                    }} />
                    <div className="history-entry-body">
                      <div className="history-entry-action">{h.action}</div>
                      <div className="history-entry-meta">{timeAgo(h.timestamp)} · {h.by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolve form */}
          {showResolveForm && (
            <div style={{ marginTop: 12, padding: 14, background: 'rgba(48,209,88,0.06)', border: '1px solid rgba(48,209,88,0.2)', borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--low)', marginBottom: 8 }}>
                ✅ Resolve Incident
              </div>
              <textarea
                className="form-textarea"
                placeholder="Resolution notes (what was done, outcome)…"
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                rows={2}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-success" onClick={handleResolve}>Confirm Resolution</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowResolveForm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {incident.status !== 'resolved' && (
            <>
              {canAdvance && !showResolveForm && (
                <button
                  className={`btn ${currentStep === PIPELINE.length - 2 ? 'btn-success' : 'btn-primary'}`}
                  onClick={handleNextStatus}
                  id="advance-status-btn"
                >
                  {nextLabel}
                </button>
              )}
            </>
          )}
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
