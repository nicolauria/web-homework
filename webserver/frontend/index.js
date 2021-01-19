import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './apollo';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import TransactionViewer from './components/pages/TransactionViewer';
import AddTransaction from './components/pages/AddTransaction';
import EditTransaction from './components/pages/EditTransaction';
import 'bootstrap/dist/css/bootstrap.css';
import UserContext from './context/UserContext';
import axios from 'axios';
import ProtectedRoute from './components/auth/ProtectedRoute';
import 'regenerator-runtime/runtime'

function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    });

    useEffect(() => {
        const checkLoggedIn = async () => {
          let token = localStorage.getItem("auth-token");
          if (token === null) {
            localStorage.setItem("auth-token", "");
            token = "";
          }
          const tokenRes = await axios.post("http://localhost:8000/tokenIsValid", null, {
            headers: {
              "x-auth-token": token
            }
          })
          
          if (tokenRes.data) {
            setUserData({
              token,
              user: tokenRes.data
            })
          }
        }
    
        checkLoggedIn();
    }, []);

    return (
        <div className="container">
            <UserContext.Provider value={{ userData, setUserData }}>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <ProtectedRoute exact path="/transactions" component={TransactionViewer} />
                    <ProtectedRoute path="/addTransaction" component={AddTransaction} />
                    <Route path="/transactions/:id" component={EditTransaction}/>
                </Switch>
            </UserContext.Provider>
        </div>
    )
};

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>, 
    document.getElementById('root')
);