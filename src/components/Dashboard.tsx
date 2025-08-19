import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import AddTaskForm from './AddTaskForm';
import TaskStats from './TaskStats';
import TaskCard from './TaskCard';

interface DashboardProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, addTask, updateTask, deleteTask }) => {
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Add Task */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Add Task</h2>
              <AddTaskForm onSubmit={addTask} />
            </motion.div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
              <div className="space-y-3">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TaskCard
                        task={task}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No tasks yet. Add your first task above!</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <TaskStats tasks={tasks} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;