import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute'
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                <Route path="*" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
