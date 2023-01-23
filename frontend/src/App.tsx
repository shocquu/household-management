import Routes from './routes';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './theme';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './hooks/useAuth';
import { useAppApolloClient } from './@apollo/apolloClient';
import { AlertProvider } from './hooks/useAlert';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Alert from './components/alert/Alert';
import en from './translations/locales/en.json';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: {
        en: {
            common: en,
        },
        // de: {
        //     common: common_de,
        // },
    },
});

export default function App() {
    const client = useAppApolloClient();

    return (
        <ApolloProvider client={client}>
            <Router>
                <HelmetProvider context={{}}>
                    {/* <I18nextProvider i18n={i18next}> */}
                    <AuthProvider>
                        <ThemeProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <AlertProvider>
                                    <Routes />
                                    <Alert />
                                </AlertProvider>
                            </LocalizationProvider>
                        </ThemeProvider>
                    </AuthProvider>
                    {/* </I18nextProvider> */}
                </HelmetProvider>
            </Router>
        </ApolloProvider>
    );
}
