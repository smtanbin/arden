import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# SMTP server details
smtp_server = "118.179.131.11"
smtp_port = 25  # Use port 587 for STARTTLS
smtp_username = "helpdeskadc@standardbankbd.com"
smtp_password = "!helpdeskadc#321"

def smtp_server(to_email: str, subject: str, body):
    try:
        # Establish SMTP connection
        server = smtplib.SMTP(smtp_server, smtp_port)

        # Login using SMTP credentials
        # server.login(smtp_username, smtp_password)

        # Create the email message
        msg = MIMEMultipart()
        msg["From"] = "helpdeskadc@standardbankbd.com"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        # Send the email
        server.sendmail(smtp_username, to_email, msg.as_string())

        print("Email sent successfully")
        server.quit()

        # Return success message

        # store_sms_data(to_email, subject, msg.get("Content-Type"), 'true', None)
        # return {"message": {"to": to_email, "subject": subject, "content_type": msg.get("Content-Type")},
        #         "error": None}

    except Exception as e:
        print(f"An error occurred: {e}")
        # Return error message
        return {"message": None,
                "error": {"content_type": {"to": to_email, "subject": subject}, "message": str(e)}}
