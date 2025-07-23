import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children, app }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const hasRole = (roles) => {
        return user?.claims?.roles?.some(role => roles.includes(role));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const tokenResult = await user.getIdTokenResult();
                user.claims = tokenResult.claims;
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [auth]);
    
    const value = {
        user,
        db,
        loading,
        login,
        logout,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};