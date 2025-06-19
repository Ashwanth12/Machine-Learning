import React, { useState, useEffect } from 'react';
import { FileText, Home, Upload, Database, PieChart, BarChartHorizontal, Download } from 'lucide-react';
import Navigation from './components/Navigation';
import Introduction from './pages/Introduction';
import UploadPage from './pages/UploadPage';
import CleaningPage from './pages/CleaningPage';
import ProfilingPage from './pages/ProfilingPage';
import VisualizationPage from './pages/VisualizationPage';
import ModelingPage from './pages/ModelingPage';
import DownloadPage from './pages/DownloadPage';
import AuthPage from './pages/AuthPage';
import { DataProvider } from './context/DataContext';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activePage, setActivePage] = useState('introduction');
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const pages = [
    { id: 'introduction', label: 'Introduction', icon: <Home size={20} /> },
    { id: 'upload', label: 'Upload', icon: <Upload size={20} /> },
    { id: 'cleaning', label: 'Cleaning', icon: <FileText size={20} /> },
    { id: 'profiling', label: 'Profiling', icon: <Database size={20} /> },
    { id: 'visualization', label: 'Data Visualization', icon: <PieChart size={20} /> },
    { id: 'modeling', label: 'Modeling', icon: <BarChartHorizontal size={20} /> },
    { id: 'download', label: 'Download', icon: <Download size={20} /> },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'introduction':
        return <Introduction />;
      case 'upload':
        return <UploadPage />;
      case 'cleaning':
        return <CleaningPage />;
      case 'profiling':
        return <ProfilingPage />;
      case 'visualization':
        return <VisualizationPage />;
      case 'modeling':
        return <ModelingPage />;
      case 'download':
        return <DownloadPage />;
      default:
        return <Introduction />;
    }
  };

  if (!session) {
    return (
      <>
        <Toaster position="top-right" />
        <AuthPage />
      </>
    );
  }

  return (
    <DataProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <Navigation 
          pages={pages} 
          activePage={activePage} 
          setActivePage={setActivePage} 
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <Toaster position="top-right" />
    </DataProvider>
  );
}

export default App;