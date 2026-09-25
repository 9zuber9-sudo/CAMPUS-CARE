import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  calculatePriority,
  getRecommendedActions,
  getPriorityFactors,
  PRIORITY_COLORS,
  PRIORITY_BG,
} from '../utils/priorityEngine';
import { CAMPUS_LOCATIONS, INCIDENT_TYPES } from '../data/initialData';

const EMPTY = { type: '', location: '', description: '', reportedBy: '' };

export default function ReportIncidentModal({ onClose }) {
  const { reportIncident } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const priority =
    form.type && form.location
      ? calculatePriority(form.type, form.location, form.description, new Date().toISOString())
      : null;

  const factors = priority
    ? getPriorityFactors(form.type, form.location, form.description, new Date().toISOString())
    : [];

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.type || !form.location || !form.description) return;
    setSubmitting(true);
    setTimeout(() => {
      reportIncident(form);
      setSubmitting(false);
      setDone(true);
      setTimeout(onClose, 1400);
    }, 600);
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Report Incident">
        <div className="modal-header">
          <div className="modal-title">⚠️ Report New Incident</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {done ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40px 22px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-white)', marginBottom: 6 }}>
              Incident Reported!
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              {priority === 'Critical' || priority === 'High'
                ? 'Priority is HIGH — auto-assignment in progress…'
                : 'Added to response queue.'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="inc-type">Incident Type *</label>
                  <select
                    id="inc-type"
                    className="form-select"
                    value={form.type}
                    onChange={(e) => set('type', e.target.value)}
                    required
                  >
                    <option value="">Select type…</option>
                    {INCIDENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="inc-location">Location *</label>
                  <select
                    id="inc-location"
                    className="form-select"
                    value={form.location}
                    onChange={(e) => set('location', e.target.value)}
                    required
                  >
                    <option value="">Select location…</option>
                    {CAMPUS_LOCATIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                    <option value="Other">Other (specify in description)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inc-desc">Description *</label>
                <textarea
                  id="inc-desc"
                  className="form-textarea"
                  placeholder="Describe what happened, number of people affected, any injuries…"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inc-reporter">Reported By</label>
                <input
                  id="inc-reporter"
                  type="text"
                  className="form-input"
                  placeholder="Your name or role (optional)"
                  value={form.reportedBy}
                  onChange={(e) => set('reportedBy', e.target.value)}
                />
              </div>

              {/* Priority Preview */}
              {priority && (
                <div
                  className="priority-preview"
                  style={{
                    background: PRIORITY_BG[priority],
                    border: `1px solid ${PRIORITY_COLORS[priority]}44`,
                  }}
                >
                  <div className="priority-preview-icon">
                    {priority === 'Critical' ? '🔴' : priority === 'High' ? '🟠' : priority === 'Medium' ? '🟡' : '🟢'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="priority-preview-label">Auto-calculated Priority</div>
                    <div
                      className="priority-preview-value"
                      style={{ color: PRIORITY_COLORS[priority] }}
                    >
                      {priority}
                    </div>
                    <div className="priority-factors">
                      {factors.map((f, i) => (
                        <div key={i} className="priority-factor">
                          <span>{f.icon}</span>
                          <span>{f.label}</span>
                          <span style={{ marginLeft: 'auto', color: PRIORITY_COLORS[priority], fontWeight: 600 }}>
                            +{f.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommended Actions preview */}
              {form.type && priority && (
                <div className="form-group mt-2">
                  <label className="form-label">Recommended Actions</label>
                  <div className="actions-list">
                    {getRecommendedActions(form.type).slice(0, 3).map((a, i) => (
                      <div key={i} className="action-item">{a}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button
                id="submit-incident-btn"
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !form.type || !form.location || !form.description}
              >
                {submitting ? '⏳ Submitting…' : '🚨 Submit Incident'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
