// ================================
//   SAI Email Templates (Theme Updated)
//   ONLY COLORS CHANGED — NOTHING ELSE
// ================================

// 🎨 Theme Colors:
// Gold: #FBC42E
// Orange: #E66A32
// Red: #C24C30
// Dark BG: #1a1a1a
// Box BG: #2B2B2B
// Text: #FFD9A0



// ✅ 1. Verification Email Template
export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body style="font-family: Arial, sans-serif; line-height:1.6; color:#FFD9A0; max-width:600px; margin:0 auto; padding:20px; background:#1a1a1a;">
  <div style="background:linear-gradient(to right,#FBC42E,#E66A32,#C24C30); padding:20px; text-align:center;">
    <h1 style="color:white; margin:0;">Verify Your Email</h1>
  </div>

  <div style="background-color:#2B2B2B; padding:20px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
    <p>Hello,</p>
    <p>Thank you for signing up! Use the verification code below to verify your account:</p>

    <h2 style="text-align:center; background-color:#C24C30; color:white; padding:10px; border-radius:5px;">
      {verificationCode}
    </h2>

    <p>This code will expire in 1 hour.</p>
    <p>If you didn’t create an account with us, please ignore this email.</p>

    <p>Best regards,<br><strong>SAI Team</strong></p>
  </div>
</body>
</html>
`;



// ✅ 2. Password Reset Request Template
export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>

<body style="font-family: Arial, sans-serif; line-height:1.6; color:#FFD9A0; max-width:600px; margin:0 auto; padding:20px; background:#1a1a1a;">
  <div style="background:linear-gradient(to right,#FBC42E,#E66A32,#C24C30); padding:20px; text-align:center;">
    <h1 style="color:white; margin:0;">Reset Your Password</h1>
  </div>

  <div style="background-color:#2B2B2B; padding:20px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
    <p>Hello,</p>
    <p>We received a request to reset your password.</p>

    <div style="text-align:center; margin:30px 0;">
      <a href="{resetURL}"
        style="background-color:#C24C30; color:white; padding:12px 24px; 
               text-decoration:none; border-radius:5px; display:inline-block;">
        Reset Password
      </a>
    </div>

    <p>If you didn’t request this, please ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
    
    <p>Best regards,<br><strong>SAI Team</strong></p>
  </div>
</body>
</html>
`;



// ✅ 3. Password Reset Success Template
export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
</head>

<body style="font-family: Arial, sans-serif; line-height:1.6; color:#FFD9A0; max-width:600px; margin:0 auto; padding:20px; background:#1a1a1a;">
  <div style="background:linear-gradient(to right,#FBC42E,#E66A32,#C24C30); padding:20px; text-align:center;">
    <h1 style="color:white; margin:0;">Password Reset Successful</h1>
  </div>

  <div style="background-color:#2B2B2B; padding:20px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
    <p>Hello,</p>
    <p>Your password has been successfully reset.</p>
    <p>You can now log in using your new password.</p>

    <p>Best regards,<br><strong>SAI Team</strong></p>
  </div>
</body>
</html>
`;



// ✅ 4. Welcome Email Template
export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to SAI!</title>
</head>

<body style="font-family: Arial, sans-serif; line-height:1.6; color:#FFD9A0; max-width:600px; margin:0 auto; padding:20px; background:#1a1a1a;">
  <div style="background:linear-gradient(to right,#FBC42E,#E66A32,#C24C30); padding:20px; text-align:center;">
    <h1 style="color:white; margin:0;">Welcome to SAI!</h1>
  </div>

  <div style="background-color:#2B2B2B; padding:20px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
    <p>Hello {name},</p>
    <p>Thank you for joining us! We're excited to have you as part of the SAI family.</p>

    <p>Best regards,<br><strong>SAI Team</strong></p>
  </div>
</body>
</html>
`;
