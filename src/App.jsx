import React, { useState, useEffect } from 'react';
import defaultPoints from './data/puntos.json';
import PublicView from './components/PublicView';
import GeneratorView from './components/GeneratorView';

const STORAGE_KEY = 'ruta_dulces_custom_puntos_v1';

export default function App() {
  // Current view: 'public' or 'generator'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/generador' || hash === '#generador' || hash === '#panel' || hash === '#/panel') {
        return 'generator';
      }
    }
    return 'public';
  });

  // Points list: initialized from localStorage if available, otherwise default JSON
  const [points, setPoints] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading points from localStorage, using defaults', e);
    }
    return defaultPoints;
  });

  // Synchronize hash in URL with view
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/generador' || hash === '#generador' || hash === '#panel' || hash === '#/panel') {
        setCurrentView('generator');
      } else {
        setCurrentView('public');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigate to Generator
  const handleNavigateToGenerator = () => {
    window.location.hash = '#/generador';
    setCurrentView('generator');
  };

  // Navigate back to Public Map
  const handleBackToPublic = () => {
    window.location.hash = '#/';
    setCurrentView('public');
  };

  // Save updated points into state and localStorage
  const handleSavePoints = (updatedPoints) => {
    setPoints(updatedPoints);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPoints));
    } catch (e) {
      console.error('Failed to save points to localStorage', e);
    }
  };

  // Reset to default JSON points
  const handleResetPoints = () => {
    setPoints(defaultPoints);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPoints));
    } catch (e) {
      console.error('Failed to reset points in localStorage', e);
    }
  };

  return (
    <div className="w-full h-screen bg-[#07080b] text-white">
      {currentView === 'generator' ? (
        <GeneratorView
          points={points}
          onSavePoints={handleSavePoints}
          onResetPoints={handleResetPoints}
          onBackToMap={handleBackToPublic}
        />
      ) : (
        <PublicView
          points={points}
          onNavigateToGenerator={handleNavigateToGenerator}
        />
      )}
    </div>
  );
}
