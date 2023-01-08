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
    isLoggedIn: boolean;
    // refetch: any;
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
        }
    }
`;

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const { accessToken, removeAccessToken } = useAccessToken();
    const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
    const client = useAppApolloClient();
    const navigate = useNavigate();

    const { data, called, loading, error, refetch } = useQuery(CURRENT_USER_QUERY, {
        skip: !!user,
        fetchPolicy: 'network-only',
        context: {
            headers: {
                authorization: 'Bearer ' + accessToken,
            },
        },
        onCompleted: ({ whoami }) => {
            setUser({ ...whoami, avatarUrl: AVATARS_BASE_PATH + whoami?.avatarUrl });
        },
    });
    // const [getUser, { called, loading, error }] = useLazyQuery(CURRENT_USER_QUERY, {
    //     context: {
    //         headers: {
    //             authorization: 'Bearer ' + accessToken,
    //         },
    //     },
    //     onCompleted: ({ whoami }) => {
    //         setUser({ ...whoami, avatarUrl: AVATARS_BASE_PATH + whoami?.avatarUrl });
    //     },
    //     onError: ({ graphQLErrors }) => {
    //         if (graphQLErrors) {
    //             for (let err of graphQLErrors) {
    //                 switch (err.extensions.code) {
    //                     case 'UNAUTHENTICATED':
    //                         // logout();
    //                         setUser(null);
    //                         // removeAccessToken();
    //                         // navigate('/login', { replace: true });
    //                         break;
    //                 }
    //             }
    //         }
    //     },
    // });

    const logout = () => {
        client.resetStore();
        removeAccessToken();
        setUser(null);
        setIsLoggedIn(false);
        navigate('/login', { replace: true });
    };

    useEffect(() => {
        // console.log(user);
        // console.log(accessToken, user);
        if (accessToken && user && !loading) setIsLoggedIn(true);
        // setIsLoggedIn(Boolean(accessToken) && Boolean(user) && !loading);
    }, [accessToken, user]);

    useEffect(() => {
        // if(!user && isLoggedIn) refetch();
        // console.log(user, isLoggedIn);
    }, [user, isLoggedIn]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoggedIn,
                loading,
                error,
                logout,
                // refetch: getUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
