const verifyOtpTemplate = (otp, email) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Verify Your Account</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding: 40px 0;">
          <tr>
              <td align="center">

                  <table width="500" cellpadding="0" cellspacing="0" 
                         style="background:#ffffff; border-radius:10px; padding:30px;">

                      <!-- Header -->
                      <tr>
                          <td align="center" style="padding-bottom:20px;">
                              <h2 style="color:#4f46e5; margin:0;">
                                  Account Verification 🔐
                              </h2>
                          </td>
                      </tr>

                      <!-- Message -->
                      <tr>
                          <td style="color:#555; font-size:16px; line-height:1.6;">
                              <p>Hi,</p>

                              <p>
                                  We received a request to verify the account registered with:
                                  <strong>${email}</strong>
                              </p>

                              <p>
                                  Please use the OTP below to complete your verification.
                              </p>

                              <!-- OTP Box -->
                              <div style="text-align:center; margin:30px 0;">
                                  <div style="
                                      display:inline-block;
                                      background:#eef2ff;
                                      padding:15px 30px;
                                      font-size:28px;
                                      letter-spacing:5px;
                                      font-weight:bold;
                                      color:#4f46e5;
                                      border-radius:8px;">
                                      ${otp}
                                  </div>
                              </div>

                              <p style="color:#d97706; font-weight:bold;">
                                  ⚠ This OTP will expire in 5 minutes.
                              </p>

                              <p>
                                  If you did not request this verification, please ignore this email.
                              </p>

                              <p style="margin-top:30px;">
                                  Regards,<br/>
                                  <strong>Omair's Tech Solutions</strong>
                              </p>
                          </td>
                      </tr>

                  </table>

                  <!-- Footer -->
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

export default verifyOtpTemplate;
