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
import { createContext, Dispatch, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AVATARS_BASE_PATH } from '../constants';
import { useAppApolloClient } from '../@apollo/apolloClient';
import { useAccessToken } from './useAccessToken';
import useAlert from './useAlert';
import { User } from '../types';

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
    const alert = useAlert();

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
        onError: async ({ graphQLErrors }) => {
            if (graphQLErrors) {
                for (let err of graphQLErrors) {
                    switch (err.extensions.code) {
                        case 'UNAUTHENTICATED':
                            await refreshTokens();
                            refetch();
                            break;
                    }
                }
            }
        },
    });
    const [refreshTokens] = useLazyQuery(REFRESH_TOKENS_QUERY, {
        onCompleted: ({ refresh: { accessToken } }) => {
            setAccessToken(accessToken);
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
        onError: (error) => {
            alert.error(error.message);
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
