import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Ask from './pages/Ask';
import FormAutofill from './pages/FormAutofill';
import MyCases from './pages/MyCases';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
    const { t } = useTranslation();

    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/ask" element={<Ask />} />
                        <Route path="/autofill" element={<FormAutofill />} />
                        <Route path="/cases" element={<MyCases />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
