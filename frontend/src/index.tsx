import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

const helmetContext = {};

const app = (
    <HelmetProvider context={helmetContext}>
        <App />
    </HelmetProvider>
);

ReactDOM.hydrate(app, document.getElementById('app'));
