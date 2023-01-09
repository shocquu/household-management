import Routes from './routes';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './theme';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './hooks/useAuth';
import { useAppApolloClient } from './services/apolloClient';
import { AlertProvider } from './hooks/useAlert';
import Alert from './components/alert/Alert';

export default function App() {
    const client = useAppApolloClient();

    return (
        <ApolloProvider client={client}>
            <Router>
                <HelmetProvider context={{}}>
                    <AuthProvider>
                        <ThemeProvider>
                            <AlertProvider>
                                <Routes />
                                <Alert />
                            </AlertProvider>
                        </ThemeProvider>
                    </AuthProvider>
                </HelmetProvider>
            </Router>
        </ApolloProvider>
    );
}
