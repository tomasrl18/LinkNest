import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { HomePage } from './pages/HomePage';
import { Header } from './components/Header';
import { ListLinkPage } from './pages/Links/ListLinkPage';
import { CreateLinkPage } from './pages/Links/CreateLinkPage';
import EditLinkPage from './pages/Links/EditLinkPage';
import ListCategoryPage from './pages/Categories/ListCategoryPage';
import { UsagePage } from './pages/UsagePage';
import { AnimatePresence } from "framer-motion";
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { Footer } from './components/Footer.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { OfflinePage } from './pages/OfflinePage.tsx';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/offline" element={<OfflinePage />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/links" element={<ListLinkPage />} />
                    <Route path="/links/new" element={<CreateLinkPage />} />
                    <Route path="/links/:id/edit" element={<EditLinkPage />} />
                    <Route path="/categories" element={<ListCategoryPage />} />
                    <Route path="/usage" element={<UsagePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header />
                <Toaster position="top-right" />
                <div className="flex-1 flex flex-col">
                    <AnimatedRoutes />
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
