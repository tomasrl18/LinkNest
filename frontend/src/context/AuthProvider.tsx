
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    session: Session | null | undefined;
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null | undefined>(undefined);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => setSession(session)
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    const user = session?.user ?? null;

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        const userId = data.user?.id;
        if (userId) {
            await supabase.from('profiles').insert({ id: userId, email }).catch(() => undefined);
        }

        if (!data.session) {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) throw signInError;
        }
    };


    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = {
        session,
        user,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};
