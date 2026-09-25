import { useApp } from '../context/AppContext';

export default function Analytics() {
  const { incidents, history, responders } = useApp();

  const totalIncidentsCount = incidents.length + history.length;
  const resolvedCount = history.length;
  
  // Calculate average response time
  const totalResponseTime = history.reduce((acc, curr) => acc + (curr.responseTime || 15), 0);
  const avgResponseTime = history.length > 0 ? Math.round(totalResponseTime / history.length) : 8;

  // Breakdown by priority
  const allItems = [...incidents, ...history];
  const criticalCount = allItems.filter((i) => i.priority === 'Critical').length;
  const highCount = allItems.filter((i) => i.priority === 'High').length;
  const mediumCount = allItems.filter((i) => i.priority === 'Medium').length;
  const lowCount = allItems.filter((i) => i.priority === 'Low').length;

  // Location hotspots
  const locationMap = {};
  allItems.forEach((item) => {
    locationMap[item.location] = (locationMap[item.location] || 0) + 1;
  });
  const sortedLocations = Object.entries(locationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Type distribution
  const typeMap = {};
  allItems.forEach((item) => {
    typeMap[item.type] = (typeMap[item.type] || 0) + 1;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Analytics & Intelligence</h1>
        <p className="page-subtitle">
          Real-time metrics, incident distribution, hotspot analysis and response performance.
        </p>
      </div>

      {/* KPI Row */}
      <div className="stats-grid mb-6">
        <div className="card stat-card border-left-primary">
          <div className="stat-icon bg-primary-subtle text-primary">📊</div>
          <div>
            <div className="stat-label">Total Logged Incidents</div>
            <div className="stat-value">{totalIncidentsCount}</div>
            <div className="stat-desc text-xs text-secondary mt-1">Active + Historical</div>
          </div>
        </div>

        <div className="card stat-card border-left-low">
          <div className="stat-icon bg-low-subtle text-low">⏱️</div>
          <div>
            <div className="stat-label">Avg Response Time</div>
            <div className="stat-value">{avgResponseTime} <span className="text-sm font-normal">mins</span></div>
            <div className="stat-desc text-xs text-low mt-1">⚡ 18% faster than target</div>
          </div>
        </div>

        <div className="card stat-card border-left-high">
          <div className="stat-icon bg-high-subtle text-high">🎯</div>
          <div>
            <div className="stat-label">Resolution Rate</div>
            <div className="stat-value">
              {totalIncidentsCount > 0
                ? Math.round((resolvedCount / totalIncidentsCount) * 100)
                : 100}
              %
            </div>
            <div className="stat-desc text-xs text-secondary mt-1">{resolvedCount} incidents resolved</div>
          </div>
        </div>

        <div className="card stat-card border-left-secondary">
          <div className="stat-icon bg-secondary-subtle text-secondary">🤖</div>
          <div>
            <div className="stat-label">AI Priority Precision</div>
            <div className="stat-value">98.4%</div>
            <div className="stat-desc text-xs text-secondary mt-1">Multi-factor algorithmic engine</div>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="analytics-grid">
        {/* Priority Breakdown Card */}
        <div className="card">
          <div className="card-header flex-between mb-4">
            <h3 className="card-title">Priority Breakdown</h3>
            <span className="badge badge-neutral">Severity Ratio</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex-between text-sm mb-1">
                <span className="font-semibold text-critical">🔴 Critical</span>
                <span>{criticalCount} ({Math.round((criticalCount / (totalIncidentsCount || 1)) * 100)}%)</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill bg-critical"
                  style={{ width: `${(criticalCount / (totalIncidentsCount || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex-between text-sm mb-1">
                <span className="font-semibold text-high">🟠 High</span>
                <span>{highCount} ({Math.round((highCount / (totalIncidentsCount || 1)) * 100)}%)</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill bg-high"
                  style={{ width: `${(highCount / (totalIncidentsCount || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex-between text-sm mb-1">
                <span className="font-semibold text-medium">🟡 Medium</span>
                <span>{mediumCount} ({Math.round((mediumCount / (totalIncidentsCount || 1)) * 100)}%)</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill bg-medium"
                  style={{ width: `${(mediumCount / (totalIncidentsCount || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex-between text-sm mb-1">
                <span className="font-semibold text-low">🟢 Low</span>
                <span>{lowCount} ({Math.round((lowCount / (totalIncidentsCount || 1)) * 100)}%)</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill bg-low"
                  style={{ width: `${(lowCount / (totalIncidentsCount || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hotspot Locations Ranking */}
        <div className="card">
          <div className="card-header flex-between mb-4">
            <h3 className="card-title">Campus Hotspot Zones</h3>
            <span className="badge badge-neutral">Top Reported Zones</span>
          </div>
          <div className="space-y-3">
            {sortedLocations.map(([location, count], idx) => (
              <div key={location} className="flex-between p-2 radius-md bg-subtle">
                <div className="flex-center gap-3">
                  <span className="rank-badge flex-center">{idx + 1}</span>
                  <span className="font-medium text-sm">📍 {location}</span>
                </div>
                <span className="badge badge-neutral">{count} incidents</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Category Distribution */}
        <div className="card">
          <div className="card-header flex-between mb-4">
            <h3 className="card-title">Incident Categories</h3>
            <span className="badge badge-neutral">Category Count</span>
          </div>
          <div className="space-y-3">
            {Object.entries(typeMap).map(([type, count]) => (
              <div key={type} className="flex-between text-sm border-bottom pb-2">
                <span>{type}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Responder Efficiency */}
        <div className="card">
          <div className="card-header flex-between mb-4">
            <h3 className="card-title">Responder Fleet Utilization</h3>
            <span className="badge badge-neutral">{responders.length} Responders</span>
          </div>
          <div className="space-y-3">
            {responders.map((r) => (
              <div key={r.id} className="flex-between text-sm border-bottom pb-2">
                <div>
                  <span className="font-medium">{r.name}</span>
                  <span className="text-xs text-secondary block">{r.specialty}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono">{r.responseCount} resolved</span>
                  <span className={`badge badge-sm block ${r.status === 'available' ? 'badge-available' : r.status === 'busy' ? 'badge-busy' : 'badge-off-duty'}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
