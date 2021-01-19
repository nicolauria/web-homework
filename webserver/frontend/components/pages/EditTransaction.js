import React, { useContext, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks';
// import { gql, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import UserContext from '../../context/UserContext';
import { useHistory } from 'react-router-dom';
import ErrorNotice from '../misc/ErrorNotice';
import { Link } from 'react-router-dom';

export default function EditTransaction({ match }) {
    // const [date, setDate] = useState(new Date());
    const [amount, setAmount] = useState(0);
    const [credit, setCredit] = useState(true);
    const [debit, setDebit] = useState(false);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const { userData } = useContext(UserContext);
    const history = useHistory();

    const { loading, transactionError, data } = useQuery(GET_TRANSACTION, {
        variables: {
            id: match.params.id
        },
        pollInterval: 500,
        onCompleted() {
            setAmount(data.transaction.amount);
            setDescription(data.transaction.description);
        }
    });

    const [editTransaction, result] = useMutation(EDIT_TRANSACTION, {
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
        editTransaction({
            variables: {
                id: match.params.id,
                date: new Date(),
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
            <Link to="/transactions">Back to Transactions Page</Link>
            <h1 style={{ marginTop: '50px'}}>Edit Transaction</h1>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            {!loading && 
                <form onSubmit={submit}>
                <div className="form-group">
                    <label>Amount</label>
                    <input type="text" defaultValue={data.transaction.amount} className="form-control" onChange={ e => setAmount(e.target.value)} placeholder="Amount" />
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
                    <input type="text" defaultValue={data.transaction.description} className="form-control" onChange={ e => setDescription(e.target.value)} placeholder="Description" />
                </div>
                {/* <div className="form-group">
                    <input type="date" selected={date} onChange={date => setDate(date)} placeholder="Date" />
                </div> */}
                <input type="submit" className="btn btn-primary" value="Submit" />
                </form>
            }
        </div>
    )
}

const GET_TRANSACTION = gql`
  query transaction(
    $id: String!
  ) {
    transaction (
        id: $id
    ) {
      user_id
      amount
      credit
      debit
      description
      date
    }
  }
`;

const EDIT_TRANSACTION = gql`
  mutation editTransaction(
    $id: String!
    $user_id: String!
    $amount: Float!
    $credit: Boolean!
    $debit: Boolean!
    $description: String!
    $date: String!
  ) {
    editTransaction(
        id: $id
        user_id: $user_id
        amount: $amount
        credit: $credit
        debit: $debit,
        description: $description
        date: $date
    ) {
      user_id
      amount
      credit
      debit
      description
      date
    }
  }
`;