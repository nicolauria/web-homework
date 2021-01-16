import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import client from './apollo';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import TransactionViewer from './components/pages/TransactionViewer';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
    return (
        <div className="container">
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/register" component={Register} />
                    <Route path="/transactions" component={TransactionViewer} />
                </Switch>
            </BrowserRouter>
        </div>
    )
};

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
);