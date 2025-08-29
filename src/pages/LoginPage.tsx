import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, User, Lock, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const { language, setLanguage } = useApp();

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast.success(language === 'en' ? 'Login successful!' : 'लॉगिन सफल!');
      } else {
        toast.error(language === 'en' ? 'Invalid credentials' : 'गलत प्रमाण पत्र');
      }
    } catch (error) {
      toast.error(language === 'en' ? 'Login failed' : 'लॉगिन असफल');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = {
    citizen: { email: 'citizen@demo.com', password: 'password' },
    officer: { email: 'officer@demo.com', password: 'password' },
    admin: { email: 'admin@demo.com', password: 'password' }
  };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials[role as keyof typeof demoCredentials].email);
    setPassword(demoCredentials[role as keyof typeof demoCredentials].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Shield className="h-12 w-12 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {language === 'en' ? 'E-Gov Portal' : 'ई-गवर्न पोर्टल'}
              </h1>
              <p className="text-blue-200">
                {language === 'en' ? 'Digital India Initiative' : 'डिजिटल इंडिया पहल'}
              </p>
            </div>
          </div>
          
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-2 mx-auto mb-6 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Login as' : 'के रूप में लॉगिन'}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="citizen">
                  {language === 'en' ? 'Citizen' : 'नागरिक'}
                </option>
                <option value="officer">
                  {language === 'en' ? 'Government Officer' : 'सरकारी अधिकारी'}
                </option>
                <option value="admin">
                  {language === 'en' ? 'System Administrator' : 'सिस्टम प्रशासक'}
                </option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                {language === 'en' ? 'Email Address' : 'ईमेल पता'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter your email' : 'अपना ईमेल दर्ज करें'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="h-4 w-4 inline mr-2" />
                {language === 'en' ? 'Password' : 'पासवर्ड'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'en' ? 'Enter your password' : 'अपना पासवर्ड दर्ज करें'}
              />
            </div>

            {/* Demo Credentials Button */}
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              {language === 'en' ? 'Use Demo Credentials' : 'डेमो क्रेडेंशियल का उपयोग करें'}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {language === 'en' ? 'Signing in...' : 'साइन इन हो रहा है...'}
                </div>
              ) : (
                language === 'en' ? 'Sign In Securely' : 'सुरक्षित साइन इन'
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              {language === 'en' ? 'Demo Credentials:' : 'डेमो क्रेडेंशियल:'}
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>{language === 'en' ? 'Citizen:' : 'नागरिक:'}</strong> citizen@demo.com / password</p>
              <p><strong>{language === 'en' ? 'Officer:' : 'अधिकारी:'}</strong> officer@demo.com / password</p>
              <p><strong>{language === 'en' ? 'Admin:' : 'प्रशासक:'}</strong> admin@demo.com / password</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-blue-200 text-sm">
          <p>
            {language === 'en' 
              ? 'Secure • Transparent • Efficient Government Services' 
              : 'सुरक्षित • पारदर्शी • कुशल सरकारी सेवाएं'
            }
          </p>
        </div>
      </div>
    </div>
  );
}