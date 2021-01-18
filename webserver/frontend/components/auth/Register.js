import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/react-hooks';
// import { gql, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import UserContext from '../../context/UserContext';
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../misc/ErrorNotice';

export default function Register(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const [addUser, { data }] = useMutation(REGISTER_USER, {
        onCompleted(userData) {
        //   console.log(userData.addUser);
          setUserData({
            token: userData.addUser.token,
            user: {
                id: userData.addUser.id,
                email: userData.addUser.email
            }
          })
          localStorage.setItem("auth-token", userData.addUser.token);
          history.push("/");
        },
        onError({ graphQLErrors, networkError }) {
            console.log(graphQLErrors[0].message);
            setError(graphQLErrors[0].message);
        }
    });

    const submit = (e) => {
        e.preventDefault();
        addUser({
            variables: {
                email,
                password,
                confirm
            }
        });
    }

    return (
        <div style={{ marginTop: '100px' }}>
            <h1>Register</h1>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" onChange={ e => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder="Enter email" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" onChange={ e => setPassword(e.target.value)} placeholder="Password" />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" className="form-control" onChange={ e => setConfirm(e.target.value)} placeholder="Password" />
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    )
}

const REGISTER_USER = gql`
  mutation addUser(
    $email: String!
    $password: String!
    $confirm: String!
  ) {
    addUser(
        email: $email
        password: $password
        confirm: $confirm
    ) {
      id
      email
      token
    }
  }
`;