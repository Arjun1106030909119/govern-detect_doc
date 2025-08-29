import React, { useState } from 'react';
import { Shield, Search, CheckCircle, XCircle, AlertCircle, Camera } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { format } from 'date-fns';

export default function VerifyDocument() {
  const { documents, language } = useApp();
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    setIsVerifying(true);
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find document by QR code
    const foundDocument = documents.find(doc => doc.qrCode === verificationCode);
    
    if (foundDocument && foundDocument.status === 'verified') {
      setVerificationResult({
        valid: true,
        document: foundDocument,
        verifiedAt: foundDocument.verifiedAt,
        verifiedBy: foundDocument.verifiedBy
      });
    } else {
      setVerificationResult({
        valid: false,
        error: foundDocument ? 'Document not yet verified' : 'Invalid verification code'
      });
    }
    
    setIsVerifying(false);
  };

  const resetVerification = () => {
    setVerificationCode('');
    setVerificationResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Shield className="h-12 w-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Document Verification' : 'दस्तावेज़ सत्यापन'}
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Verify the authenticity of government-issued certificates instantly using QR codes or verification codes'
            : 'QR कोड या सत्यापन कोड का उपयोग करके सरकारी जारी प्रमाण पत्रों की प्रामाणिकता तुरंत सत्यापित करें'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {language === 'en' ? 'Verify Certificate' : 'प्रमाण पत्र सत्यापित करें'}
          </h2>

          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Verification Code' : 'सत्यापन कोड'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder={language === 'en' ? 'Enter QR code or verification ID' : 'QR कोड या सत्यापन ID दर्ज करें'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowScanner(!showScanner)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' 
                  ? 'Try: QR123456789 for demo verification'
                  : 'डेमो सत्यापन के लिए: QR123456789 आज़माएं'
                }
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isVerifying || !verificationCode.trim()}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{language === 'en' ? 'Verifying...' : 'सत्यापित कर रहे हैं...'}</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>{language === 'en' ? 'Verify' : 'सत्यापित करें'}</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={resetVerification}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'en' ? 'Reset' : 'रीसेट'}
              </button>
            </div>
          </form>

          {/* QR Scanner Placeholder */}
          {showScanner && (
            <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'QR Scanner would be integrated here'
                  : 'QR स्कैनर यहाँ एकीकृत होगा'
                }
              </p>
              <p className="text-sm text-gray-500">
                {language === 'en' 
                  ? 'Point camera at QR code to scan'
                  : 'स्कैन करने के लिए कैमरा को QR कोड पर इंगित करें'
                }
              </p>
            </div>
          )}
        </div>

        {/* Verification Result */}
        <div className="space-y-6">
          {verificationResult && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center mb-6">
                {verificationResult.valid ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                    <h3 className="text-xl font-bold text-green-800">
                      {language === 'en' ? 'Document Verified' : 'दस्तावेज़ सत्यापित'}
                    </h3>
                    <p className="text-green-600">
                      {language === 'en' 
                        ? 'This is a genuine government-issued certificate'
                        : 'यह एक वास्तविक सरकारी जारी प्रमाण पत्र है'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <XCircle className="h-16 w-16 text-red-600 mx-auto" />
                    <h3 className="text-xl font-bold text-red-800">
                      {language === 'en' ? 'Verification Failed' : 'सत्यापन असफल'}
                    </h3>
                    <p className="text-red-600">{verificationResult.error}</p>
                  </div>
                )}
              </div>

              {verificationResult.valid && verificationResult.document && (
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    {language === 'en' ? 'Document Details' : 'दस्तावेज़ विवरण'}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">
                        {language === 'en' ? 'Certificate Type:' : 'प्रमाण पत्र का प्रकार:'}
                      </span>
                      <p className="font-medium capitalize">{verificationResult.document.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {language === 'en' ? 'Title:' : 'शीर्षक:'}
                      </span>
                      <p className="font-medium">{verificationResult.document.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {language === 'en' ? 'Verified By:' : 'द्वारा सत्यापित:'}
                      </span>
                      <p className="font-medium">{verificationResult.verifiedBy}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {language === 'en' ? 'Verification Date:' : 'सत्यापन दिनांक:'}
                      </span>
                      <p className="font-medium">
                        {format(verificationResult.verifiedAt, 'PPP')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        {language === 'en' ? 'Verification Code:' : 'सत्यापन कोड:'}
                      </span>
                      <p className="font-mono font-medium text-blue-600">
                        {verificationResult.document.qrCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* How It Works */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{language === 'en' ? 'How Verification Works' : 'सत्यापन कैसे काम करता है'}</span>
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                <p>
                  {language === 'en' 
                    ? 'Each verified certificate gets a unique QR code'
                    : 'प्रत्येक सत्यापित प्रमाण पत्र को एक अद्वितीय QR कोड मिलता है'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                <p>
                  {language === 'en' 
                    ? 'QR codes are tamper-proof and blockchain-secured'
                    : 'QR कोड छेड़छाड़-प्रूफ और ब्लॉकचेन-सुरक्षित हैं'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                <p>
                  {language === 'en' 
                    ? 'Instant verification against government database'
                    : 'सरकारी डेटाबेस के विरुद्ध तत्काल सत्यापन'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Sample QR Code */}
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Sample QR Code' : 'नमूना QR कोड'}
            </h3>
            <QRCodeGenerator data="QR123456789" size={150} className="mb-4" />
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Scan this QR code to test verification'
                : 'सत्यापन का परीक्षण करने के लिए इस QR कोड को स्कैन करें'
              }
            </p>
            <p className="text-xs text-gray-500 mt-2 font-mono">QR123456789</p>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-center">
          {language === 'en' ? 'Security Features' : 'सुरक्षा सुविधाएं'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">
              {language === 'en' ? 'Blockchain Security' : 'ब्लॉकचेन सुरक्षा'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Immutable record storage'
                : 'अपरिवर्तनीय रिकॉर्ड भंडारण'
              }
            </p>
          </div>
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">
              {language === 'en' ? 'Real-time Verification' : 'वास्तविक समय सत्यापन'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Instant authenticity check'
                : 'तत्काल प्रामाणिकता जांच'
              }
            </p>
          </div>
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">
              {language === 'en' ? 'Fraud Prevention' : 'धोखाधड़ी रोकथाम'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'AI-powered fraud detection'
                : 'AI-संचालित धोखाधड़ी का पता लगाना'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}