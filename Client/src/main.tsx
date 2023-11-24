import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import App from "./App";


const theme = {
  colors: {
    primary: '#008837',
  },
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>

      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
