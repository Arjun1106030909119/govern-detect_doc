import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Shield,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { notifications, language, setLanguage } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read && n.userId === user?.id).length;

  const navigation = {
    citizen: [
      { name: 'Dashboard', href: '/citizen', icon: FileText },
      { name: 'Apply for Certificate', href: '/citizen/apply', icon: FileText },
      { name: 'My Applications', href: '/citizen/applications', icon: FileText },
      { name: 'Verify Document', href: '/verify', icon: Shield }
    ],
    officer: [
      { name: 'Dashboard', href: '/officer', icon: FileText },
      { name: 'Pending Reviews', href: '/officer/pending', icon: FileText },
      { name: 'Verified Documents', href: '/officer/verified', icon: Shield },
      { name: 'Verify Document', href: '/verify', icon: Shield }
    ],
    admin: [
      { name: 'Dashboard', href: '/admin', icon: FileText },
      { name: 'All Applications', href: '/admin/applications', icon: FileText },
      { name: 'Officers Management', href: '/admin/officers', icon: User },
      { name: 'System Settings', href: '/admin/settings', icon: Settings },
      { name: 'Verify Document', href: '/verify', icon: Shield }
    ]
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentNav = user ? navigation[user.role] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'en' ? 'E-Gov Portal' : 'ई-गवर्न पोर्टल'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {language === 'en' ? 'Digital India Initiative' : 'डिजिटल इंडिया पहल'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Globe className="h-4 w-4" />
                <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
              </button>

              {user && (
                <>
                  {/* Notifications */}
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-right">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-gray-500 capitalize">{user.role}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                    >
                      <LogOut className="h-6 w-6" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {user && (
          <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 lg:hidden">
                <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
              </div>
            )}

            {/* Sidebar */}
            <div className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
                <span className="text-lg font-semibold">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="mt-8 px-4 space-y-2">
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}