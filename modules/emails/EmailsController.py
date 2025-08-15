import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
from dotenv import load_dotenv
load_dotenv()
from modules.core.controller import response

SENDER = os.getenv("APP_SMTP_EMAIL")
PASSWORD = os.getenv("APP_SMTP_PASS")
SMTP_SERVER = os.getenv("APP_SMTP_HOST")
SMTP_PORT = os.getenv("APP_SMTP_PORT")
REPLY_TO = os.getenv("APP_SMTP_REPLY_TO")

# --- Función para enviar correos electrónicos ---
def send_email(receiver_email, subject,data, template):
    """
    Función para enviar un correo electrónico.
    Utiliza SSL para una conexión segura.
    """
    if not all([SENDER, PASSWORD]):
        return response("Faltan credenciales del servidor de correo.", None, 400)

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = SENDER
    message["To"] = receiver_email
    # get template
    with open(template  + ".html", "r") as file:
        template = file.read()
    # replace data
    for key, value in data.items():
        template = template.replace("{{" + key + "}}", value)

    # Crea la parte de texto plano del correo
    text_part = MIMEText(template, "plain")
    message.attach(text_part)

    try:
        # Crea una conexión SSL segura con el servidor SMTP
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)  # Inicia la encriptación TLS
            server.login(SENDER, PASSWORD)
            server.sendmail(SENDER, receiver_email, message.as_string())
        return response("Correo enviado con éxito.", None, 200)
    except Exception as e:
        print(f"Error al enviar el correo a {receiver_email}: {e}")
        return response(str(e), None, 500)