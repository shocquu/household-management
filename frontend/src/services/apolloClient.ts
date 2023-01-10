import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { useState } from 'react';
import { useAccessToken } from '../hooks/useAccessToken';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });
const cache = new InMemoryCache({});

const headerLink = setContext((_request, previousContext) => ({
    headers: {
        ...previousContext.headers,
        authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
}));

const authMiddleware = () => {
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
    return new ApolloClient({
        link: headerLink.concat(httpLink),
        cache,
    });
};
