import {
    ApolloError,
    ApolloQueryResult,
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

interface AuthContextType {
    user?: User;
    setUser: Dispatch<React.SetStateAction<User>>;
    loading: boolean;
    error: ApolloError;
    logout: () => void;
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<React.SetStateAction<boolean>>;
    refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
}

export const CURRENT_USER_QUERY = gql`
    query GetUser {
        whoami {
            id
            role
            email
            username
            avatarUrl
            displayName
            refreshToken
            settings {
                dateFormat
                timeFormat
            }
        }
    }
`;

const LOGOUT_USER_QUERY = gql`
    query Logout {
        logoutUser {
            refreshToken
        }
    }
`;

const REFRESH_TOKENS_QUERY = gql`
    query RefreshTokens {
        refresh {
            accessToken
            refreshToken
        }
    }
`;

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const { accessToken, setAccessToken, removeAccessToken } = useAccessToken();
    const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
    const client = useAppApolloClient();
    const navigate = useNavigate();

    const { loading, error, refetch } = useQuery(CURRENT_USER_QUERY, {
        skip: !localStorage.getItem('accessToken'),
        notifyOnNetworkStatusChange: true,
        context: {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
        },
        onCompleted: ({ whoami }) => {
            setUser({ ...whoami, avatarUrl: AVATARS_BASE_PATH + whoami?.avatarUrl });
        },
        onError: ({ graphQLErrors }) => {
            if (graphQLErrors) {
                for (let err of graphQLErrors) {
                    switch (err.extensions.code) {
                        case 'UNAUTHENTICATED':
                            refreshTokens();
                            break;
                    }
                }
            }
        },
    });
    const [refreshTokens] = useLazyQuery(REFRESH_TOKENS_QUERY, {
        onCompleted: ({ refresh }) => {
            setAccessToken(refresh.accessToken);
        },
    });
    const [logout] = useLazyQuery(LOGOUT_USER_QUERY, {
        onCompleted: () => {
            setUser(null);
            client.resetStore();
            removeAccessToken();
            setIsLoggedIn(false);
            navigate('/login', { replace: true });
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && user && !loading) setIsLoggedIn(true);
    }, [user, loading]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoggedIn,
                loading,
                error,
                logout,
                refetch,
                setIsLoggedIn,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
