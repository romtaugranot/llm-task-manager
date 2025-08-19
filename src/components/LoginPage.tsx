import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Shield, CheckCircle, Users, Zap } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: { id: string; name: string; email: string; picture: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would integrate with Google OAuth
      // For demo purposes, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful Google login response
      const mockUser = {
        id: 'google_' + Date.now(),
        name: 'Demo User',
        email: 'demo@example.com',
        picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      };
      
      onLogin(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely with Google-grade security.'
    },
    {
      icon: Zap,
      title: 'Instant Sync',
      description: 'Access your tasks from any device with real-time synchronization.'
    },
    {
      icon: Users,
      title: 'Team Ready',
      description: 'Share tasks and collaborate with your team seamlessly.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side - Branding & Features */}
        <motion.div
          className="text-center order-2 lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskManager
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              The smart way to organize your life and boost productivity
            </motion.p>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-start space-x-3 lg:space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <feature.icon size={20} className="text-white lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm lg:text-base text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          className="max-w-md mx-auto w-full order-1 lg:order-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8">
            <div className="text-center mb-6 lg:mb-8">
              <motion.div
                className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <LogIn size={24} className="text-white lg:w-8 lg:h-8" />
              </motion.div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-sm lg:text-base text-gray-600">Sign in to access your personalized task manager</p>
            </div>

            <motion.button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-3 px-4 lg:px-6 py-3 lg:py-4 border border-gray-300 rounded-xl font-medium transition-all text-sm lg:text-base ${
                isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </motion.button>

            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 lg:space-x-6 text-xs lg:text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500 lg:w-4 lg:h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500 lg:w-4 lg:h-4" />
                  <span>Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500 lg:w-4 lg:h-4" />
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <motion.div
            className="mt-4 lg:mt-6 p-3 lg:p-4 bg-blue-50 border border-blue-200 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs lg:text-sm text-blue-800 text-center">
              <strong>Demo Mode:</strong> This is a demonstration. Click "Continue with Google" to proceed without actual authentication.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;