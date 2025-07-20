import React, { useState } from 'react';
import { UIStressMode } from '../../services/emotionCalculator';
import { getUIMode, getAdaptiveSuggestions } from '../../services/emotionCalculator';
import SimplifiedNav from '../Layout/SimplifiedNav';
import FocusModeOverlay from '../Layout/FocusModeOverlay';
import { Expressions } from '../../hooks/useStressDetection';

type AdaptiveUIProps = {
  stressLevel: number;
  expressions: Expressions | null;
  children: React.ReactNode;
};

const AdaptiveUI: React.FC<AdaptiveUIProps> = ({ 
  stressLevel, 
  expressions, 
  children 
}) => {
  const [userCalmed, setUserCalmed] = useState(false);
  const uiMode: UIStressMode = getUIMode(stressLevel);
  const dominantEmotion = getDominantEmotion(expressions);
  const suggestion = getAdaptiveSuggestions(stressLevel, dominantEmotion);
  
  // Обработчик навигации
  const handleNavigate = (path: string) => {
    console.log('Navigating to:', path);
    // Здесь будет логика навигации (можно интегрировать react-router)
  };
  
  // Обработчик успокоения пользователя
  const handleCalmDown = () => {
    setUserCalmed(true);
    setTimeout(() => setUserCalmed(false), 30000); // Сброс через 30 секунд
  };

  return (
    <div className={`adaptive-ui ${uiMode}`}>
      {suggestion && !userCalmed && (
        <div className="suggestion-banner">
          {suggestion.message}
          {suggestion.action && (
            <button onClick={suggestion.action}>Принять совет</button>
          )}
        </div>
      )}
      
      <SimplifiedNav 
        mode={uiMode} 
        onNavigate={handleNavigate} 
      />
      
      <div className="content-wrapper">
        {uiMode === 'high-stress' ? (
          <FocusModeOverlay 
            stressLevel={stressLevel}
            onCalmDown={handleCalmDown}
          >
            {children}
          </FocusModeOverlay>
        ) : (
          children
        )}
      </div>
      
      {uiMode === 'high-stress' && (
        <div className="stress-tips">
          <h3>Советы для снижения стресса:</h3>
          <ul>
            <li>Сделайте 5 глубоких вдохов</li>
            <li>Встаньте и потянитесь</li>
            <li>Посмотрите в окно на удалённые объекты</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Временная реализация для TypeScript
const getDominantEmotion = (expressions: Expressions | null): keyof Expressions | null => {
  if (!expressions) return null;
  return Object.entries(expressions).reduce(
    (max, [emotion, value]) => value > max[1] ? [emotion, value] : max,
    ['neutral', 0]
  )[0] as keyof Expressions;
};

export default AdaptiveUI;