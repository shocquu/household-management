import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const app = <App />;

ReactDOM.hydrate(app, document.getElementById('app'));
