import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

export default function ApplyForCertificate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addDocument, language } = useApp();
  
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'income');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const certificateTypes = {
    income: {
      en: { name: 'Income Certificate', desc: 'Annual income verification certificate' },
      hi: { name: 'आय प्रमाण पत्र', desc: 'वार्षिक आय सत्यापन प्रमाण पत्र' }
    },
    caste: {
      en: { name: 'Caste Certificate', desc: 'Caste verification certificate' },
      hi: { name: 'जाति प्रमाण पत्र', desc: 'जाति सत्यापन प्रमाण पत्र' }
    },
    education: {
      en: { name: 'Education Certificate', desc: 'Educational qualification certificate' },
      hi: { name: 'शिक्षा प्रमाण पत्र', desc: 'शैक्षिक योग्यता प्रमाण पत्र' }
    },
    domicile: {
      en: { name: 'Domicile Certificate', desc: 'Residence proof certificate' },
      hi: { name: 'निवास प्रमाण पत्र', desc: 'निवास प्रमाण प्रमाण पत्र' }
    },
    birth: {
      en: { name: 'Birth Certificate', desc: 'Birth registration certificate' },
      hi: { name: 'जन्म प्रमाण पत्र', desc: 'जन्म पंजीकरण प्रमाण पत्र' }
    },
    death: {
      en: { name: 'Death Certificate', desc: 'Death registration certificate' },
      hi: { name: 'मृत्यु प्रमाण पत्र', desc: 'मृत्यु पंजीकरण प्रमाण पत्र' }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: ${language === 'en' ? 'Invalid file type' : 'अमान्य फ़ाइल प्रकार'}`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`${file.name}: ${language === 'en' ? 'File too large (max 5MB)' : 'फ़ाइल बहुत बड़ी (अधिकतम 5MB)'}`);
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (files.length === 0) {
      toast.error(language === 'en' ? 'Please upload at least one document' : 'कृपया कम से कम एक दस्तावेज़ अपलोड करें');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate file upload
      const uploadedFiles = files.map((file, index) => ({
        id: `file_${Date.now()}_${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date()
      }));

      const newDocument = {
        userId: user.id,
        type: selectedType as any,
        title: formData.title || certificateTypes[selectedType as keyof typeof certificateTypes][language].name,
        description: formData.description,
        status: 'pending' as const,
        documents: uploadedFiles,
        priority: formData.priority
      };

      addDocument(newDocument);
      
      toast.success(language === 'en' ? 'Application submitted successfully!' : 'आवेदन सफलतापूर्वक जमा किया गया!');
      navigate('/citizen/applications');
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to submit application' : 'आवेदन जमा करने में विफल');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCertificate = certificateTypes[selectedType as keyof typeof certificateTypes]?.[language];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center space-x-3 mb-8">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Apply for Certificate' : 'प्रमाण पत्र के लिए आवेदन'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' ? 'Submit your application for government certificate' : 'सरकारी प्रमाण पत्र के लिए अपना आवेदन जमा करें'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Certificate Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {language === 'en' ? 'Certificate Type' : 'प्रमाण पत्र का प्रकार'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(certificateTypes).map(([type, details]) => (
                <label
                  key={type}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="certificateType"
                    value={type}
                    checked={selectedType === type}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{details[language].name}</h3>
                    <p className="text-sm text-gray-600">{details[language].desc}</p>
                  </div>
                  {selectedType === type && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Application Title' : 'आवेदन शीर्षक'}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={currentCertificate?.name}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Description/Purpose' : 'विवरण/उद्देश्य'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder={language === 'en' ? 'Describe the purpose of this certificate...' : 'इस प्रमाण पत्र का उद्देश्य बताएं...'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Priority' : 'प्राथमिकता'}
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">
                  {language === 'en' ? 'Low (15-20 days)' : 'कम (15-20 दिन)'}
                </option>
                <option value="medium">
                  {language === 'en' ? 'Medium (7-10 days)' : 'मध्यम (7-10 दिन)'}
                </option>
                <option value="high">
                  {language === 'en' ? 'High (3-5 days)' : 'उच्च (3-5 दिन)'}
                </option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {language === 'en' ? 'Supporting Documents' : 'सहायक दस्तावेज़'}
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {language === 'en' ? 'Choose Files' : 'फ़ाइलें चुनें'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'PDF, JPG, PNG files (max 5MB each)' : 'PDF, JPG, PNG फ़ाइलें (प्रत्येक अधिकतम 5MB)'}
                  </p>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      {language === 'en' ? 'Remove' : 'हटाएं'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  {language === 'en' ? 'Important Information' : 'महत्वपूर्ण जानकारी'}
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• {language === 'en' ? 'All documents must be clear and readable' : 'सभी दस्तावेज़ स्पष्ट और पढ़ने योग्य होने चाहिए'}</li>
                  <li>• {language === 'en' ? 'Processing time varies based on priority' : 'प्रसंस्करण समय प्राथमिकता के आधार पर भिन्न होता है'}</li>
                  <li>• {language === 'en' ? 'You will receive SMS and email updates' : 'आपको SMS और ईमेल अपडेट मिलेंगे'}</li>
                  <li>• {language === 'en' ? 'Track your application status anytime' : 'किसी भी समय अपने आवेदन की स्थिति ट्रैक करें'}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting || files.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-green-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {language === 'en' ? 'Submitting...' : 'जमा कर रहे हैं...'}
                </div>
              ) : (
                language === 'en' ? 'Submit Application' : 'आवेदन जमा करें'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/citizen')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}