import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    workStart: '09:00',
    workEnd: '17:00',
    priorities: [] as string[],
    productivityTime: 'morning' as 'morning' | 'afternoon' | 'evening',
    goals: [] as string[],
    notifications: true,
    theme: 'light' as 'light' | 'dark',
    weekStart: 'monday' as 'sunday' | 'monday',
  });

  const questions = [
    {
      title: "Welcome to TaskManager!",
      subtitle: "Let's personalize your experience",
      content: (
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">What's your name?</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </label>
        </div>
      )
    },
    {
      title: "Work Schedule",
      subtitle: "When do you typically work?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Start Time</span>
              <input
                type="time"
                value={formData.workStart}
                onChange={(e) => setFormData(prev => ({ ...prev, workStart: e.target.value }))}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-medium">End Time</span>
              <input
                type="time"
                value={formData.workEnd}
                onChange={(e) => setFormData(prev => ({ ...prev, workEnd: e.target.value }))}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
          </div>
        </div>
      )
    },
    {
      title: "Your Priorities",
      subtitle: "What areas are most important to you?",
      content: (
        <div className="space-y-3">
          {['Work & Career', 'Health & Fitness', 'Personal Growth', 'Family & Relationships', 'Hobbies & Interests'].map(priority => (
            <label key={priority} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.priorities.includes(priority)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, priorities: [...prev.priorities, priority] }));
                  } else {
                    setFormData(prev => ({ ...prev, priorities: prev.priorities.filter(p => p !== priority) }));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{priority}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Productivity Peak",
      subtitle: "When are you most productive?",
      content: (
        <div className="space-y-3">
          {[
            { value: 'morning', label: 'Morning (6 AM - 12 PM)', desc: 'I work best in the early hours' },
            { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)', desc: 'I hit my stride mid-day' },
            { value: 'evening', label: 'Evening (6 PM - 12 AM)', desc: 'I\'m a night owl' }
          ].map(option => (
            <label key={option.value} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="productivityTime"
                value={option.value}
                checked={formData.productivityTime === option.value}
                onChange={(e) => setFormData(prev => ({ ...prev, productivityTime: e.target.value as any }))}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900 font-medium">{option.label}</div>
                <div className="text-gray-500 text-sm">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Your Goals",
      subtitle: "What would you like to achieve?",
      content: (
        <div className="space-y-3">
          {['Improve productivity', 'Better work-life balance', 'Health & wellness', 'Learn new skills', 'Complete projects', 'Build habits'].map(goal => (
            <label key={goal} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.goals.includes(goal)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({ ...prev, goals: [...prev.goals, goal] }));
                  } else {
                    setFormData(prev => ({ ...prev, goals: prev.goals.filter(g => g !== goal) }));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{goal}</span>
            </label>
          ))}
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      const profile: UserProfile = {
        name: formData.name,
        workHours: {
          start: formData.workStart,
          end: formData.workEnd,
        },
        priorities: formData.priorities,
        productivityTime: formData.productivityTime,
        goals: formData.goals,
        preferences: {
          notifications: formData.notifications,
          theme: formData.theme,
          weekStart: formData.weekStart,
        },
      };
      onComplete(profile);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim().length > 0;
      case 2:
        return formData.priorities.length > 0;
      case 4:
        return formData.goals.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {questions.length}</span>
            <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {questions[currentStep].title}
            </h2>
            <p className="text-gray-600 mb-8">
              {questions[currentStep].subtitle}
            </p>
            
            {questions[currentStep].content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </motion.button>

          <motion.button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={canProceed() ? { scale: 1.05 } : {}}
            whileTap={canProceed() ? { scale: 0.95 } : {}}
          >
            <span>{currentStep === questions.length - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;