import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TasksPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import ProfilePage from './components/ProfilePage';
import Onboarding from './components/Onboarding';
import { Task, UserProfile } from './types';

function App() {
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

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} />
                  </motion.div>
                } 
              />
              <Route path="/tasks" element={<TasksPage tasks={tasks} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask} />} />
              <Route path="/calendar" element={<CalendarPage tasks={tasks} updateTask={updateTask} />} />
              <Route 
                path="/profile" 
                element={<ProfilePage userProfile={userProfile} onUpdateProfile={updateUserProfile} onStartOnboarding={startOnboarding} />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;