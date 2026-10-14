import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Header from './components/Header/Header.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path="login" element={<Login />}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
