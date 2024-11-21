import * as React from 'react';

interface EmailTemplateProps {
  name: string;  
  fecha: string;
  lugar: string;
  nombreCancha: string;
  capacidad: string;
  destinatario: 'cliente' | 'propietario'; 
  nameCliente: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ 
  name, 
  fecha, 
  lugar, 
  nombreCancha, 
  capacidad, 
  destinatario,
  nameCliente
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', lineHeight: '1.6' }}>
    <h3>¡Hola {name}!</h3>
    <br />
    
    {destinatario === 'cliente' ? (
      <p><strong>Tu reserva ha sido confirmada exitosamente.</strong></p>
    ) : (
      <p><strong>Se ha realizado una nueva reserva para tu cancha.</strong></p>
    )}

    {destinatario === 'cliente' ? (
      <><p>A continuación, los detalles de la reserva:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><strong>Fecha:</strong> {fecha}</li>
        <li><strong>Lugar:</strong> {lugar}</li>
        <li><strong>Nombre de la Cancha:</strong> {nombreCancha}</li>
        <li><strong>Capacidad:</strong> {capacidad}</li>
      </ul></>
    ) : (
      <><p>A continuación, los detalles de la reserva:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><strong>Cliente:</strong> {nameCliente}</li>
        <li><strong>Fecha:</strong> {fecha}</li>
        <li><strong>Lugar:</strong> {lugar}</li>
        <li><strong>Nombre de la Cancha:</strong> {nombreCancha}</li>
        <li><strong>Capacidad:</strong> {capacidad}</li>
        
      </ul></>
    )}

    {destinatario === 'cliente' ? (
      <p>Si tienes alguna duda, no dudes en contactar con nuestro equipo de soporte.</p>
    ) : (
      <p>Recuerda revisar tu cuenta para más detalles de la reserva.</p>
    )}

    <br />

    <a href="https://sportrent.vercel.app/pedidos" style={{ 
      display: 'inline-block', 
      padding: '10px 20px', 
      backgroundColor: '#4CAF50', 
      color: '#ffffff', 
      textDecoration: 'none', 
      borderRadius: '5px',
      fontWeight: 'bold'
    }}>
      {destinatario === 'cliente' ? 'Ir a mis reservas' : 'Ver detalles de la reserva'}
    </a>
  </div>
);
