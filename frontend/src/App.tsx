import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { HomePage } from './pages/HomePage';
import { Header } from './components/Header';
import { ListLinkPage } from './pages/Links/ListLinkPage';
import { CreateLinkPage } from './pages/Links/CreateLinkPage';
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/links" element={<ListLinkPage />} />
                    <Route path="/links/new" element={<CreateLinkPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
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
