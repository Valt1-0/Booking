function generateSenderEmail(
  username,
  amount,
  senderAccountId,
  receiverAccountId
) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Banking</title>
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
      a {
        color: #ffffff;
        background-color: #007bff;
        border-radius: 5px;
        padding: 10px 20px;
        text-decoration: none;
      }
      a:hover {
        background-color: #0099ff;
      }
      .username {
        color: #007bff;
      }
    </style>
  </head>
  <body>
    <h1>Transfer email</h1>
    <p>Bonjour <span class="username">${username}</span></p>
    <p>Le montant de ${amount} € à bien été transferé du compte ${senderAccountId} vers ${receiverAccountId}</p><br/>
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
    generateSenderEmail(username, amount, senderAccountId, receiverAccountId),
};

module.exports = emailConfig;
