import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task } from '../types';

interface AddTaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const autoAssignPriority = (title: string, dueDate?: Date): Task['priority'] => {
    const titleLower = title.toLowerCase();
    const now = new Date();
    const due = dueDate ? new Date(dueDate) : null;
    const daysUntilDue = due ? Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

    if (titleLower.includes('urgent') || titleLower.includes('asap') || titleLower.includes('emergency')) {
      return 'urgent';
    }
    
    if (daysUntilDue !== null && daysUntilDue <= 1) {
      return 'urgent';
    }
    
    if (titleLower.includes('important') || titleLower.includes('critical') || titleLower.includes('priority')) {
      return 'high';
    }
    
    if (daysUntilDue !== null && daysUntilDue <= 3) {
      return 'high';
    }
    
    if (daysUntilDue !== null && daysUntilDue <= 7) {
      return 'medium';
    }
    
    return 'low';
  };

  const autoAssignCategory = (title: string, description: string): Task['category'] => {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.match(/\b(work|job|meeting|project|deadline|client|business|office|email|report|presentation)\b/)) {
      return 'work';
    }
    
    if (text.match(/\b(gym|workout|exercise|run|fitness|sport|training|cardio|strength)\b/)) {
      return 'fitness';
    }
    
    if (text.match(/\b(eat|food|meal|diet|nutrition|cook|recipe|healthy|vitamin|protein)\b/)) {
      return 'nutrition';
    }
    
    if (text.match(/\b(meditat|relax|sleep|stress|mental|therapy|wellness|mindful|yoga|breathe)\b/)) {
      return 'wellness';
    }
    
    return 'personal';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    const priority = autoAssignPriority(title, dueDateObj);
    const category = autoAssignCategory(title, description);

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      dueDate: dueDateObj,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      layout
    >
      <div className="flex space-x-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <motion.button
          type="submit"
          disabled={!title.trim()}
          className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${
            title.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={title.trim() ? { scale: 1.05 } : {}}
          whileTap={title.trim() ? { scale: 0.95 } : {}}
        >
          <Plus size={20} />
          <span>Add</span>
        </motion.button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 pt-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <strong>Smart Assignment:</strong> Priority and category will be automatically assigned based on your task title and description.
          </div>
        </div>
      </motion.div>
    </motion.form>
  );
};

export default AddTaskForm;