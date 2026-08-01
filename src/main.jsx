import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import { AuthProvider } from './lib/AuthContext.jsx';
import { GareProvider } from './lib/GareContext.jsx';
import { queryClientInstance } from './lib/query-client.js';
import 'leaflet/dist/leaflet.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClientInstance}>
        <AuthProvider>
          <GareProvider>
            <App />
          </GareProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
