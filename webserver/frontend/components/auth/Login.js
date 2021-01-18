import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/react-hooks';
// import { gql, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import UserContext from '../../context/UserContext';
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../misc/ErrorNotice';

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const [loginUser, { data }] = useMutation(LOGIN_USER, {
        onCompleted(userData) {
            console.log(userData);
          setUserData({
            token: userData.login.token,
            user: {
                id: userData.login.id,
                email: userData.login.email
            }
          })
          localStorage.setItem("auth-token", userData.login.token);
          history.push("/");
        },
        onError({ graphQLErrors, networkError }) {
            console.log(graphQLErrors[0].message);
            setError(graphQLErrors[0].message);
        }
    });

    const submit = (e) => {
        e.preventDefault();
        loginUser({
            variables: {
                email,
                password
            }
        });
    }

    return (
        <div style={{ marginTop: '100px' }}>
            <h1>Log In</h1>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" onChange={ e => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder="Enter email" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" onChange={ e => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    )
}

const LOGIN_USER = gql`
  mutation login(
    $email: String!
    $password: String!
  ) {
    login(
        email: $email
        password: $password
    ) {
      id
      email
      token
    }
  }
`;