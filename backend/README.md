## Backend Environment Variables for Nodemailer

To use Nodemailer for email sending, please add the following environment variables to your `.env` file in the backend directory:

```
EMAIL_HOST=your_email_host_smtp_server (e.g., smtp.gmail.com)
EMAIL_PORT=your_email_host_smtp_port (e.g., 587 for TLS, 465 for SSL)
EMAIL_SECURE=true_or_false (true for SSL/TLS, false otherwise)
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password_or_app_specific_password
EMAIL_FROM=your_email_address (e.g., Your Name <your_email_address>)
```

**Example for Gmail:**

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Your Name <your_gmail_address@gmail.com>
```

**Note:** If you are using Gmail, you might need to generate an App Password for your account, as direct password usage is often blocked for security reasons. Refer to Google's documentation on App Passwords for more information.


