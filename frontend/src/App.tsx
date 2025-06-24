import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                <Route path="*" element={<HomePage />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Header />
            <AnimatedRoutes />
        </BrowserRouter>
    );
}

export default App;
