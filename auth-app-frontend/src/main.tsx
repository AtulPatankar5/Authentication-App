import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from './pages/RootLayout';
import About from './pages/About';
import Services from './pages/Services';
import Signup from './pages/Signup';
import Signin from './pages/Signin';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Services />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Route>

    </Routes>
  </BrowserRouter>,
)
