import { useEffect, useState, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export type Expressions = {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
};

type StressDetectionHook = {
  stressLevel: number;
  expressions: Expressions | null;
  isReady: boolean;
  startDetection: (video: HTMLVideoElement) => void;
  stopDetection: () => void;
  error: string | null;
};

const useStressDetection = (): StressDetectionHook => {
  const [stressLevel, setStressLevel] = useState<number>(0);
  const [expressions, setExpressions] = useState<Expressions | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
  const lastUpdate = useRef<number>(0);

  const calculateStress = useCallback((expr: Expressions): number => {
    const weights = {
      neutral: -0.3,
      happy: -0.5,
      sad: 0.7,
      angry: 0.9,
      fearful: 0.6,
      disgusted: 0.4,
      surprised: 0.2
    };
    
    return Math.min(1, Math.max(0, 
      Object.entries(weights).reduce((sum, [emotion, weight]) => 
        sum + (expr[emotion as keyof Expressions] * weight), 0)
    ));
  }, []);

  const updateState = useCallback((newExpressions: Expressions) => {
    const newStress = calculateStress(newExpressions);
    const now = Date.now();
    
    if (now - lastUpdate.current > 1000 || Math.abs(newStress - stressLevel) > 0.05) {
      setStressLevel(newStress);
      setExpressions(newExpressions);
      lastUpdate.current = now;
    }
  }, [calculateStress, stressLevel]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setIsReady(true);
      } catch (err) {
        setError('Failed to load face detection models');
        console.error('Model loading error:', err);
      }
    };

    loadModels();
    return () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);
    };
  }, []);

const startDetection = useCallback((video: HTMLVideoElement) => {
  if (!isReady || !video) return;

  console.log('Starting face detection...');
  console.log('Video ready state:', video.readyState);
  console.log('Video dimensions:', video.videoWidth, video.videoHeight);

  detectionInterval.current = setInterval(async () => {
    try {
      console.log('Attempting face detection...');
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceExpressions();
      
      console.log('Detections:', detections);
      
      if (detections.length > 0) {
        console.log('Face detected! Expressions:', detections[0].expressions);
        updateState(detections[0].expressions as Expressions);
      } else {
        console.log('No faces detected');
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
  }, 1000);
}, [isReady, updateState]);

  const stopDetection = useCallback(() => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  }, []);

  return { 
    stressLevel, 
    expressions, 
    isReady, 
    startDetection, 
    stopDetection,
    error
  };
};

export default useStressDetection;
