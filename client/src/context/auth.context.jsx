import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

 

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                setUser,
                setLoading,
                setError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
