import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles';
import { RateLimitProvider } from './components/Rate Limit Error/RateLimitContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RateLimitProvider>
        <App/>
      </RateLimitProvider>
    </ThemeProvider>   
  </React.StrictMode>,
)