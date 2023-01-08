import {
    ApolloError,
    gql,
    LazyQueryExecFunction,
    OperationVariables,
    useLazyQuery,
    useMutation,
    useQuery,
} from '@apollo/client';
import { replace } from 'lodash';
import { createContext, Dispatch, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AVATARS_BASE_PATH } from '../constants';
import { useAppApolloClient } from '../services/apolloClient';
import { User } from '../types';
import { useAccessToken } from './useAccessToken';
import { useUserQuery } from './useUserQuery';

interface AuthContextType {
    user?: User;
    setUser: Dispatch<React.SetStateAction<User>>;
    loading: boolean;
    error: ApolloError;
    logout: () => void;
}

export const CURRENT_USER_QUERY = gql`
    query GetUser {
        whoami {
            id
            role
            email
            username
            displayName
            avatarUrl
        }
    }
`;

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const { accessToken, removeAccessToken } = useAccessToken();
    const client = useAppApolloClient();
    const navigate = useNavigate();

    const [getUser, { loading, error }] = useLazyQuery(CURRENT_USER_QUERY, {
        onCompleted: ({ whoami }) => {
            setUser({ ...whoami, avatarUrl: AVATARS_BASE_PATH + whoami?.avatarUrl });
        },
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors) {
                for (let err of graphQLErrors) {
                    switch (err.extensions.code) {
                        case 'UNAUTHENTICATED':
                            logout();
                            break;
                    }
                }
            }
        },
    });

    const logout = () => {
        client.resetStore();
        removeAccessToken();
        setUser(null);
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        getUser();
    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                error,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
