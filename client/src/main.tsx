import React from "react";
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';


import './styles/index.less';

import RootRouter from "./router/RootRouter";
import { AuthProvider } from "./Context/AuthProvider";
import { ThemeProvider } from "./Context/TheamProvider";


const el = document.getElementById('root')
if (el === null) throw new Error('Root <div> missing in index.html')

const root = ReactDOM.createRoot(el)


root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <RootRouter />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
