import { BrowserRouter, Routes, Route } from 'react-router-dom';
/* import { PrivateRoute } from '@/components/PrivateRoute';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage'; */
import { LoginPage } from './pages/LoginPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* <Route
                    path="/"
                    element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                    }
                /> */}
            </Routes>
        </BrowserRouter>
  );
}

export default App
