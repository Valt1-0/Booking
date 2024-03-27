exports.generateCreatedUserEmail = (
  firstname,
  lastname
) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Account updated</title>
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
    <h1>Account updated</h1>
    <p>Hello <span class="username">${firstname} ${lastname}</span>,</p>
    <p>Your Email/Password have been updated.</p>
    <p>You can reconnecte at your account with your new email/password.</p>
    <p>Thank you</p>
  </body>
  </html>`;
}
