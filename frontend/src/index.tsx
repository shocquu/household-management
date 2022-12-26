import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

const helmetContext = {};

const app = (
    <HelmetProvider context={helmetContext}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </HelmetProvider>
);

ReactDOM.hydrate(app, document.getElementById('app'));
