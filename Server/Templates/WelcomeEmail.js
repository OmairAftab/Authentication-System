const welcomeTemplate = (email) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Welcome Email</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding: 30px 0;">
          <tr>
              <td align="center">
                  
                  <table width="500" cellpadding="0" cellspacing="0" 
                         style="background:#ffffff; border-radius:10px; padding:30px;">
                      
                      <tr>
                          <td align="center" style="padding-bottom:20px;">
                              <h2 style="color:#4f46e5; margin:0;">
                                  Welcome to Omair's Authentication System 🎉
                              </h2>
                          </td>
                      </tr>

                      <tr>
                          <td style="color:#555; font-size:16px; line-height:1.6;">
                              <p>Hi,</p>
                              
                              <p>
                                  Your account has been successfully verified with:
                                  <strong>${email}</strong>
                              </p>


                              <p>Regards,<br/><strong>Omair's Tech Solutions</strong></p>
                          </td>
                      </tr>

                  </table>

                  <p style="color:#999; font-size:12px; margin-top:20px;">
                      © ${new Date().getFullYear()} Omair's Tech Solutions
                  </p>

              </td>
          </tr>
      </table>

  </body>
  </html>
  `;
};

export default welcomeTemplate;
