import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Incidents from './pages/Incidents';
import Responders from './pages/Responders';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Settings from './pages/Settings';
import Help from './pages/Help';

export default function App() {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':   return <Overview />;
      case 'incidents':  return <Incidents />;
      case 'responders': return <Responders />;
      case 'analytics':  return <Analytics />;
      case 'history':    return <History />;
      case 'settings':   return <Settings />;
      case 'help':       return <Help />;
      default:           return <Overview />;
    }
  };

  return (
    <AppProvider>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {renderPage()}
      </Layout>
    </AppProvider>
  );
}
