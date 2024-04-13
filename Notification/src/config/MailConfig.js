function generatePaymentEmail(firstname, lastname, amount, senderAccountId, receiverAccountId) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Payment Confirmation</title>
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
    <h1>Payment Confirmation</h1>
    <p>Hello <span class="username">${firstname} ${lastname}</span>,</p>
    <p>Your payment of ${amount} € for tickets has been successfully processed.</p>
    <p>The amount has been debited from your account (${senderAccountId}) and credited to the receiver's account (${receiverAccountId}).</p>
    <p>Thank you for your purchase!</p>
  </body>
  </html>`;
}

const emailConfig = {
  host: "smtp.ionos.fr",
  port: 465,
  auth: {
    user: "no-reply@iseevision.fr",
    pass: "5&g9G5u6:#dZDdC6sY{",
  },
  getHtml: (username, amount, senderAccountId, receiverAccountId) =>
  generatePaymentEmail(firstname, lastname, amount, senderAccountId, receiverAccountId)
};

module.exports = emailConfig;
