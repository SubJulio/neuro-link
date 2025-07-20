import React from 'react';
import { UIStressMode } from '../../services/emotionCalculator';

type SimplifiedNavProps = {
  mode: UIStressMode;
  onNavigate: (path: string) => void;
};

const SimplifiedNav: React.FC<SimplifiedNavProps> = ({ mode, onNavigate }) => {
  // В режиме high-stress показываем только самые важные элементы
  const isSimplified = mode === 'high-stress';

  return (
    <nav className={`simplified-nav ${isSimplified ? 'simplified' : 'normal'}`}>
      <div className="nav-logo" onClick={() => onNavigate('/')}>
        NeuroApp
      </div>
      
      {!isSimplified ? (
        <ul className="nav-links">
          <li><button onClick={() => onNavigate('/dashboard')}>Дашборд</button></li>
          <li><button onClick={() => onNavigate('/analytics')}>Аналитика</button></li>
          <li><button onClick={() => onNavigate('/settings')}>Настройки</button></li>
        </ul>
      ) : (
        <div className="critical-actions">
          <button className="nav-button" onClick={() => onNavigate('/')}>
            Главное
          </button>
          <button className="nav-button" onClick={() => onNavigate('/help')}>
            Помощь
          </button>
          <button 
            className="nav-button emergency"
            onClick={() => {
              onNavigate('/emergency');
              if (navigator.vibrate)   navigator.vibrate([200, 100, 200, 100, 200]);
            }}
          >
            SOS
          </button>
        </div>
      )}
      
      <div className="nav-status">
        {mode === 'high-stress' && (
          <span className="stress-badge">Стресс-режим</span>
        )}
        <button className="nav-icon" onClick={() => onNavigate('/profile')}>
          👤
        </button>
      </div>
    </nav>
  );
};

export default SimplifiedNav;
