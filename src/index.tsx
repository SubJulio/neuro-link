import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Путь к главному компоненту

// Добавим проверку разрешений камеры
navigator.mediaDevices.getUserMedia({ video: true })
  .catch(err => {
    console.error('Camera access denied:', err);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red;">
          <h2>Требуется доступ к камере</h2>
          <p>Пожалуйста, разрешите доступ к камере для работы приложения</p>
          <p>Ошибка: ${err.message}</p>
        </div>
      `;
    }
  });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Failed to parse source map')) {
    return;
  }
  originalWarn.apply(console, args);
};
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);