import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import { getTypeIcon } from '../utils/helpers';

export default function History() {
  const { history } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedHistorical, setSelectedHistorical] = useState(null);

  const filteredHistory = history.filter((incident) => {
    const matchesSearch =
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (incident.resolutionNotes && incident.resolutionNotes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority =
      priorityFilter === 'all' || incident.priority.toLowerCase() === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const exportToCSV = () => {
    if (filteredHistory.length === 0) return;

    const headers = [
      'Incident ID',
      'Type',
      'Location',
      'Priority',
      'Reported By',
      'Reported Time',
      'Resolved Time',
      'Duration (Mins)',
      'Resolution Notes',
    ];

    const rows = filteredHistory.map((item) => [
      item.id,
      `"${item.type}"`,
      `"${item.location}"`,
      item.priority,
      `"${item.reportedBy || 'Anonymous'}"`,
      `"${new Date(item.timestamp).toLocaleString()}"`,
      `"${item.resolvedAt ? new Date(item.resolvedAt).toLocaleString() : 'N/A'}"`,
      item.responseTime || 15,
      `"${(item.resolutionNotes || 'Resolved.').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusCare_Audit_Log_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Incident History & Audit Log</h1>
          <p className="page-subtitle">
            Archive of resolved campus incidents, resolution duration, audit trails and post-incident reports.
          </p>
        </div>
        <div className="flex-center gap-3">
          <button
            className="btn btn-secondary flex-center gap-2"
            onClick={exportToCSV}
            title="Download official CSV audit log"
          >
            <span>📥</span> Export CSV Report
          </button>
          <button
            className="btn btn-primary flex-center gap-2"
            onClick={() => window.print()}
            title="Print official audit summary"
          >
            <span>🖨️</span> Print Log
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card filter-bar flex-between gap-4 flex-wrap mb-6">
        <div className="search-input-wrapper flex-grow flex-center gap-2">
          <span>🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search resolution notes, ID, type or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn-icon" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

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
      </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="card empty-state text-center py-12">
          <div className="empty-icon text-4xl mb-3">📁</div>
          <h3>No historical records match your search</h3>
          <p className="text-secondary">Try adjusting your search query or filters.</p>
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
                <th>Reported At</th>
                <th>Resolved At</th>
                <th>Duration</th>
                <th>Resolution Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="table-row-hover">
                  <td><code className="font-mono">{item.id}</code></td>
                  <td className="font-medium">
                    <span className="mr-2">{getTypeIcon(item.type)}</span>
                    {item.type}
                  </td>
                  <td>📍 {item.location}</td>
                  <td><PriorityBadge priority={item.priority} /></td>
                  <td className="text-xs text-secondary">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="text-xs text-secondary">{item.resolvedAt ? new Date(item.resolvedAt).toLocaleString() : 'N/A'}</td>
                  <td>
                    <span className="badge badge-neutral">⏱️ {item.responseTime || 15}m</span>
                  </td>
                  <td className="text-sm max-w-xs truncate">{item.resolutionNotes || 'Resolved.'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setSelectedHistorical(item)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal for Historical Incident */}
      {selectedHistorical && (
        <div className="modal-overlay" onClick={() => setSelectedHistorical(null)}>
          <div className="modal-content card max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between mb-4">
              <div>
                <h2>{selectedHistorical.id} — Post-Incident Report</h2>
                <div className="flex-center gap-2 mt-1">
                  <PriorityBadge priority={selectedHistorical.priority} />
                  <StatusBadge status="resolved" />
                </div>
              </div>
              <button className="btn-icon" onClick={() => setSelectedHistorical(null)}>✕</button>
            </div>

            <div className="modal-body space-y-4">
              <div className="grid grid-2 gap-4">
                <div className="p-3 bg-subtle radius-md">
                  <div className="text-xs text-secondary">Incident Type</div>
                  <div className="font-semibold">{selectedHistorical.type}</div>
                </div>
                <div className="p-3 bg-subtle radius-md">
                  <div className="text-xs text-secondary">Location</div>
                  <div className="font-semibold">📍 {selectedHistorical.location}</div>
                </div>
                <div className="p-3 bg-subtle radius-md">
                  <div className="text-xs text-secondary">Reported By</div>
                  <div className="font-semibold">{selectedHistorical.reportedBy || 'Anonymous'}</div>
                </div>
                <div className="p-3 bg-subtle radius-md">
                  <div className="text-xs text-secondary">Time to Resolve</div>
                  <div className="font-semibold">⏱️ {selectedHistorical.responseTime || 15} minutes</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Original Description:</h4>
                <p className="p-3 bg-subtle radius-md text-sm">{selectedHistorical.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Resolution Summary & Action Taken:</h4>
                <p className="p-3 bg-low-subtle text-low radius-md text-sm font-medium">
                  {selectedHistorical.resolutionNotes}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Audit History Trail:</h4>
                <div className="timeline pl-2 border-left space-y-2">
                  {selectedHistorical.history?.map((h, i) => (
                    <div key={i} className="timeline-item text-xs">
                      <span className="font-semibold">{h.action}</span>
                      <span className="text-secondary ml-2">— {new Date(h.timestamp).toLocaleTimeString()} ({h.by})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer flex-end mt-4">
              <button className="btn btn-secondary" onClick={() => setSelectedHistorical(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
