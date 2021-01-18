import React, { useContext, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';

export const GET_TRANSACTIONS = gql`
  query transactions($user_id: String!) {
    transactions(user_id: $user_id) {
      id
      amount
      credit
      debit
      description
    }
  }
`;

export default function TransactionViewer() {
  const { userData } = useContext(UserContext);
  
  const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
    variables: { user_id: userData.user.id }
  });

    return (
      <>
        <Link to="/addTransaction" className="btn btn-primary mt-5 mb-5">Add Transaction</Link>
        <Table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {!loading && data.transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.credit ? 'true' : 'false'}</td>
                <td>{transaction.debit ? 'true' : 'false'}</td>
                <td>{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
}