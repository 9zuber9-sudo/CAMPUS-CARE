import { useState, useEffect } from 'react';

export default function Settings() {
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [criticalAlarm, setCriticalAlarm] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const [campusName, setCampusName] = useState('Main Campus');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43210');
  const [adminEmail, setAdminEmail] = useState('security@campus.edu');

  const [saved, setSaved] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      alert('CampusCare is ready for PWA installation! On Chrome/Edge, click the Install icon in your browser address bar. On iOS/Safari, tap Share ➔ Add to Home Screen.');
    }
  };

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

        {/* Progressive Web App (PWA) Installation Card */}
        <div className="card">
          <div className="card-header mb-4 flex-between">
            <h3 className="card-title flex-center gap-2">
              <span>📱</span> Progressive Web App (PWA) Installation
            </h3>
            {isInstalled ? (
              <span className="badge badge-low">✅ Installed Standalone</span>
            ) : (
              <span className="badge badge-primary">⚡ PWA Ready</span>
            )}
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-subtle radius-md flex-between flex-wrap gap-4 align-center">
              <div>
                <div className="font-bold text-sm text-white mb-1">Install CampusCare as Desktop / Mobile App</div>
                <div className="text-xs text-secondary max-w-xl">
                  Install CampusCare directly onto your phone or desktop home screen. Runs offline with zero browser address bar, instant launch, and native app performance.
                </div>
              </div>
              <button
                type="button"
                className={`btn ${isInstalled ? 'btn-secondary' : 'btn-primary'} flex-center gap-2`}
                onClick={handleInstallPWA}
              >
                <span>📥</span> {isInstalled ? 'App Already Installed' : 'Install PWA App'}
              </button>
            </div>

            <div className="p-3 bg-black-20 radius-md text-xs text-secondary space-y-1">
              <div className="font-semibold text-white">💡 Installation Instructions:</div>
              <div>• <strong>Chrome / Edge (Desktop/Android):</strong> Click the <strong>"Install PWA App"</strong> button above or click the ⊕ Install icon in browser address bar.</div>
              <div>• <strong>Safari (iOS/iPhone):</strong> Tap the <strong>Share button (⎋)</strong> ➔ Select <strong>"Add to Home Screen (+)"</strong>.</div>
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
