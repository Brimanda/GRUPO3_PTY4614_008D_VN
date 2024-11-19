import { EmailTemplate } from '@/components/email-template-reserva';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, fecha, lugar, nombreCancha, capacidad, propietarioEmail, propietarioName, nameCliente  } = await request.json(); 

    if (!name || !email || !fecha || !lugar || !nombreCancha || !capacidad || !propietarioEmail || !propietarioName) {
      return new Response(JSON.stringify({ error: 'Faltan datos para enviar los correos' }), { status: 400 });
    }

    const responseCliente = await resend.emails.send({
      from: 'SportRent <sportrent@turismodelvallespa.com>',
      to: [email],  
      subject: 'Confirmación de Reserva',
      react: EmailTemplate({
        name: name,
        fecha,
        lugar,
        nombreCancha,
        capacidad,
        destinatario: 'cliente',
        nameCliente 
      }), 
    });

    if (responseCliente.error) {
      console.log("Error al enviar el correo al cliente:", responseCliente.error);
      return new Response(JSON.stringify({ error: responseCliente.error }), { status: 500 });
    }

    const responsePropietario = await resend.emails.send({
      from: 'SportRent <sportrent@turismodelvallespa.com>',
      to: [propietarioEmail],  
      subject: 'Nueva Reserva Confirmada',
      react: EmailTemplate({
        name: propietarioName,
        fecha,
        lugar,
        nombreCancha,
        capacidad,
        destinatario: 'propietario',
        nameCliente: name,
      }), 
    });

    if (responsePropietario.error) {
      console.log("Error al enviar el correo al propietario:", responsePropietario.error);
      return new Response(JSON.stringify({ error: responsePropietario.error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
    
  } catch (error) {
    console.log("Error inesperado al enviar los correos:", error);
    return new Response(JSON.stringify({ error: 'Error inesperado al enviar los correos' }), { status: 500 });
  }
}
