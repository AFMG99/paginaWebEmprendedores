import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, showAllUser } from '../service/Services';
import supabase from '../db/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
                const users = await showAllUser();
                const userProfile = users.find(u => u.email === session.user.email);
                
                if (userProfile) {
                    setUser({
                        ...session.user,
                        name: userProfile.name,
                        role: userProfile.role
                    });
                }
            }
            setLoading(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) checkSession();
            else setUser(null);
        });

        return () => subscription?.unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const authUser = await userLogin(email, password);
            const users = await showAllUser();
            const userProfile = users.find(u => u.email === authUser.email);
            
            if (userProfile) {
                setUser({
                    ...authUser,
                    name: userProfile.name,
                    role: userProfile.role
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}