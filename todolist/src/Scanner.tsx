import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner: React.FC = () => {
  const [qrResult, setQrResult] = useState<string>('No result');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [cameras, setCameras] = useState<{ label: string; deviceId: string }[]>([]);
  const startScan = async () => {
    try {
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      const videoElement = videoRef.current;
      if (videoElement) {
        // Get the list of available video devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
       
        // Select the appropriate camera based on facingMode
        let selectedDeviceId = videoDevices[0]?.deviceId; // Default to the first camera
        if (videoDevices.length > 1) {
          selectedDeviceId = videoDevices.find(device =>
            facingMode === 'user' ? device.label.toLowerCase().includes('front') :
                                    device.label.toLowerCase().includes('back')
          )?.deviceId || selectedDeviceId;
        }

        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoElement,
          (result, error) => {
            if (result) {
              setQrResult(result.getText());
              console.log(result.getText());
            }
          }
        );
      }
    } catch (error) {
      console.error('Error starting scanner:', error);
    }
  };

  useEffect(() => {
    startScan();

    return () => {
      codeReader.current?.reset();
    };
  }, [facingMode]); // Re-run when facingMode changes
  
  useEffect(() => {
    const getCameras = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({ label: device.label || `Camera ${cameras.length + 1}`, deviceId: device.deviceId }));

      setCameras(videoDevices);
    };

    getCameras();
  }, []);

  const flipCamera = () => {
    setFacingMode(prev => {
      const newFacingMode = prev === 'user' ? 'environment' : 'user';
      console.log(`Switching camera from ${prev} to ${newFacingMode}`);
      return newFacingMode;
    });
  };
  

  return (
    <div>
      <button onClick={flipCamera}>{facingMode === 'user' ?'Front':'Back'} Flip Camera</button>
      <h2>QR Code Scanner</h2>
      <div style={{width:'400px', height:'400px', textAlign:'center'}}>
      <video ref={videoRef} style={{ width: '100%' }} />
     
      <div>
      <h2>Available Cameras</h2>
      <ul>
        {cameras.map((camera, index) => (
          <li key={camera.deviceId}>{index + 1}. {camera.label}</li>
        ))}
      </ul>
    </div>
    </div> <p>Scan result: {qrResult}</p>
    
    </div>
  );
};

export default QRScanner;