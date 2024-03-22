function generatePaymentEmail(
  firstname,
  lastname,
  totalPrice,
  ticketIds,
  ticketQuantity
) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Purchase Result</title>
      <style>
        /* Reset styles */
        body,
        h1,
        p {
          margin: 0;
          padding: 0;
        }
  
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
  
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
  
        h1 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }
  
        p {
          color: #666666;
          font-size: 16px;
          margin-bottom: 20px;
        }
  
        .ticket-container {
          margin-bottom: 20px;
        }
  
        .ticket {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
  
        .ticket-image {
          max-width: 25%;
          height: auto;
          margin-right: 20px;
          transition: transform 0.3s ease;
        }
  
        .ticket-details {
          flex-grow: 1;
        }
  
        .ticket-id {
          font-size: 14px;
          font-weight: bold;
          color: #333333;
        }
  
        .ticket-image:hover {
          transform: scale(1.1); /* Increase size on hover */
        }
  
        .total-price {
          font-weight: bold;
          color: #333333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Purchase Result</h1>
        <hr />
        <p>Hello ${firstname} ${lastname},</p>
        <p>Your ticket purchase was successful!</p>
        <div class="ticket-container">
          ${Array.from({ length: ticketQuantity })
            .map(
              (_, index) => `
          <div class="ticket">
            <img src="ticket.png" alt="Ticket Image" class="ticket-image" />
            <div class="ticket-details">
              <span class="ticket-id">Ticket ID : ${ticketIds[index]}</span>
            </div>
          </div>
          `
            )
            .join("")}
        </div>
        <hr />
        <div class="ticket-details">
          <p class="total-price"><strong>Total Price :</strong> ${totalPrice}</p>
        </div>
      </div>
    </body>
  </html>`;
}

generatePaymentEmail("John", "Doe", 100, "123456789", "987654321");
