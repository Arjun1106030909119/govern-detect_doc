import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  data: string;
  size?: number;
  className?: string;
}

export default function QRCodeGenerator({ data, size = 200, className = '' }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(data, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [data, size]);

  return (
    <div className={`flex justify-center ${className}`}>
      {qrCodeUrl && (
        <img 
          src={qrCodeUrl} 
          alt="QR Code" 
          className="border border-gray-300 rounded-lg shadow-sm"
        />
      )}
    </div>
  );
}