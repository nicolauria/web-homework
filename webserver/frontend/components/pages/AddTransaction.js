import React, { useContext, useState } from 'react'
import { useMutation } from '@apollo/react-hooks';
// import { gql, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import UserContext from '../../context/UserContext';
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../misc/ErrorNotice';

export default function AddTransaction() {
    const [amount, setAmount] = useState(0);
    const [credit, setCredit] = useState(true);
    const [debit, setDebit] = useState(false);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const { userData } = useContext(UserContext);
    const history = useHistory();

    const [addTransaction, { data }] = useMutation(ADD_TRANSACTION, {
        onCompleted() {
          history.push("/transactions");
        },
        onError({ graphQLErrors, networkError }) {
            console.log(networkError);
            if (graphQLErrors) {
                setError(graphQLErrors[0].message);
            } else {
                setError(networkError);
            }
            
        }
    });

    const submit = (e) => {
        e.preventDefault();
        addTransaction({
            variables: {
                user_id: userData.user.id,
                amount: parseFloat(amount),
                credit,
                debit,
                description
            }
        });
    }

    return (
        <div style={{ marginTop: '150px' }}>
            <h1>Add Transaction</h1>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            <form onSubmit={submit}>
                <div className="form-group">
                    <label>Amount</label>
                    <input type="text" className="form-control" onChange={ e => setAmount(e.target.value)} placeholder="Amount" />
                </div>
                <div className="form-group">
                    <label>Credit or Debit</label><br/>
                    <select>
                        <option onClick={ e => setCredit(true)}>Credit</option>
                        <option onClick={ e => setDebit(true)}>Debit</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input type="text" className="form-control" onChange={ e => setDescription(e.target.value)} placeholder="Description" />
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
    )
}

const ADD_TRANSACTION = gql`
  mutation addTransaction(
    $user_id: String!
    $amount: Float!
    $credit: Boolean!
    $debit: Boolean!
    $description: String!
  ) {
    addTransaction(
        user_id: $user_id
        amount: $amount
        credit: $credit
        debit: $debit,
        description: $description
    ) {
      user_id
      amount
      credit
      debit
      description
    }
  }
`;