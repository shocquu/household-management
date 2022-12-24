import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ThemeProvider from './theme';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { AuthProvider } from './hooks/useAuth';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql/',
    credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <AuthProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </AuthProvider>
        </ApolloProvider>
    </React.StrictMode>
);
