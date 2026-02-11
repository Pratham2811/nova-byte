export const emailTemplate = (otp) => {
    const html = `<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="100%" max-width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:24px;">
          
          <tr>
            <td style="text-align:center;">
              <h2 style="margin:0 0 12px; color:#111;">
                Verify your email
              </h2>
              <p style="margin:0 0 20px; color:#555; font-size:14px;">
                Use the OTP below to verify your email address.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:16px 0;">
              <div style="
                font-size:28px;
                font-weight:bold;
                letter-spacing:6px;
                color:#111;
                background:#f0f0f0;
                padding:12px 20px;
                border-radius:6px;
                display:inline-block;
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td style="text-align:center;">
              <p style="margin:16px 0 0; color:#777; font-size:13px;">
                This OTP is valid for <strong>15 minutes</strong>.
              </p>
              <p style="margin:8px 0 0; color:#999; font-size:12px;">
                If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>`;

    return html;
}