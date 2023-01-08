import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { useState } from 'react';
import { useAccessToken } from '../hooks/useAccessToken';

const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });
const cache = new InMemoryCache({});

const authMiddleware = (aa: string) => {
    const { accessToken } = useAccessToken();

    return new ApolloLink((operation, forward) => {
        if (accessToken)
            operation.setContext({
                headers: {
                    ...operation.getContext().headers,
                    authorization: `Bearer ${accessToken}`,
                },
            });

        return forward(operation);
    });
};

export const useAppApolloClient = () => {
    const { accessToken } = useAccessToken();
    return new ApolloClient({
        link: authMiddleware(accessToken).concat(httpLink),
        cache,
    });
};
