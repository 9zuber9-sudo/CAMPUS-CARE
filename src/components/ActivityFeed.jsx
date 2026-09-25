import { useApp } from '../context/AppContext';
import { timeAgo } from '../utils/helpers';

const TYPE_COLORS = {
  incident: 'var(--accent)',
  assignment: 'var(--low)',
  resolution: 'var(--low)',
  status: 'var(--high)',
};

const PRIORITY_DOTS = {
  Critical: 'var(--critical)',
  High: 'var(--high)',
  Medium: 'var(--medium)',
  Low: 'var(--low)',
};

export default function ActivityFeed({ limit = 8 }) {
  const { activityLog } = useApp();
  const items = activityLog.slice(0, limit);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon" style={{ background: 'rgba(0,180,255,0.12)' }}>📡</div>
          Recent Activity
        </div>
        <span className="card-action">View All →</span>
      </div>
      <div className="card-body p-0" style={{ padding: '8px 16px 12px' }}>
        <div className="activity-list">
          {items.map((item, i) => (
            <div key={item.id} className="activity-item">
              <div className="activity-dot-col">
                <div
                  className="activity-dot"
                  style={{
                    background: item.priority
                      ? PRIORITY_DOTS[item.priority]
                      : TYPE_COLORS[item.type] || 'var(--text-muted)',
                  }}
                />
                {i < items.length - 1 && <div className="activity-line" />}
              </div>
              <div className="activity-body">
                <div className="activity-text">{item.text}</div>
                <div className="activity-time">{timeAgo(item.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
