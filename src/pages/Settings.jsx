import { useState } from 'react';

export default function Settings() {
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [criticalAlarm, setCriticalAlarm] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const [campusName, setCampusName] = useState('Main Campus');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43210');
  const [adminEmail, setAdminEmail] = useState('security@campus.edu');

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">System & AI Settings</h1>
        <p className="page-subtitle">
          Configure response system behavior, AI priority algorithms, emergency contacts and notification channels.
        </p>
      </div>

      {saved && (
        <div className="p-4 mb-6 radius-md bg-low-subtle text-low flex-between font-semibold">
          <span>✅ System configuration saved successfully!</span>
          <span className="text-xs text-secondary">All changes live</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Campus Information */}
        <div className="card">
          <div className="card-header mb-4">
            <h3 className="card-title">🏫 Campus Identity & Emergency Hotline</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="form-label">Campus Name</label>
              <input
                type="text"
                className="form-control"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
              />
            </div>
            <div className="grid grid-2 gap-4">
              <div>
                <label className="form-label">Emergency Hotline Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Control Room Dispatch Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI & Automation Engine */}
        <div className="card">
          <div className="card-header mb-4">
            <h3 className="card-title">🤖 AI Priority & Auto-Dispatch Engine</h3>
          </div>
          <div className="space-y-4">
            <div className="flex-between p-3 bg-subtle radius-md">
              <div>
                <div className="font-semibold text-sm">Automatic Responder Dispatch</div>
                <div className="text-xs text-secondary">
                  Automatically pair available responders with high & critical priority incidents upon report.
                </div>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={autoDispatch}
                onChange={(e) => setAutoDispatch(e.target.checked)}
              />
            </div>

            <div className="p-3 bg-subtle radius-md space-y-2">
              <div className="font-semibold text-sm">Algorithm Weight Configuration</div>
              <div className="text-xs text-secondary mb-3">
                Adjust sensitivity parameters used by AI to compute priority levels.
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex-between text-xs mb-1">
                    <span>Keyword Urgency Weight</span>
                    <span className="font-mono">85%</span>
                  </div>
                  <input type="range" className="w-full" defaultValue="85" />
                </div>
                <div>
                  <div className="flex-between text-xs mb-1">
                    <span>Location Risk Factor (Hostel/Lab multiplier)</span>
                    <span className="font-mono">70%</span>
                  </div>
                  <input type="range" className="w-full" defaultValue="70" />
                </div>
                <div>
                  <div className="flex-between text-xs mb-1">
                    <span>Night-time Hazard Multiplier (8 PM - 6 AM)</span>
                    <span className="font-mono">1.25x</span>
                  </div>
                  <input type="range" className="w-full" defaultValue="75" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Notifications */}
        <div className="card">
          <div className="card-header mb-4">
            <h3 className="card-title">🔔 Emergency Sound & Dispatch Alerts</h3>
          </div>
          <div className="space-y-3">
            <div className="flex-between p-3 bg-subtle radius-md">
              <div>
                <div className="font-semibold text-sm">Critical Incident Audio Alarm</div>
                <div className="text-xs text-secondary">Play loud alarm sound in control room when Critical incident is logged</div>
              </div>
              <input
                type="checkbox"
                checked={criticalAlarm}
                onChange={(e) => setCriticalAlarm(e.target.checked)}
              />
            </div>

            <div className="flex-between p-3 bg-subtle radius-md">
              <div>
                <div className="font-semibold text-sm">SMS Alerts to Responder Phones</div>
                <div className="text-xs text-secondary">Dispatch direct SMS to on-duty responders upon assignment</div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
              />
            </div>

            <div className="flex-between p-3 bg-subtle radius-md">
              <div>
                <div className="font-semibold text-sm">Daily Summary Email</div>
                <div className="text-xs text-secondary">Send daily incident report summary to campus security administration</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex-end gap-3">
          <button type="submit" className="btn btn-primary px-6">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
