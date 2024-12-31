import Link from 'next/link'

const LandingPage = ({currentUser , allTickets}) => {
  console.log("the current user is : " , currentUser);
  console.log("the tickets are  " , allTickets)

  const ticketList = allTickets.map((ticket) => (
    <tr key={ticket.id} style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
      <td style={{ padding: "10px" }}>{ticket.title}</td>
      <td style={{ padding: "10px" }}>₹{ticket.price.toFixed(2)}</td>
      <td style={{ padding: "10px" }}>
        <a
          href={`/tickets/${ticket.id}`}
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          View
        </a>
      </td>
    </tr>
  ))


  return (
    <div>
      {
        currentUser ? (<h1>You are signed in {currentUser?.email}</h1>) : (<h1>you are not signed in</h1>)
      }

      <table className="table table-striped table-bordered" style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "10px", fontWeight: "bold", borderBottom: "2px solid #ddd" }}>Title</th>
            <th style={{ padding: "10px", fontWeight: "bold", borderBottom: "2px solid #ddd" }}>Price</th>
            <th style={{ padding: "10px", fontWeight: "bold", borderBottom: "2px solid #ddd" }}>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>


    </div>
  )
};

LandingPage.getInitialProps = async (context , client , currentUser) => {
  const {data : allTickets} = await client.get("/api/tickets");
  console.log(allTickets);
  return {allTickets};  
};

export default LandingPage;
