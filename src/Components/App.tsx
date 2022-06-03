import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
// pages
import AboutPage from './AboutPage/AboutPage';
import ArchitecturePage from './AboutPage/ArchitecturePage';
import DisclaimerPage from './DisclaimerPage/DisclaimerPage';
import HomePage from './HomePage/HomePage';
import MainPage from './MainPage/MainPage';
import NonVendorPage from './NonVendorPage/NonVendorPage';
import NoticePage from './NoticePage/NoticePage';
import SupportPage from './SupportPage/SupportPage';
// providers
import { AlertProvider } from '../Contexts/AlertContext';
import { UserProvider } from '../Contexts/UserContext';
// models
// miscellaneous
import AlertPopup from '../Widgets/AlertPopup/AlertPopup';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Spinner from '../Widgets/Spinner/Spinner';
// CSS
import './App.css';

export default function App() {
  const { isLoading, error } = useAuth0();
  if (isLoading) {
    return (
      <div className="loading">
        <Spinner />
        <span>Loading...</span>
      </div>
    );
  }
  if (error) {
    return <div className="errorpage">Oops ... {error.message}</div>;
  }
  return (
    <AlertProvider>
      <UserProvider>
        <Router>
          <header>
            <Header />
          </header>
          <main>
            <div className="page">
              <Routes>
                <Route path="" element={<HomePage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/About" element={<AboutPage />} />
                <Route path="/Architecture" element={<ArchitecturePage />} />
                <Route path="/Disclaimer" element={<DisclaimerPage />} />
                <Route path="/Home" element={<HomePage />} />
                <Route
                  path="/Main"
                  element={
                    <>
                      <AlertPopup />
                      <MainPage itemsPerPage={5} />
                    </>
                  }
                />
                <Route path="/NonVendor" element={<NonVendorPage />} />
                <Route
                  path="/Notices"
                  element={
                    <>
                      <AlertPopup />
                      <NoticePage />
                    </>
                  }
                />
                <Route path="/Support" element={<SupportPage />} />
              </Routes>
            </div>
          </main>
          <footer>
            <Footer />
          </footer>
        </Router>
      </UserProvider>
    </AlertProvider>
  );
}
