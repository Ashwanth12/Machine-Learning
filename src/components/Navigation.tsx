import React from 'react';
import { Brain, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from './Button';

interface Page {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  pages: Page[];
  activePage: string;
  setActivePage: (id: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ pages, activePage, setActivePage }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="bg-white border-r border-gray-200 w-full md:w-64 md:min-h-screen shadow-sm flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Brain size={28} className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">AutoML</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Machine Learning Platform</p>
      </div>
      
      <div className="flex-grow py-4">
        <ul>
          {pages.map((page) => (
            <li key={page.id}>
              <button
                onClick={() => setActivePage(page.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 ${
                  activePage === page.id
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                <span className={activePage === page.id ? 'text-blue-600' : 'text-gray-500'}>
                  {page.icon}
                </span>
                <span className="font-medium">{page.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={handleLogout}
            icon={<LogOut size={16} />}
          >
            Sign Out
          </Button>
          <div className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} AutoML Platform
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;