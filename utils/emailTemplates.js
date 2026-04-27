const getWelcomeEmailTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #e91e63, #c2185b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; background: #eee; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background: #e91e63; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .feature { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #e91e63; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Sakhi! 🎉</h1>
        </div>
        <div class="content">
          <h2>Dear ${name},</h2>
          <p>Thank you for joining <strong>Sakhi</strong> - your trusted companion for safety and empowerment.</p>
          
          <h3>Here's what you can do with Sakhi:</h3>
          
          <div class="feature">
            <strong>🚨 Emergency SOS</strong>
            <p>One-tap emergency alerts with real-time location sharing to your trusted contacts and authorities.</p>
          </div>
          
          <div class="feature">
            <strong>👥 Trusted Circle</strong>
            <p>Create your safety network and stay connected with people you trust.</p>
          </div>
          
          <div class="feature">
            <strong>📝 Report Incidents</strong>
            <p>Report incidents safely, with options for anonymous reporting.</p>
          </div>
          
          <div class="feature">
            <strong>⚖️ Legal Aid</strong>
            <p>Get connected with legal professionals who can help you.</p>
          </div>
          
          <div class="feature">
            <strong>💬 Community Support</strong>
            <p>Connect with other women, share experiences, and get support.</p>
          </div>
          
          <div class="feature">
            <strong>📚 Government Schemes</strong>
            <p>Discover benefits and schemes you may be eligible for.</p>
          </div>
          
          <a href="https://sakhi.app/get-started" class="button">Get Started</a>
          
          <p style="margin-top: 30px;">Stay safe, stay empowered!</p>
          <p>With warmth,<br><strong>The Sakhi Team</strong></p>
        </div>
        <div class="footer">
          <p>If you need help, contact us at support@sakhi.app or call our helpline at 1800-XXX-XXXX</p>
          <p>© 2024 Sakhi Safety Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getEmergencyAlertTemplate = (userName, location, emergencyType, emergencyId) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #d32f2f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #fff3e0; }
        .alert-box { background: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 24px; background: #d32f2f; color: white; text-decoration: none; border-radius: 5px; }
        .location { background: #f5f5f5; padding: 10px; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ EMERGENCY ALERT ⚠️</h1>
        </div>
        <div class="content">
          <div class="alert-box">
            <h2>${userName} needs your help!</h2>
            <p><strong>Emergency Type:</strong> ${emergencyType}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Location:</strong></p>
            <div class="location">${location}</div>
          </div>
          
          <h3>What you can do:</h3>
          <ul>
            <li>Call ${userName} immediately</li>
            <li>Share this alert with emergency services</li>
            <li>Track their live location: <a href="https://sakhi.app/track/${emergencyId}">Click here</a></li>
          </ul>
          
          <a href="https://sakhi.app/respond/${emergencyId}" class="button">I'm on my way</a>
          
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            This is an automated alert from Sakhi Safety Platform. ${userName} has triggered an emergency.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getPasswordResetTemplate = (resetUrl, name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 500px; margin: 0 auto; padding: 20px; }
        .header { background: #4caf50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #4caf50; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Password Reset Request</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">For security, never share this link with anyone.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getReportUpdateTemplate = (report, status, remarks) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #2196f3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .status-updated { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Report Update</h2>
        </div>
        <div class="content">
          <p>Dear User,</p>
          <div class="status-updated">
            <h3>Your report has been updated</h3>
            <p><strong>Report ID:</strong> ${report.caseNumber || report._id}</p>
            <p><strong>New Status:</strong> ${status}</p>
            ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
          </div>
          <p>Track your report status anytime in the Sakhi app.</p>
          <p>Thank you for trusting Sakhi.</p>
        </div>
      </div>
    </html>
  `;
};

module.exports = {
    getWelcomeEmailTemplate,
    getEmergencyAlertTemplate,
    getPasswordResetTemplate,
    getReportUpdateTemplate
};