import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
