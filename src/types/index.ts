export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'officer' | 'admin';
  profileImage?: string;
  aadhaarNumber?: string;
  department?: string;
}

export interface Document {
  id: string;
  userId: string;
  type: 'income' | 'caste' | 'education' | 'domicile' | 'birth' | 'death';
  title: string;
  description: string;
  status: 'pending' | 'under_review' | 'verified' | 'rejected';
  submittedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  qrCode?: string;
  documents: FileUpload[];
  comments?: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface AnalyticsData {
  totalApplications: number;
  verifiedDocuments: number;
  pendingApplications: number;
  rejectedApplications: number;
  monthlyStats: Array<{
    month: string;
    applications: number;
    verified: number;
  }>;
  departmentStats: Array<{
    department: string;
    count: number;
  }>;
}