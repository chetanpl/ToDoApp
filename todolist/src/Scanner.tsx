import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner: React.FC = () => {
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: 'user' as string | {exact:string}
  });
  const [scannerResult, setscannerResult] = useState();


 
  const qrCodeResult = (result: any, error: any) => {
    if (result) {
      setscannerResult(result?.text || 'No result');
    }
    
    if (error) {
    }
  };

  const updateFacingMode = () => {
    setVideoConstraints(prev => {
      const newFacingMode = prev.facingMode === 'user'?{exact:'environment'} : 'user';
      return {
        ...prev,
        facingMode: newFacingMode
      };
    });
  };

  const contrants: MediaTrackConstraints = {
    facingMode: videoConstraints.facingMode as ConstrainDOMString,
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <button 
        onClick={updateFacingMode}
        style={{ marginBottom: '1rem' }}
      >
        Switch Camera ({videoConstraints.facingMode === 'user' ? 'Front' : 'Back'})
      </button>
      
      <div style={{
        position: 'relative',
        width: '100%',
        height: '300px', // Adjust the height of the video view
        overflow: 'hidden',
        borderRadius: '8px',
      }}>
        {JSON.stringify(contrants)}
          <QrReader
            onResult={qrCodeResult}
            constraints={contrants}
          />
      </div>
      
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>{scannerResult  }</p>
    </div>
  );
};

export default QRCodeScanner;
