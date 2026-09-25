import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { getTypeIcon, getTypeBg, timeAgo } from '../utils/helpers';

export default function IncidentCard({ incident, onClick }) {
  const { type, location, priority, status, timestamp, assignedResponderId, id } = incident;
  const icon = getTypeIcon(type);
  const bg = getTypeBg(type);

  return (
    <div
      className={`incident-item ${priority?.toLowerCase()}`}
      onClick={() => onClick && onClick(incident)}
      role="button"
      tabIndex={0}
      id={`incident-card-${id}`}
    >
      <div className="incident-item-icon" style={{ background: bg }}>
        {icon}
      </div>
      <div className="incident-item-body">
        <div className="incident-item-title">
          {type}
          <PriorityBadge priority={priority} />
        </div>
        <div className="incident-item-meta">
          <span>📍 {location}</span>
          <span>🕐 {timeAgo(timestamp)}</span>
          {assignedResponderId
            ? <span style={{ color: 'var(--accent)' }}>✓ Assigned</span>
            : <span style={{ color: 'var(--text-muted)' }}>⏳ Unassigned</span>
          }
        </div>
        <div className="incident-item-id">{id}</div>
      </div>
      <div className="incident-item-actions">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
