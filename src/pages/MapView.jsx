import { useState } from 'react';
import { useApp } from '../context/AppContext';
import CampusMap from '../components/CampusMap';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import IncidentDetailModal from '../components/IncidentDetailModal';

export default function MapView() {
  const { incidents } = useApp();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredIncidents = incidents.filter(
    (i) => filterPriority === 'all' || i.priority.toLowerCase() === filterPriority
  );

  return (
    <div className="page-container map-page-layout">
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Interactive Campus Command Map</h1>
          <p className="page-subtitle">
            Real-time visual tracking of incidents, emergency responders and building zones across campus.
          </p>
        </div>
        <div className="flex-center gap-3">
          <select
            className="form-control form-select text-sm"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">Show All Priorities ({incidents.length})</option>
            <option value="critical">🔴 Critical Only</option>
            <option value="high">🟠 High Only</option>
            <option value="medium">🟡 Medium Only</option>
            <option value="low">🟢 Low Only</option>
          </select>
        </div>
      </div>

      <div className="map-view-grid grid grid-cols-12 gap-6">
        {/* Full Map Canvas */}
        <div className="col-span-8 card p-0 overflow-hidden relative" style={{ minHeight: '520px' }}>
          <CampusMap compact={false} />
        </div>

        {/* Live Active Pins Sidebar */}
        <div className="col-span-4 card flex flex-col h-full">
          <div className="card-header flex-between mb-3 border-bottom pb-2">
            <h3 className="card-title text-base">Active Map Pins ({filteredIncidents.length})</h3>
            <span className="badge badge-neutral text-xs">Live Sync</span>
          </div>

          <div className="incidents-map-sidebar space-y-3 flex-grow overflow-y-auto pr-1" style={{ maxHeight: '460px' }}>
            {filteredIncidents.length === 0 ? (
              <div className="text-center text-secondary py-8">
                No active pins match this priority.
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-3 radius-md bg-subtle hover-lift cursor-pointer border-left-high"
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="flex-between mb-1">
                    <span className="font-mono text-xs font-bold text-accent">{incident.id}</span>
                    <PriorityBadge priority={incident.priority} />
                  </div>
                  <div className="font-semibold text-sm mb-1">{incident.type}</div>
                  <div className="text-xs text-secondary mb-2">📍 {incident.location}</div>
                  <div className="flex-between align-center">
                    <StatusBadge status={incident.status} />
                    <span className="text-xs text-accent">Click to inspect →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}
