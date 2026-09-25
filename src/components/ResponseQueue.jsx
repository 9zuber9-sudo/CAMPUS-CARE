import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getResponseQueue } from '../utils/responderAssignment';
import PriorityBadge from './PriorityBadge';
import IncidentDetailModal from './IncidentDetailModal';
import { getTypeIcon, timeAgo } from '../utils/helpers';

export default function ResponseQueue() {
  const { incidents, responders, autoAssignAllIncidents, stats } = useApp();
  const queue = getResponseQueue(incidents).slice(0, 5);
  const [selected, setSelected] = useState(null);
  const waiting = incidents.filter((i) => i.status === 'reported').length;
  const available = stats.availableResponders;

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon" style={{ background: 'rgba(255,140,0,0.15)' }}>📋</div>
            Response Queue
          </div>
          <span className="card-action" onClick={autoAssignAllIncidents} id="auto-assign-btn">
            ⚡ Auto-Assign
          </span>
        </div>
        <div className="card-body" style={{ flex: 1, overflow: 'auto' }}>
          {queue.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-text">All clear!</div>
              <div className="empty-state-sub">No active incidents in queue</div>
            </div>
          ) : (
            <div className="response-queue-list">
              {queue.map((inc, idx) => (
                <div
                  key={inc.id}
                  className="queue-item"
                  onClick={() => setSelected(inc)}
                  id={`queue-item-${inc.id}`}
                >
                  <div className={`queue-rank ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : ''}`}>
                    {idx + 1}
                  </div>
                  <div className="queue-item-body">
                    <div className="queue-item-title">{inc.type}</div>
                    <div className="queue-item-sub">
                      📍 {inc.location.split(' - ')[0]}
                      {' · '}
                      🕐 {timeAgo(inc.timestamp)}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <PriorityBadge priority={inc.priority} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                    {inc.status === 'reported' ? (
                      <span className="queue-action-hint">⏳ Awaiting</span>
                    ) : inc.status === 'assigned' ? (
                      <span className="queue-action-hint" style={{ color: 'var(--accent)' }}>👤 Assigned</span>
                    ) : (
                      <span className="queue-action-hint" style={{ color: 'var(--high)' }}>🚨 On Scene</span>
                    )}
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{inc.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary bar */}
          <div className="queue-summary" style={{ marginTop: 10 }}>
            <span>{available} Responders Available</span>
            <span>{waiting > 0 ? <><span>{waiting}</span> Waiting</> : 'None waiting'}</span>
          </div>
        </div>
      </div>

      {selected && (
        <IncidentDetailModal incident={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
