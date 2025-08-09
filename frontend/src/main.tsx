import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthProvider.tsx';
import './index.css'
import App from './App.tsx'
import './i18n';
import "flag-icons/css/flag-icons.min.css";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
)
