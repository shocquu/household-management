import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ThemeProvider from './theme';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { AuthProvider } from './hooks/useAuth';
import { useAppApolloClient } from './services/apolloClient';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const client = useAppApolloClient();

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
