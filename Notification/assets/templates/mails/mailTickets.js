exports.generateTicketEmail = (tickets, status) => {
if(status === "CONFIRMED"){
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tickets event</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f9f9f9;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #333;
      font-size: 24px;
    }
    p {
      color: #666;
      font-size: 16px;
    }
    .ticket {
      border: 1px solid #ddd;
      margin: 10px 0;
      padding: 10px;
      background-color: #fff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      border-radius: 5px;
    }
    .ticket p {
      margin: 0;
      padding: 0;
    }
    .ticket-id {
      font-weight: bold;
      color: #007BFF;
    }
  </style>
</head>
<body>
  <h1>Your Tickets</h1>
  <p>You have successfully purchased ${tickets.length} tickets.</p>
  ${tickets
    .map(
      (ticket) => `
    <div class="ticket">
      <p class="ticket-id">Ticket ID: ${ticket._id}</p>
      <p>Price: ${ticket.price}</p>
      <p>Purchase Date: ${ticket.purchaseDate}</p>
      <img src="https://qrcode.tec-it.com/API/QRCode?data=http://127.0.0.1:3004/${ticket._id}&backcolor=%23ffffff&size=Small" alt="QR Code" />
    </div>
  `
    )
    .join("")}
  <p>Thank you</p>
</body>
</html>`;

}
else {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Tickets event</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        padding: 20px;
      }
      h1 {
        color: #333333;
        font-size: 24px;
      }
      p {
        color: #666666;
        font-size: 16px;
      }
      .username {
        color: #007bff;
      }
    </style>
  </head>
  <body>
    <h1>Your Tickets</h1>
    <p>Unfortunately, there was a problem during the validation of your order. This can be explained by a payment problem or a problem with a place sold but unavailable.</p>
  </body>
  </html>`;
}


};
