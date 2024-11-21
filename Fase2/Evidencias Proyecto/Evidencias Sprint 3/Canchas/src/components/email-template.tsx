import * as React from 'react';

interface EmailTemplateProps {
  nombre: string;
  mensaje: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ nombre, mensaje }) => (
  <div>
    <h3>¡Hola {nombre}!</h3>
    <br />
    <p>Hemos recibido tu mensaje:</p>
    <p>Mensaje: <strong>{mensaje}</strong></p>
    <p>Pronto el equipo de soporte se pondrá en contacto contigo para resolver tu duda.</p>
    <br />
  </div>
);
