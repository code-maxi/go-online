import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoGame } from './gui/game/GoGame';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <GoGame />
  </React.StrictMode>
)