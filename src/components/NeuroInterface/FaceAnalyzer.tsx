import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import useStressDetection from '../../hooks/useStressDetection';
import { Expressions } from '../../hooks/useStressDetection';

type FaceAnalyzerProps = {
  onStressUpdate: (level: number, expressions: Expressions | null) => void;
};

const FaceAnalyzer: React.FC<FaceAnalyzerProps> = React.memo(({ onStressUpdate }) => {
  const webcamRef = useRef<Webcam>(null);
  const prevData = useRef<{ level: number; expressions: Expressions | null }>({
    level: 0,
    expressions: null
  });

  const { stressLevel, expressions, isReady, startDetection, stopDetection, error } = useStressDetection();

  useEffect(() => {
    if (isReady && webcamRef.current?.video) {
      startDetection(webcamRef.current.video);
    }
    return () => stopDetection();
  }, [isReady, startDetection, stopDetection]);

  useEffect(() => {
    if (prevData.current.level !== stressLevel || prevData.current.expressions !== expressions) {
      onStressUpdate(stressLevel, expressions);
      prevData.current = { level: stressLevel, expressions };
    }
  }, [stressLevel, expressions, onStressUpdate]);

  return (
    <div className="face-analyzer">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        style={{
          width: '320px',
          height: '240px',
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          border: '2px solid red'
        }}
        disablePictureInPicture
        forceScreenshotSourceSize
        imageSmoothing
        mirrored
        onUserMedia={() => { }}
        onUserMediaError={() => { }}
        screenshotQuality={0}

      />
      {error && <div className="error-banner">{error}</div>}
      <div className="status-indicator">
        <div className="stress-level" style={{ width: `${stressLevel * 100}%` }} />
        <div className="stress-label">
          Stress level: {Math.round(stressLevel * 100)}%
          {expressions && ` (${getDominantEmotion(expressions)})`}
        </div>
      </div>
    </div>
  );
});

const getDominantEmotion = (expressions: Expressions): keyof Expressions => {
  return Object.entries(expressions).reduce(
    (max, [emotion, value]) => value > max[1] ? [emotion, value] : max,
    ['neutral', 0]
  )[0] as keyof Expressions;
};

export default FaceAnalyzer;
