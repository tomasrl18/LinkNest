import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

import type { ReactNode } from 'react';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    return user ? children : <Routes><Route path="/login" /></Routes>;
};
