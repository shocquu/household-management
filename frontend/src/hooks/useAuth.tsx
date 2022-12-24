import { gql, useQuery } from '@apollo/client';
import { createContext, ReactNode, useContext, useMemo } from 'react';

interface User {
    email: string;
    password: string;
    name: string;
    avatar_url: string;
}

interface AuthContextType {
    user?: any;
    loading: boolean;
    error?: any;
}

const CURRENT_USER_QUERY = gql`
    query GetUser {
        whoami {
            id
            name
            email
            avatar_url
        }
    }
`;

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

    const value = useMemo(
        () => ({
            user: data?.whoami,
            loading,
            error,
        }),
        [data, loading, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
