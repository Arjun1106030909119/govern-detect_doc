import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { documents, language } = useApp();

  const userDocuments = documents.filter(doc => doc.userId === user?.id);
  
  const stats = {
    total: userDocuments.length,
    pending: userDocuments.filter(doc => doc.status === 'pending').length,
    verified: userDocuments.filter(doc => doc.status === 'verified').length,
    rejected: userDocuments.filter(doc => doc.status === 'rejected').length
  };

  const quickActions = [
    {
      title: language === 'en' ? 'Apply for Income Certificate' : 'आय प्रमाण पत्र के लिए आवेदन',
      description: language === 'en' ? 'Get your annual income certificate' : 'अपना वार्षिक आय प्रमाण पत्र प्राप्त करें',
      href: '/citizen/apply?type=income',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: language === 'en' ? 'Apply for Caste Certificate' : 'जाति प्रमाण पत्र के लिए आवेदन',
      description: language === 'en' ? 'Get your caste certificate' : 'अपना जाति प्रमाण पत्र प्राप्त करें',
      href: '/citizen/apply?type=caste',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: language === 'en' ? 'Apply for Education Certificate' : 'शिक्षा प्रमाण पत्र के लिए आवेदन',
      description: language === 'en' ? 'Get your education certificate' : 'अपना शिक्षा प्रमाण पत्र प्राप्त करें',
      href: '/citizen/apply?type=education',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: language === 'en' ? 'Apply for Domicile Certificate' : 'निवास प्रमाण पत्र के लिए आवेदन',
      description: language === 'en' ? 'Get your domicile certificate' : 'अपना निवास प्रमाण पत्र प्राप्त करें',
      href: '/citizen/apply?type=domicile',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {language === 'en' 
                ? `Welcome, ${user?.name}!` 
                : `स्वागत है, ${user?.name}!`
              }
            </h1>
            <p className="text-blue-100">
              {language === 'en' 
                ? 'Manage your government document applications' 
                : 'अपने सरकारी दस्तावेज़ आवेदनों का प्रबंधन करें'
              }
            </p>
          </div>
          <Shield className="h-16 w-16 text-blue-200" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {language === 'en' ? 'Total Applications' : 'कुल आवेदन'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {language === 'en' ? 'Pending' : 'लंबित'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {language === 'en' ? 'Verified' : 'सत्यापित'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {language === 'en' ? 'Rejected' : 'अस्वीकृत'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {language === 'en' ? 'Quick Actions' : 'त्वरित क्रियाएं'}
          </h2>
          <Link
            to="/citizen/apply"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>{language === 'en' ? 'New Application' : 'नया आवेदन'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {language === 'en' ? 'Recent Applications' : 'हाल के आवेदन'}
          </h2>
          <Link
            to="/citizen/applications"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {language === 'en' ? 'View All' : 'सभी देखें'}
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {userDocuments.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'en' ? 'No Applications Yet' : 'अभी तक कोई आवेदन नहीं'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' 
                  ? 'Start by applying for your first certificate' 
                  : 'अपने पहले प्रमाण पत्र के लिए आवेदन करके शुरू करें'
                }
              </p>
              <Link
                to="/citizen/apply"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>{language === 'en' ? 'Apply Now' : 'अभी आवेदन करें'}</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userDocuments.slice(0, 3).map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'en' ? 'Submitted on' : 'पर जमा किया गया'} {format(doc.submittedAt, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                        doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        doc.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status === 'verified' ? (language === 'en' ? 'Verified' : 'सत्यापित') :
                         doc.status === 'pending' ? (language === 'en' ? 'Pending' : 'लंबित') :
                         doc.status === 'under_review' ? (language === 'en' ? 'Under Review' : 'समीक्षाधीन') :
                         (language === 'en' ? 'Rejected' : 'अस्वीकृत')
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}