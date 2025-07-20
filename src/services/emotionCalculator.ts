import { Expressions } from '../hooks/useStressDetection';

export type UIStressMode = 'high-stress' | 'medium-stress' | 'normal';

export const getDominantEmotion = (expressions: Expressions | null): keyof Expressions | null => {
  if (!expressions) return null;
  
  let maxScore = 0;
  let dominant: keyof Expressions = 'neutral';
  
  (Object.keys(expressions) as (keyof Expressions)[]).forEach(emotion => {
    if (expressions[emotion] > maxScore) {
      maxScore = expressions[emotion];
      dominant = emotion;
    }
  });
  
  return dominant;
};

export const getUIMode = (stressLevel: number): UIStressMode => {
  if (stressLevel > 0.7) return 'high-stress';
  if (stressLevel > 0.4) return 'medium-stress';
  return 'normal';
};

export const getAdaptiveSuggestions = (
  stressLevel: number, 
  dominantEmotion: keyof Expressions | null
): { message: string; action?: () => void } | null => {
  if (stressLevel > 0.7) {
    return {
      message: 'Высокий уровень стресса! Рекомендую сделать перерыв.',
      action: () => {
        window.location.href = '/relax';
      }
    };
  }
  
  if (dominantEmotion === 'sad' && stressLevel > 0.4) {
    return {
      message: 'Вас что-то расстроило? Может посмотреть что-то вдохновляющее?',
      action: () => {
        window.location.href = '/inspiration';
      }
    };
  }
  
  if (dominantEmotion === 'angry') {
    return {
      message: 'Кажется, вы раздражены. Глубоко вдохните...',
      action: undefined
    };
  }
  
  return null;
};
