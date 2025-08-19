import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Palette, Calendar as CalendarIcon, Clock, Target, Edit } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onStartOnboarding: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onUpdateProfile, onStartOnboarding }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile | null>(userProfile);

  const handleSave = () => {
    if (editProfile) {
      onUpdateProfile(editProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditProfile(userProfile);
    setIsEditing(false);
  };

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <User size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Profile Found</h2>
            <p className="text-gray-600 mb-8">Complete the onboarding process to set up your profile.</p>
            <motion.button
              onClick={onStartOnboarding}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Onboarding
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600">Manage your personal information and preferences</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!isEditing ? (
                <>
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    onClick={onStartOnboarding}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retake Onboarding
                  </motion.button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <User size={20} className="text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editProfile?.name || ''}
                    onChange={(e) => setEditProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{userProfile.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Start</label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={editProfile?.workHours.start || ''}
                      onChange={(e) => setEditProfile(prev => prev ? { 
                        ...prev, 
                        workHours: { ...prev.workHours, start: e.target.value }
                      } : null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{userProfile.workHours.start}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work End</label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={editProfile?.workHours.end || ''}
                      onChange={(e) => setEditProfile(prev => prev ? { 
                        ...prev, 
                        workHours: { ...prev.workHours, end: e.target.value }
                      } : null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{userProfile.workHours.end}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Productivity Time</label>
                {isEditing ? (
                  <select
                    value={editProfile?.productivityTime || ''}
                    onChange={(e) => setEditProfile(prev => prev ? { 
                      ...prev, 
                      productivityTime: e.target.value as 'morning' | 'afternoon' | 'evening'
                    } : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg capitalize">{userProfile.productivityTime}</p>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings size={20} className="text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell size={20} className="text-gray-500" />
                    <span className="text-gray-900">Notifications</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editProfile?.preferences.notifications || false}
                      onChange={(e) => setEditProfile(prev => prev ? {
                        ...prev,
                        preferences: { ...prev.preferences, notifications: e.target.checked }
                      } : null)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      userProfile.preferences.notifications 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userProfile.preferences.notifications ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Palette size={20} className="text-gray-500" />
                    <span className="text-gray-900">Theme</span>
                  </div>
                  {isEditing ? (
                    <select
                      value={editProfile?.preferences.theme || ''}
                      onChange={(e) => setEditProfile(prev => prev ? {
                        ...prev,
                        preferences: { ...prev.preferences, theme: e.target.value as 'light' | 'dark' }
                      } : null)}
                      className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                      {userProfile.preferences.theme}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon size={20} className="text-gray-500" />
                    <span className="text-gray-900">Week Starts On</span>
                  </div>
                  {isEditing ? (
                    <select
                      value={editProfile?.preferences.weekStart || ''}
                      onChange={(e) => setEditProfile(prev => prev ? {
                        ...prev,
                        preferences: { ...prev.preferences, weekStart: e.target.value as 'sunday' | 'monday' }
                      } : null)}
                      className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                    </select>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 capitalize">
                      {userProfile.preferences.weekStart}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Priorities and Goals */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Target size={20} className="text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">Priorities</h2>
              </div>
              <div className="space-y-2">
                {userProfile.priorities.map((priority, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-900">{priority}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Target size={20} className="text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">Goals</h2>
              </div>
              <div className="space-y-2">
                {userProfile.goals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-900">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;