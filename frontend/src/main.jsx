import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ThemeProvider from './theme';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
