import { ApolloError, gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppApolloClient } from '../services/apolloClient';
import { User } from '../types';
import { useAccessToken } from './useAccessToken';
import { useUserQuery } from './useUserQuery';

interface AuthContextType {
    user?: any;
    setUser: any;
    loading: boolean;
    error: any;
    logout: any;
}

const LOGIN_MUTATION = gql`
    mutation SignIn($loginUserInput: LoginUserInput!) {
        loginUser(loginUserInput: $loginUserInput) {
            access_token
        }
    }
`;

const REGISTER_MUTATION = gql`
    mutation SignUp($createUserInput: CreateUserInput!) {
        createUser(createUserInput: $createUserInput) {
            name
            email
            password
            avatar_url
        }
    }
`;

export const CURRENT_USER_QUERY = gql`
    query GetUser {
        whoami {
            id
            name
            role
            email
            avatar_url
        }
    }
`;

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const { accessToken, removeAccessToken } = useAccessToken();
    const client = useAppApolloClient();
    // const navigate = useNavigate();

    const [getUser, { loading, error }] = useLazyQuery(CURRENT_USER_QUERY, {
        onCompleted: ({ whoami }) => {
            setUser(whoami);
        },
    });

    const logout = () => {
        client.resetStore();
        removeAccessToken();
        setUser(null);
        // navigate('/login');
    };

    const value = useMemo(
        () => ({
            user,
            setUser,
            loading,
            error,
            logout,
        }),
        [accessToken, user]
    );

    useEffect(() => {
        if (accessToken) getUser();
        // if (userData.data && accessToken) setUser(userData.data?.whoami);
    }, [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
