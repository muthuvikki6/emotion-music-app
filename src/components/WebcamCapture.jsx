// src/components/WebcamCapture.jsx
import React, { useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

const WebcamCapture = ({ isCapturing, onVideoRef }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isCapturing) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCapturing]);

  useEffect(() => {
    // Add console log to check video ref
    console.log('Video ref in WebcamCapture:', videoRef.current);
    if (videoRef.current) {
      onVideoRef(videoRef.current);
    }
  }, [videoRef.current, onVideoRef]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Add this to ensure video ref is passed after stream is set
        onVideoRef(videoRef.current);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Unable to access webcam. Please make sure you have granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="relative w-full h-full">
      {isCapturing ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-2xl"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-16 h-16 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;