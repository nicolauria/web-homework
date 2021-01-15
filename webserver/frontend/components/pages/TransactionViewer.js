import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Table } from 'reactstrap';

export const GET_TRANSACTIONS = gql`
query {
  transactions {
    id
    amount
  }
}
`;

export default () => (
    <Query query={GET_TRANSACTIONS}>
      {({ loading, data }) => !loading && (
        <Table>
          <thead>
            <tr>
              <th>Author</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Query>
  );