// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { API_BASE } from './API';
import PokemonList from './pages/PokemonList';
import PokemonDetail from './pages/PokemonDetail';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}/health`);
        setApiStatus(response.ok ? 'healthy' : 'unhealthy');
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('unhealthy');
      }
    };
    checkApiHealth();
  }, []);

  if (apiStatus === 'unhealthy') {
    return (
      <div className="app">
        <div className="api-error">
          <h1>🚨 API Connection Error</h1>
          <p>Unable to connect to the Pokemon API backend.</p>
          <p>
            Please ensure the backend server is running on <code>{API_BASE}</code>
          </p>
          <button onClick={() => window.location.reload()}>Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokedex</h1>
        <p>Discover and explore Pokemon using PokeAPI</p>
        {apiStatus === 'healthy' && <span className="api-status healthy">✅ API Connected</span>}
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:pokemonId" element={<PokemonDetail />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Powered by PokeAPI • Enhanced Backend with Caching</p>
      </footer>
    </div>
  );
}

export default App;
