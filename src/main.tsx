import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

function Root() {
  useEffect(() => {
    const existing = document.querySelector('script[data-domain="fileprivacy.aaacoder.xyz"]');
    if (!existing) {
      const script = document.createElement('script');
      script.setAttribute('defer', '');
      script.setAttribute('data-domain', 'fileprivacy.aaacoder.xyz');
      script.src = 'https://plausible.fileprivacy.aaacoder.xyz/js/script.js';
      document.body.appendChild(script);
    }
  }, []);
  return <App />;
}

const container = document.getElementById('root')!;
createRoot(container).render(<Root />);



