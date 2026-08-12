import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import About from '../src/pages/about';
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './pages/login';
import Service from './pages/services';
import Signup from './pages/signup';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/service" element={<Service />} />
      <Route path="/signup" element={<Signup />} />

    </Routes>
  </BrowserRouter>,
)
