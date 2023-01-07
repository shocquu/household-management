import Routes from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/scroll-to-top';
import ThemeProvider from './theme';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { AuthProvider } from './hooks/useAuth';
import { useAppApolloClient } from './services/apolloClient';

export default function App() {
    const client = useAppApolloClient();

    return (
        <ApolloProvider client={client}>
            <Router>
                <AuthProvider>
                    <ThemeProvider>
                        <Routes />
                    </ThemeProvider>
                </AuthProvider>
            </Router>
        </ApolloProvider>
    );
}
