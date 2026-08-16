import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from './pages/RootLayout';
import About from './pages/About';
import Services from './pages/Services';
import Signin from './pages/Signin';
import UserDashboard from './pages/Users/UserDashboard';
import Signup from './pages/signup';
import UserLayout from './pages/Users/UserLayout';
import UserProfile from './pages/Users/UserProfile';
import UsersList from './pages/Users/UsersList';
import OAuthSuccess from './pages/OAuthSuccess';
import OAuthFailure from './pages/OAuthFailure';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<App />} />
        <Route path="about" element={<About />} />
        <Route path="service" element={<Services />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
      </Route>
      <Route path="/user" element={<UserLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="all-users" element={<UsersList />} />
      </Route>
      <Route path="oauth/success" element={<OAuthSuccess />} />
      <Route path="oauth/failure" element={<OAuthFailure />} />
    </Routes>
  </BrowserRouter>,
)
