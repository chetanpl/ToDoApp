import React, { useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner: React.FC = () => {
  const [qrResult, setQrResult] = useState<string>('No result');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [currentCameraIndex, setCurrentCameraIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [cameras, setCameras] = useState<{ label: string; deviceId: string }[]>([]);

  const startScan = async (cameraIndex: number) => {
    try {
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      const videoElement = videoRef.current;
      if (videoElement && cameras.length > 0) {
        const selectedDeviceId = cameras[cameraIndex]?.deviceId;

        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoElement,
          (result,error) => {
            if (result) {
              setQrResult(result.getText());
              console.log(result.getText());
              stopScan(); // Automatically stop camera after successful scan
            }
            if(error){
              
            }
          }
        );
         setIsCameraActive(true); // Activate the camera
      }
    } catch (error) {
      console.error('Error starting scanner:', error);
    }
  };

  const stopScan = () => {
    codeReader.current?.reset();
     setIsCameraActive(false); // Deactivate the camera
  };

  const flipCamera = async () => {
    const nextCameraIndex = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextCameraIndex);
    console.log(`Switched to camera index: ${nextCameraIndex}`);
     if (isCameraActive) {
      await startScan(nextCameraIndex); // Automatically start scanning with the new camera
     }
  };

  const getCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    // const videoDevices = devices
    //   .filter(device => device.kind === 'videoinput')
    //   .map((device, index) => ({
    //     label: device.label || `Camera ${index + 1}`,
    //     deviceId: device.deviceId,
    //   }));
  
    // // Filter out duplicates by ensuring unique deviceId and label
    // const uniqueDevices = Array.from(
    //   new Map(videoDevices.map(device => [`${device.deviceId}-${device.label}`, device])).values()
    // );
    // const videoDevices = devices
    // .filter(device => device.kind === 'videoinput')
    // .map(device => ({
    //   label: device.label || "Unknown Camera",
    //   deviceId: device.deviceId
    // }));
    const videoDevices = await Promise.all(
      devices.filter(device => device.kind === 'videoinput')
        .map(async device => {
          try {
            // Try accessing the camera to check if it works
            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
            stream.getTracks().forEach(track => track.stop()); // Close the stream after testing
            return { label: device.label || "Unknown Camera", deviceId: device.deviceId };
          } catch (error) {
            console.warn(`Skipping non-functional camera: ${device.label} (ID: ${device.deviceId})`);
            return null; // Ignore cameras that fail to open
          }
        })
    );

    setCameras(videoDevices.filter((device): device is { label: string; deviceId: string } => !!device));

  };

  React.useEffect(() => {
    getCameras();
  }, []);

  return (
    <div>
      <button onClick={() => startScan(currentCameraIndex)} >
        Activate Camera
      </button>
      <button onClick={stopScan} >
        Stop Camera
      </button>
      <button onClick={flipCamera}>
        Switch Camera
      </button>
      <h2>QR Code Scanner</h2>
      <div style={{ width: '200px', height: 'auto', textAlign: 'center' }}>
        <video ref={videoRef} style={{ width: '100%' }} />
        <div>
          <h2>Available Cameras</h2>
          <ul>
            {cameras.map((camera, index) => (
              <li key={camera.deviceId}>
                {camera.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p>Scan result: {qrResult}</p>
      <p>Currently selected camera: {cameras[currentCameraIndex]?.label} (ID: {cameras[currentCameraIndex]?.deviceId})</p>
      <p>Camera: {JSON.stringify(cameras)}</p>

    </div>
  );
};

export default QRScanner;