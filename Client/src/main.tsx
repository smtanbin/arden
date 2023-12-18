import React from "react";
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "react-bootstrap";
import { BrowserRouter as Router } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import RootRouter from "./router/RootRouter";
import { AuthProvider } from "./Context/AuthProvider";

const theme = {
  colors: {
    primary: '#008837',
  },
};

const el = document.getElementById('root')
if (el === null) throw new Error('Root container missing in index.html')

const root = ReactDOM.createRoot(el)

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>

        <ThemeProvider theme={theme}>
          <RootRouter />
        </ThemeProvider>

      </AuthProvider>
    </Router>
  </React.StrictMode>
);
