import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, CheckSquare, Calendar, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskManager
            </h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="block"
                >
                  <motion.div
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;