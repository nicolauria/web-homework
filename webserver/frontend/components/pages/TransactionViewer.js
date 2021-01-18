import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Table } from 'reactstrap';

export const GET_TRANSACTIONS = gql`
query {
  transactions {
    id
    amount
  }
}
`;

export default function TransactionViewer() {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

    return (
      <>
      {console.log(data)}
        <Table>
          <thead>
            <tr>
              <th>Author</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {!loading && data.transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
}