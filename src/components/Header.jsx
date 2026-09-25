import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ReportIncidentModal from './ReportIncidentModal';

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="header-time">
      <div className="header-time-clock">{timeStr}</div>
      <div className="header-time-date">{dateStr}</div>
    </div>
  );
}

export default function Header({ setActivePage }) {
  const { stats } = useApp();
  const [showReport, setShowReport] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <>
      <header className="header">
        {/* SRM Logo */}
        <div className="header-logo">
          <div style={{ fontSize: 28, lineHeight: 1 }}>🎓</div>
          <div className="header-logo-text">
            <div className="header-logo-name">CampusCare</div>
            <div className="header-logo-sub">Incident Control Network</div>
          </div>
        </div>

        <div className="header-divider" />

        {/* Search */}
        <div className="header-search">
          <span className="header-search-icon">🔍</span>
          <input
            id="header-search-input"
            type="text"
            placeholder="Search incidents, locations, responders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="header-search-kbd">⌘ K</span>
        </div>

        <div className="header-spacer" />

        {/* Actions */}
        <div className="header-actions">
          <Clock />

          <div className="icon-btn" title="Notifications" onClick={() => setActivePage('incidents')}>
            🔔
            {stats.criticalIncidents > 0 && <span className="notif-dot" />}
          </div>
          <div className="icon-btn" title="Settings" onClick={() => setActivePage('settings')}>⚙</div>

          {/* Report Incident CTA */}
          <button
            id="report-incident-btn"
            className="report-btn"
            onClick={() => setShowReport(true)}
            title="Report a new incident"
          >
            ＋ Report Incident
          </button>

          {/* User */}
          <div className="header-user">
            <div className="header-avatar">A</div>
            <div className="header-user-info">
              <div className="header-user-name">Admin</div>
              <div className="header-user-role">Administrator</div>
            </div>
          </div>
        </div>
      </header>

      {showReport && <ReportIncidentModal onClose={() => setShowReport(false)} />}
    </>
  );
}
