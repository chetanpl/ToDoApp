import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner: React.FC = () => {
  const [data, setData] = useState<string>('No result');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const handleScan = (result: any, error: any) => {
    if (result) {
      setData(result.text || 'No result');
    }
    if (error && error.name !== 'NotFoundException') {
      console.error('QR Scan Error:', error);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Ensure video attributes are set after mounting
  useEffect(() => {
    const interval = setInterval(() => {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.setAttribute('autoplay', 'true');
        videoElement.setAttribute('muted', 'true');
        videoElement.setAttribute('playsinline', 'true');
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <button onClick={toggleFacingMode}>Switch Camera</button>
      <div style={{ width: '100%', height: 'auto' }}>
        <QrReader
          onResult={handleScan}
          constraints={{
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }}
          scanDelay={1000}
        />
      </div>
      <p>{data}</p>
    </div>
  );
};

export default QRCodeScanner;
