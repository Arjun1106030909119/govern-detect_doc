import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document, Notification, AnalyticsData } from '../types';

interface AppContextType {
  documents: Document[];
  notifications: Notification[];
  analytics: AnalyticsData;
  addDocument: (doc: Omit<Document, 'id' | 'submittedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    userId: '1',
    type: 'income',
    title: 'Income Certificate Application',
    description: 'Application for annual income certificate',
    status: 'verified',
    submittedAt: new Date('2024-01-15'),
    verifiedAt: new Date('2024-01-20'),
    verifiedBy: 'Officer Smith',
    qrCode: 'QR123456789',
    documents: [],
    priority: 'medium'
  },
  {
    id: '2',
    userId: '1',
    type: 'caste',
    title: 'Caste Certificate Application',
    description: 'Application for caste certificate',
    status: 'under_review',
    submittedAt: new Date('2024-01-20'),
    documents: [],
    priority: 'high'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Document Verified',
    message: 'Your income certificate has been verified and is now available for download.',
    type: 'success',
    read: false,
    createdAt: new Date('2024-01-20')
  }
];

const mockAnalytics: AnalyticsData = {
  totalApplications: 1250,
  verifiedDocuments: 980,
  pendingApplications: 200,
  rejectedApplications: 70,
  monthlyStats: [
    { month: 'Jan', applications: 120, verified: 100 },
    { month: 'Feb', applications: 150, verified: 130 },
    { month: 'Mar', applications: 180, verified: 160 }
  ],
  departmentStats: [
    { department: 'Revenue', count: 450 },
    { department: 'Education', count: 300 },
    { department: 'Social Welfare', count: 250 },
    { department: 'Municipal', count: 250 }
  ]
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [analytics] = useState<AnalyticsData>(mockAnalytics);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const addDocument = (doc: Omit<Document, 'id' | 'submittedAt'>) => {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      submittedAt: new Date()
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  return (
    <AppContext.Provider value={{
      documents,
      notifications,
      analytics,
      addDocument,
      updateDocument,
      deleteDocument,
      addNotification,
      markNotificationRead,
      language,
      setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}