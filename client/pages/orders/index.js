import React from 'react';

const OrderIndex = ({ orders }) => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Order ID</th>
            <th>Ticket Title</th>
            <th>Expires At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.id}</td>
              <td>{order.ticket.title}</td>
              <td>{new Date(order.expiresAt).toLocaleString()}</td>
              <td
                className={`font-weight-bold ${
                  order.status === 'complete' ? 'text-success' : 'text-danger'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders`);
  return { orders: data };
};

export default OrderIndex;
