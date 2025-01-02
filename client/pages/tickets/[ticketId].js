import useRequest from '../../hooks/use-Request';
import Router from 'next/router';

const TicketShow = ({ticket}) => {

  const [ makeRequest , errors ] = useRequest("post",'/api/orders',{ticketId: ticket.id},
    (order) => Router.push(`/orders/${order.id}`)
  );

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 p-4">
      <div className="card shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="card-body">
          {/* Ticket Details */}
          <div className="d-flex justify-content-between mb-4">
            {/* Left Section */}
            <div className="flex-grow-1 pe-4 border-end border-dashed">
              <h2 className="h4 fw-bold text-dark mb-3">{ticket.title}</h2>
              <p className="mb-2">
                <strong>Type:</strong> Regular
              </p>
              <p className="mb-2">
                <strong>Price:</strong> Rs. {ticket.price.toFixed(2)}
              </p>
              <p className="mb-2">
                <strong>Discount:</strong> Rs. 0.00
              </p>
              <p className="mb-2">
                <strong>VAT:</strong> Rs. 0.00
              </p>
              <hr />
              <p className="fw-bold">
                <strong>Total:</strong> Rs. {ticket.price.toFixed(2)}
              </p>
            </div>

            {/* Right Section */}
            <div className="flex-shrink-0 ps-4 text-center">
              <div className="border rounded mb-2 p-2 text-center">
                <p className="mb-1 small">HALL</p>
                <p className="fw-bold h5 mb-0">03</p>
              </div>
              <div className="border rounded mb-2 p-2 text-center">
                <p className="mb-1 small">ROW</p>
                <p className="fw-bold h5 mb-0">01</p>
              </div>
              <div className="border rounded p-2 text-center">
                <p className="mb-1 small">SEAT</p>
                <p className="fw-bold h5 mb-0">27</p>
              </div>
            </div>

          </div>

          {/* Error Messages */}
          {errors && errors.length > 0 && (
            <div className="alert alert-danger mb-4">
              <h6>Ooops....</h6>
              {errors.map((error, index) => (
                <div key={index}>{error.message}</div>
              ))}
            </div>
          )}

          {/* Purchase Button */}
          <div className="text-center">
            <button onClick={() => makeRequest()} className="btn btn-primary btn-lg">
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>

  );
   
  
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;