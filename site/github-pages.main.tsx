import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';
import Dashboard from './app/dashboard/page';
import './app/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('GitHub Pages root element is missing');

const isDashboard = () => window.location.pathname.includes('/dashboard') || window.location.hash === '#/dashboard';
const appRoot = createRoot(root);
const render = () => appRoot.render(<StrictMode>{isDashboard() ? <Dashboard /> : <Home />}</StrictMode>);
render();
window.addEventListener('hashchange', render);
