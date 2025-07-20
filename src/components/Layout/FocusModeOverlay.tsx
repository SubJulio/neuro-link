import React, { ReactNode, useEffect, useState } from 'react';

type FocusModeOverlayProps = {
  stressLevel: number;
  children: ReactNode;
  onCalmDown: () => void;
};

const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ 
  stressLevel, 
  children,
  onCalmDown
}) => {
  const [showTechniques, setShowTechniques] = useState(false);
  const [breathCounter, setBreathCounter] = useState(0);
  
  // Анимация дыхания
  useEffect(() => {
    if (stressLevel > 0.7 && !showTechniques) {
      const timer = setTimeout(() => {
        setShowTechniques(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stressLevel, showTechniques]);

  // Таймер для дыхательных упражнений
  useEffect(() => {
    if (showTechniques && breathCounter < 4) {
      const timer = setInterval(() => {
        setBreathCounter(prev => prev + 1);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [showTechniques, breathCounter]);

  // Эффекты для высокого уровня стресса
  const overlayIntensity = stressLevel > 0.8 ? 0.6 : stressLevel > 0.6 ? 0.3 : 0;

  return (
    <div className="focus-mode-overlay">
      {children}
      
      {/* Затемняющий оверлей */}
      <div 
        className="overlay" 
        style={{ opacity: overlayIntensity }}
      />
      
      {/* Упражнения для снижения стресса */}
      {showTechniques && (
        <div className="calm-techniques">
          <h3>Упражнение для успокоения</h3>
          
          <div className="breathing-exercise">
            <div className={`circle ${breathCounter % 2 === 0 ? 'expand' : 'contract'}`}>
              {breathCounter % 2 === 0 ? 'Вдох' : 'Выдох'}
            </div>
            <p>Глубоко дышите: {breathCounter}/4</p>
          </div>
          
          <button 
            className="calm-button"
            onClick={() => {
              onCalmDown();
              setShowTechniques(false);
            }}
          >
            Я успокоился
          </button>
        </div>
      )}
      
      {/* Экстренная помощь при очень высоком стрессе */}
      {stressLevel > 0.85 && (
        <div className="emergency-assist">
          <h3>Экстренная помощь</h3>
          <p>Рекомендуем сделать перерыв</p>
          <button 
            className="emergency-button"
            onClick={() => window.location.href = '/calm-down'}
          >
            Активировать режим покоя
          </button>
        </div>
      )}
    </div>
  );
};

export default FocusModeOverlay;
