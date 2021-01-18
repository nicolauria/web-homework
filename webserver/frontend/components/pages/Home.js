import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';

export default function Home() {
    const { userData } = useContext(UserContext);

    return (
        <div className="mt-5">
            <h1>Home</h1>
            {userData.user ? 
                <Link to="/transactions">Transactions</Link> :
                <p>You must be signed in to view and add transactions.</p>
            }
        </div>
    )
}
