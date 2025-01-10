import './App.css';
import Home from './components/Home/Home';
import Services from './components/Services/Services';
import BookNow from './components/Book Now/BookNow';
import Policies from './components/Policies/Policies';
import PrivacyPolicy from './components/Privacy Policy/PrivacyPolicy';
import AdminAuthentication from './components/Admin/AdminAuthentication';
import BypassAuthentication from './components/Bypass/BypassAuthentication';
import RateLimitError from './components/Rate Limit Error/RateLimitError';
import { useRateLimit } from './components/Rate Limit Error/RateLimitContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

// axios.defaults.baseURL = 'https://kbspas.ca';
axios.defaults.baseURL = 'http://localhost:3000';

const routes = [
  { path: "/", element: <Home /> },
  { path: "/services", element: <Services /> },
  { path: "/booknow", element: <BookNow /> },
  { path: "/policies", element: <Policies /> },
  { path: "/privacypolicy", element: <PrivacyPolicy /> },
  { path: "/admin", element: <AdminAuthentication /> },
  { path: "/bypass", element: <BypassAuthentication /> }
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

function App() {
  const {rateLimitError, setRateLimitError} = useRateLimit();
  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.data === "Rate limit exceeded") {
          setRateLimitError(true);
        }
        return Promise.reject(error);
      }
    );  
  }, []);

  return ( 
    <>
      <Router>
        <ScrollToTop/>
        <Routes>
          {routes.map(route => (<Route key={route.path} path={route.path} element={rateLimitError ? <RateLimitError/> : route.element} />))}
        </Routes>
      </Router>
    </>
  );
}

export default App;