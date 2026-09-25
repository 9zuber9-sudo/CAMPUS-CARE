import { useState } from 'react';
import { useApp } from '../context/AppContext';
import IncidentCard from '../components/IncidentCard';
import IncidentDetailModal from '../components/IncidentDetailModal';
import ReportIncidentModal from '../components/ReportIncidentModal';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';

export default function Incidents() {
  const { incidents, autoAssignAllIncidents } = useApp();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === 'all' || incident.priority.toLowerCase() === priorityFilter;

    const matchesStatus =
      statusFilter === 'all' || incident.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const unassignedCount = incidents.filter((i) => i.status === 'reported').length;

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Active Incidents</h1>
          <p className="page-subtitle">
            Manage, filter, prioritize and dispatch responders for all campus incidents.
          </p>
        </div>
        <div className="flex-center gap-3">
          {unassignedCount > 0 && (
            <button className="btn btn-secondary flex-center gap-2" onClick={autoAssignAllIncidents}>
              <span>⚡</span> Auto-Assign All ({unassignedCount})
            </button>
          )}
          <button className="btn btn-primary flex-center gap-2" onClick={() => setIsReportOpen(true)}>
            <span>+</span> Report Incident
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card filter-bar flex-between gap-4 flex-wrap">
        <div className="search-input-wrapper flex-grow flex-center gap-2">
          <span>🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, type, location or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn-icon" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="flex-center gap-3 flex-wrap">
          <div className="filter-group flex-center gap-2">
            <span className="filter-label">Priority:</span>
            <select
              className="form-control form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          <div className="filter-group flex-center gap-2">
            <span className="filter-label">Status:</span>
            <select
              className="form-control form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="assigned">Assigned</option>
              <option value="responding">Responding</option>
            </select>
          </div>

          <div className="view-toggle flex-center">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Incident Content */}
      {filteredIncidents.length === 0 ? (
        <div className="card empty-state text-center py-12">
          <div className="empty-icon text-4xl mb-3">🔍</div>
          <h3>No incidents match your criteria</h3>
          <p className="text-secondary">Try resetting your search query or filters.</p>
          <button
            className="btn btn-secondary mt-4"
            onClick={() => {
              setSearchQuery('');
              setPriorityFilter('all');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="incidents-grid">
          {filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={() => setSelectedIncident(incident)}
            />
          ))}
        </div>
      ) : (
        <div className="card table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Reported At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="table-row-hover" onClick={() => setSelectedIncident(incident)}>
                  <td><code className="font-mono">{incident.id}</code></td>
                  <td className="font-medium">{incident.type}</td>
                  <td>📍 {incident.location}</td>
                  <td><PriorityBadge priority={incident.priority} /></td>
                  <td><StatusBadge status={incident.status} /></td>
                  <td>{incident.assignedResponderId || <span className="text-muted">Unassigned</span>}</td>
                  <td className="text-secondary text-sm">{new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); setSelectedIncident(incident); }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
      {isReportOpen && (
        <ReportIncidentModal onClose={() => setIsReportOpen(false)} />
      )}
    </div>
  );
}
