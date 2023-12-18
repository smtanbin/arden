import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';

import 'rsuite/dist/rsuite.min.css';
import './styles/index.less';

import RootRouter from "./router/RootRouter";
import { AuthProvider } from "./Context/AuthProvider";


const el = document.getElementById('root')
if (el === null) throw new Error('Root container missing in index.html')

const root = ReactDOM.createRoot(el)

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <RootRouter />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
