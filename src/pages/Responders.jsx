import { useState } from 'react';
import { useApp } from '../context/AppContext';

const SPECIALTY_ICONS = {
  'Security': '👮‍♂️',
  'Medical': '🚑',
  'Fire Safety': '👨‍🚒',
  'Maintenance': '🛠️',
  'IT Support': '💻',
};

const STATUS_BADGES = {
  available: { label: 'Available', class: 'badge-available' },
  busy: { label: 'Busy (On Incident)', class: 'badge-busy' },
  'off-duty': { label: 'Off Duty', class: 'badge-off-duty' },
};

export default function Responders() {
  const { responders, incidents, toggleResponderDuty, assignResponder } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [selectedResponder, setSelectedResponder] = useState(null);

  const filteredResponders = responders.filter((responder) => {
    const matchesSearch =
      responder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      responder.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      responder.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' || responder.status === statusFilter;

    const matchesSpecialty =
      specialtyFilter === 'all' || responder.specialty === specialtyFilter;

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const availableCount = responders.filter((r) => r.status === 'available').length;
  const busyCount = responders.filter((r) => r.status === 'busy').length;
  const offDutyCount = responders.filter((r) => r.status === 'off-duty').length;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Campus Responders</h1>
          <p className="page-subtitle">
            Manage responder personnel, active assignments, availability and deployment status.
          </p>
        </div>
      </div>

      {/* Responder Stats Row */}
      <div className="stats-grid mb-6">
        <div className="card stat-card border-left-low">
          <div className="stat-icon bg-low-subtle text-low">✅</div>
          <div>
            <div className="stat-label">Available Responders</div>
            <div className="stat-value">{availableCount}</div>
          </div>
        </div>

        <div className="card stat-card border-left-high">
          <div className="stat-icon bg-high-subtle text-high">⏳</div>
          <div>
            <div className="stat-label">Busy / Responding</div>
            <div className="stat-value">{busyCount}</div>
          </div>
        </div>

        <div className="card stat-card border-left-secondary">
          <div className="stat-icon bg-secondary-subtle text-secondary">⏸️</div>
          <div>
            <div className="stat-label">Off Duty</div>
            <div className="stat-value">{offDutyCount}</div>
          </div>
        </div>

        <div className="card stat-card border-left-primary">
          <div className="stat-icon bg-primary-subtle text-primary">👥</div>
          <div>
            <div className="stat-label">Total Responders</div>
            <div className="stat-value">{responders.length}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card filter-bar flex-between gap-4 flex-wrap mb-6">
        <div className="search-input-wrapper flex-grow flex-center gap-2">
          <span>🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search responder name, ID or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn-icon" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="flex-center gap-3 flex-wrap">
          <div className="filter-group flex-center gap-2">
            <span className="filter-label">Status:</span>
            <select
              className="form-control form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="off-duty">Off-Duty</option>
            </select>
          </div>

          <div className="filter-group flex-center gap-2">
            <span className="filter-label">Specialty:</span>
            <select
              className="form-control form-select"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              <option value="all">All Specialties</option>
              <option value="Security">👮‍♂️ Security</option>
              <option value="Medical">🚑 Medical</option>
              <option value="Fire Safety">👨‍🚒 Fire Safety</option>
              <option value="Maintenance">🛠️ Maintenance</option>
              <option value="IT Support">💻 IT Support</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responders Grid */}
      <div className="responders-grid">
        {filteredResponders.map((responder) => {
          const activeIncident = incidents.find(
            (i) => i.id === responder.currentIncidentId
          );
          const icon = SPECIALTY_ICONS[responder.specialty] || '👥';
          const badge = STATUS_BADGES[responder.status] || STATUS_BADGES.available;

          return (
            <div key={responder.id} className="card responder-card">
              <div className="responder-card-header flex-between mb-3">
                <div className="flex-center gap-3">
                  <div className="responder-avatar flex-center">
                    {icon}
                  </div>
                  <div>
                    <h3 className="responder-name">{responder.name}</h3>
                    <span className="responder-id">{responder.id} • {responder.specialty}</span>
                  </div>
                </div>
                <span className={`badge ${badge.class}`}>{badge.label}</span>
              </div>

              <div className="responder-body space-y-2 mb-4">
                <div className="flex-between text-sm">
                  <span className="text-secondary">📞 Contact:</span>
                  <span className="font-mono">{responder.phone}</span>
                </div>
                <div className="flex-between text-sm">
                  <span className="text-secondary">📍 Location:</span>
                  <span>{responder.location || 'Campus Zone'}</span>
                </div>
                <div className="flex-between text-sm">
                  <span className="text-secondary">📊 Total Responses:</span>
                  <span className="badge badge-neutral">{responder.responseCount} solved</span>
                </div>

                {responder.equipment && responder.equipment.length > 0 && (
                  <div className="equipment-list mt-2">
                    <span className="text-xs text-secondary block mb-1">Equipped With:</span>
                    <div className="flex-wrap gap-1 flex">
                      {responder.equipment.map((eq, i) => (
                        <span key={i} className="chip text-xs">{eq}</span>
                      ))}
                    </div>
                  </div>
                )}

                {activeIncident && (
                  <div className="active-incident-box mt-3 p-3 radius-md bg-subtle border-left-high">
                    <div className="text-xs font-semibold text-high mb-1">🚨 ACTIVE ASSIGNMENT</div>
                    <div className="font-bold text-sm">{activeIncident.type}</div>
                    <div className="text-xs text-secondary">📍 {activeIncident.location}</div>
                  </div>
                )}
              </div>

              <div className="responder-card-actions flex-center gap-2 pt-3 border-top">
                {responder.status !== 'busy' ? (
                  <button
                    className={`btn btn-sm flex-grow ${
                      responder.status === 'available' ? 'btn-secondary' : 'btn-primary'
                    }`}
                    onClick={() => toggleResponderDuty(responder.id)}
                  >
                    {responder.status === 'available' ? 'Set Off-Duty' : 'Set Available'}
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-secondary flex-grow"
                    onClick={() => setSelectedResponder(responder)}
                  >
                    View Assignment
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Responder Details / Reassignment if needed */}
      {selectedResponder && (
        <div className="modal-overlay" onClick={() => setSelectedResponder(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex-between mb-4">
              <h2>{selectedResponder.name} — Details</h2>
              <button className="btn-icon" onClick={() => setSelectedResponder(null)}>✕</button>
            </div>
            <div className="modal-body space-y-4">
              <p><strong>Specialty:</strong> {selectedResponder.specialty}</p>
              <p><strong>Phone:</strong> {selectedResponder.phone}</p>
              <p><strong>Status:</strong> {selectedResponder.status}</p>
              {selectedResponder.currentIncidentId && (
                <p><strong>Assigned Incident:</strong> {selectedResponder.currentIncidentId}</p>
              )}
            </div>
            <div className="modal-footer flex-end mt-4">
              <button className="btn btn-secondary" onClick={() => setSelectedResponder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
