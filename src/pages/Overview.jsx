import { useState } from 'react';
import { useApp } from '../context/AppContext';
import IncidentCard from '../components/IncidentCard';
import ResponseQueue from '../components/ResponseQueue';
import ActivityFeed from '../components/ActivityFeed';
import IncidentDetailModal from '../components/IncidentDetailModal';
import ReportIncidentModal from '../components/ReportIncidentModal';

function StatCard({ label, value, icon, variant, delta, deltaDir }) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-card-header">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-icon" style={{
          background: variant === 'critical' ? 'rgba(255,59,48,0.15)'
            : variant === 'high' ? 'rgba(255,140,0,0.15)'
            : variant === 'success' ? 'rgba(48,209,88,0.15)'
            : 'rgba(0,180,255,0.15)',
        }}>
          {icon}
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {delta != null && (
        <div className={`stat-card-delta ${deltaDir}`}>
          {deltaDir === 'up' ? '↑' : '↓'} {Math.abs(delta)} {deltaDir === 'up' ? 'new' : 'resolved'}
        </div>
      )}
    </div>
  );
}

function AnalyticsSnippet() {
  const { incidents, history } = useApp();
  const avgResponse = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.responseTime || 0), 0) / history.length)
    : 6;
  const typeCount = {};
  incidents.forEach((i) => { typeCount[i.type] = (typeCount[i.type] || 0) + 1; });
  const topType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>📊</div>
          Quick Analytics
        </div>
      </div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className="metric-box">
            <div className="metric-value" style={{ color: 'var(--accent)' }}>{avgResponse}m</div>
            <div className="metric-label">Avg Response</div>
          </div>
          <div className="metric-box">
            <div className="metric-value" style={{ color: 'var(--low)' }}>{history.length}</div>
            <div className="metric-label">Resolved Total</div>
          </div>
          <div className="metric-box" style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>Most Common Type</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
              {topType ? topType[0] : '—'} {topType ? `(${topType[1]})` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { stats, incidents } = useApp();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  return (
    <>
      {/* Greeting */}
      <div className="overview-greeting animate-fade">
        <div>
          <div className="greeting-text-title">
            {greeting}, Admin 👋
          </div>
          <div className="greeting-text-sub">
            Here's what's happening on campus today
          </div>
        </div>
        <button
          id="overview-report-btn"
          className="report-btn"
          onClick={() => setShowReport(true)}
        >
          ＋ Report Incident
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid animate-in">
        <StatCard
          label="Active Incidents"
          value={stats.activeIncidents}
          icon="⚠️"
          variant="info"
          delta={stats.unassigned}
          deltaDir="up"
        />
        <StatCard
          label="Critical Incidents"
          value={stats.criticalIncidents}
          icon="🔴"
          variant="critical"
          delta={stats.criticalIncidents}
          deltaDir="up"
        />
        <StatCard
          label="Available Responders"
          value={stats.availableResponders}
          icon="👮"
          variant="success"
        />
        <StatCard
          label="Resolved Today"
          value={stats.resolvedToday}
          icon="✅"
          variant="success"
          delta={stats.resolvedToday}
          deltaDir="down"
        />
      </div>

      {/* Main grid: Active Incidents | Response Queue */}
      <div className="overview-main animate-in">

        {/* Active Incidents */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon" style={{ background: 'rgba(255,59,48,0.12)' }}>🚨</div>
              Active Incidents
            </div>
            <span className="card-action">View All →</span>
          </div>
          <div className="card-body" style={{ flex: 1, overflow: 'auto', padding: '10px 12px' }}>
            {activeIncidents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✅</div>
                <div className="empty-state-text">Campus is safe!</div>
                <div className="empty-state-sub">No active incidents right now</div>
              </div>
            ) : (
              <div className="incident-list">
                {activeIncidents.map((inc) => (
                  <IncidentCard
                    key={inc.id}
                    incident={inc}
                    onClick={setSelectedIncident}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Response Queue */}
        <ResponseQueue />
      </div>

      {/* Bottom grid: Analytics + Activity */}
      <div className="overview-bottom animate-in">
        <AnalyticsSnippet />
        <ActivityFeed limit={6} />
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
          <img src="/srm-logo.png" alt="SRM University" style={{ height: 60, width: 60, objectFit: 'contain', marginBottom: 10 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-white)', marginBottom: 4 }}>
            SRM University
          </div>
          <div style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 2 }}>Delhi NCR, Sonipat</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8 }}>
            CampusCare Emergency Response System
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: 'var(--low)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="ai-dot" /> AI-powered · Real-time monitoring
          </div>
        </div>
      </div>

      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
      {showReport && <ReportIncidentModal onClose={() => setShowReport(false)} />}
    </>
  );
}
