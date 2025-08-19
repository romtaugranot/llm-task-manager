import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TasksPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import Onboarding from './components/Onboarding';
import { Task, UserProfile } from './types';

type Page = 'dashboard' | 'tasks' | 'calendar' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedTasks = localStorage.getItem('taskmanager-tasks');
    const savedProfile = localStorage.getItem('taskmanager-profile');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskmanager-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('taskmanager-profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeOnboarding = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} />;
      case 'tasks':
        return <TasksPage tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} />;
      case 'calendar':
        return <CalendarPage tasks={tasks} updateTask={updateTask} />;
      case 'profile':
        setShowOnboarding(true);
        return null;
      default:
        return <Dashboard tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} />;
    }
  };

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;