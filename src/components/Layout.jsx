import { useApp } from '../context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ activePage, setActivePage, children }) {
  const { incidents } = useApp();
  const unresolvedCount = incidents.length;

  return (
    <div className="app-root">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        badgeCount={unresolvedCount}
      />
      <div className="content-area">
        <Header setActivePage={setActivePage} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
