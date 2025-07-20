import React, { useState, useCallback } from 'react';
import FaceAnalyzer from './FaceAnalyzer';
import AdaptiveUI from './AdaptiveUI';
import '../../styles/neuro-interface.css';
import { Expressions } from '../../hooks/useStressDetection';

export const NeuroInterface: React.FC = () => {
  const [stressData, setStressData] = useState({
    level: 0,
    expressions: null as Expressions | null
  });
  
  const handleStressUpdate = useCallback((level: number, expressions: Expressions | null) => {
    setStressData(prev => {
      if (prev.level === level && prev.expressions === expressions) {
        return prev;
      }
      return { level, expressions };
    });
  }, []);

  return (
    <div className="neuro-interface">
      <header className="neuro-header">
        <h1>NeuroLink Browser</h1>
        <p>Your interface adapts to your emotional state</p>
      </header>
      
      <FaceAnalyzer onStressUpdate={handleStressUpdate} />
      
      <AdaptiveUI 
        stressLevel={stressData.level} 
        expressions={stressData.expressions}
      >
        <main className="content">
          <section className="dashboard">
            <h2>Your Adaptive Dashboard</h2>
            <p>Current mode: {stressData.level > 0.7 ? 'Simplified' : 'Standard'}</p>
            
            {stressData.level < 0.5 && (
              <div className="complex-widget">
                <h3>Detailed Analytics</h3>
                <p>This section hides under high stress</p>
              </div>
            )}
          </section>
        </main>
      </AdaptiveUI>
      
      <footer className="neuro-footer">
        <p>Your data is processed locally and never sent anywhere</p>
        <button className="opt-out">Disable Adaptation</button>
      </footer>
    </div>
  );
};

export default React.memo(NeuroInterface);
