import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';

export default function Header() {
    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();

    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        })
        localStorage.setItem("auth-token", "");
        history.push("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Transaction Widget</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <Link className="nav-link" to="/">Home</Link>
                </li>
                {
                    userData.user ? 
                    <button onClick={logout}>Log out</button> :
                    <>
                    <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                    </li>
                    </>
                }
                </ul>
            </div>
        </nav>
    )
}
