import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';
import Dashboard from './app/dashboard/page';
import ExcelShowcasePage from './app/excel/page';
import './app/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('GitHub Pages root element is missing');

const route = () => {
  const path = window.location.pathname;
  if (path.includes('/dashboard') || window.location.hash === '#/dashboard') return 'dashboard';
  if (path.includes('/excel') || window.location.hash === '#/excel') return 'excel';
  return 'home';
};

const appRoot = createRoot(root);
const render = () => {
  const current = route();
  appRoot.render(<StrictMode>{current === 'dashboard' ? <Dashboard /> : current === 'excel' ? <ExcelShowcasePage /> : <Home />}</StrictMode>);
};

render();
window.addEventListener('hashchange', render);
window.addEventListener('popstate', render);
