const NAV = [
  { id: 'overview',   label: 'Overview',   icon: '⊞',  section: 'main' },
  { id: 'incidents',  label: 'Incidents',  icon: '⚠',  section: 'main', badge: true },
  { id: 'responders', label: 'Responders', icon: '👥', section: 'main' },
  { id: 'analytics',  label: 'Analytics',  icon: '📊', section: 'main' },
  { id: 'history',    label: 'History',    icon: '🕐', section: 'main' },
  { id: 'settings',   label: 'Settings',   icon: '⚙',  section: 'tools' },
];

export default function Sidebar({ activePage, setActivePage, badgeCount }) {
  const mainNav = NAV.filter((n) => n.section === 'main');
  const toolsNav = NAV.filter((n) => n.section === 'tools');

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src="/srm-logo.png"
          alt="SRM University"
          style={{ height: 40, width: 40, objectFit: 'contain', flexShrink: 0 }}
        />
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-name">SRM University</div>
          <div className="sidebar-logo-tagline">CampusCare Emergency</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {mainNav.map((item) => (
          <div
            key={item.id}
            className={`nav-item${activePage === item.id ? ' active' : ''}`}
            onClick={() => setActivePage(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActivePage(item.id)}
            id={`nav-${item.id}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && badgeCount > 0 && (
              <span className="nav-badge">{badgeCount}</span>
            )}
          </div>
        ))}

        <div className="nav-section-label">Tools</div>
        {toolsNav.map((item) => (
          <div
            key={item.id}
            className={`nav-item${activePage === item.id ? ' active' : ''}`}
            onClick={() => setActivePage(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActivePage(item.id)}
            id={`nav-${item.id}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        <div className="nav-section-label">Support</div>
        <div
          className={`nav-item${activePage === 'help' ? ' active' : ''}`}
          onClick={() => setActivePage('help')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setActivePage('help')}
          id="nav-help"
        >
          <span className="nav-icon">❓</span>
          <span>Help & Support</span>
        </div>
      </nav>

      {/* AI status */}
      <div className="sidebar-ai">
        <div className="sidebar-ai-title">
          <span className="ai-dot"></span>
          CampusCare AI
        </div>
        <div className="sidebar-ai-text">
          Analyzing, Prioritizing &amp; Responding
        </div>
      </div>
    </aside>
  );
}
