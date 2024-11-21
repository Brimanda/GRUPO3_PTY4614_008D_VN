'use client';
import React, { useEffect, useState } from 'react';
import { HeaderComponent } from "@/components/component/home/header";
import { FooterComponent } from "@/components/component/home/footer";
import { Mail, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface ReservaDetallesType {
  canchaNombre: string;
  duracionHoras: string;
  precio: number;
  subtotal: number;
  iva: number;
  total: number;
  metodoPago: string;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    margin: 0,
    padding: 0,
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundImage: 'url("fotofondo.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  box: {
    backgroundColor: '#ffff',
    border: '2px solid #000',
    borderRadius: '10px',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
    margin: '2rem auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  confirmationHeader: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  successText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  reservaNumero: {
    fontSize: '1.2rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  detailsContainer: {
    margin: '1.5rem 0',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#f8f8f8',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #eee',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    margin: '1.5rem 0',
  },
  downloadButton: {
    backgroundColor: '#000000',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  shareButton: {
    backgroundColor: '#f5f5f5',
    color: '#000',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
};

const ReservaDetalles: React.FC<ReservaDetallesType> = ({
  canchaNombre,
  duracionHoras,
  precio,
  subtotal,
  iva,
  total,
  metodoPago,
}) => (
  <div style={styles.detailsContainer}>
    <div style={styles.detailRow}>
      <span>{canchaNombre} - {duracionHoras} horas:</span>
      <span>${precio}</span>
    </div>
    <br />
    <div style={styles.detailRow}>
      <span>Subtotal:</span>
      <span>${subtotal}</span>
    </div>
    <div style={styles.detailRow}>
      <span>IVA (19%):</span>
      <span>${iva}</span>
    </div>
    <div style={styles.totalRow}>
      <span>Total:</span>
      <span>${total}</span>
    </div>
    <div style={styles.detailRow}>
      <span>Método de pago:</span>
      <span>{metodoPago}</span>
    </div>
  </div>
);

const steps = [
  {
    icon: <Mail size={20} />,
    text: 'Recibirás un correo electrónico con los detalles de tu reserva.'
  },
  {
    icon: <Clock size={20} />,
    text: 'Llega al menos 15 minutos antes de tu hora reservada.'
  },
  {
    icon: <UserCheck size={20} />,
    text: 'No olvides llevar tu identificación y el número de reserva.'
  },
  {
    icon: <AlertCircle size={20} />,
    text: 'En caso de necesitar cancelar, hazlo con al menos 24 horas de anticipación.'
  }
];

const ProximosPasos: React.FC = () => (
  <div style={styles.stepsContainer}>
    <h4 style={styles.stepsTitle}>Próximos Pasos</h4>
    <ul style={styles.stepsList}>
      {steps.map((step, index) => (
        <li key={index} style={styles.stepItem}>
          <span style={styles.stepIcon}>{step.icon}</span>
          <span style={styles.stepText}>{step.text}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ReservaConfirmada: React.FC = () => {
  const [reservaDetalles, setReservaDetalles] = useState<ReservaDetallesType | null>(null);

  useEffect(() => {
    const detalles = localStorage.getItem('reservaDetalles');
    if (detalles) {
      setReservaDetalles(JSON.parse(detalles));
    }
  }, []);

  const generarPDF = async () => {
    if (!reservaDetalles) return;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); 
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const titleFontSize = 20;
    const headerFontSize = 12;
    const textFontSize = 10;

    page.drawText('SportRent', { x: 50, y: height - 40, size: titleFontSize, font: boldFont, color: rgb(0.1, 0.1, 0.3) });
    page.drawText('RUT: 76.543.210-K', { x: 50, y: height - 60, size: headerFontSize, font });
    page.drawText('Dirección: Chorrillos, Viña del Mar', { x: 50, y: height - 75, size: headerFontSize, font });
    page.drawText('Teléfono: +56 9 9281 8727', { x: 50, y: height - 90, size: headerFontSize, font });

    page.drawText('Factura Electrónica', { x: width / 2 - 50, y: height - 120, size: titleFontSize, font: boldFont });
    page.drawText(`Número de Reserva: RES-12345`, { x: 50, y: height - 150, size: headerFontSize, font: boldFont });
    page.drawText(`Fecha: ${new Date().toLocaleDateString()}`, { x: 50, y: height - 170, size: headerFontSize, font });

    page.drawLine({ start: { x: 50, y: height - 180 }, end: { x: width - 50, y: height - 180 }, thickness: 1 });

    const tableData = [
      { label: 'Nombre Cancha', value: reservaDetalles.canchaNombre },
      { label: 'Duración (Horas)', value: reservaDetalles.duracionHoras },
      { label: 'Precio Unitario', value: `$${reservaDetalles.precio.toFixed(2)}` },
      { label: 'Subtotal', value: `$${reservaDetalles.subtotal.toFixed(2)}` },
      { label: 'IVA (19%)', value: `$${reservaDetalles.iva.toFixed(2)}` },
    ];

    let yPosition = height - 220;
    tableData.forEach((item, index) => {
      page.drawText(item.label, { x: 50, y: yPosition, size: textFontSize, font });
      page.drawText(item.value, { x: width - 150, y: yPosition, size: textFontSize, font });
      yPosition -= 20;
    });

    page.drawLine({ start: { x: 50, y: yPosition - 10 }, end: { x: width - 50, y: yPosition - 10 }, thickness: 1 });

    page.drawText('Total a Pagar', { x: 50, y: yPosition - 40, size: textFontSize, font: boldFont });
    page.drawText(`$${reservaDetalles.total.toFixed(2)}`, { x: width - 150, y: yPosition - 40, size: textFontSize, font: boldFont });
    
    page.drawText('Método de Pago:', { x: 50, y: yPosition - 80, size: textFontSize, font: boldFont });
    page.drawText(reservaDetalles.metodoPago, { x: width - 150, y: yPosition - 80, size: textFontSize, font });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Factura_Reserva.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <HeaderComponent />
      <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.confirmationHeader}>
          <h2 style={styles.successText}>¡Reserva Confirmada!</h2>
          <p style={styles.reservaNumero}>Número de Reserva: RES-12345</p>
        </div>

        {reservaDetalles && (
          <>
            <ReservaDetalles {...reservaDetalles} />
            <div style={styles.actions}>
              <button style={styles.downloadButton} onClick={generarPDF}>
                Descargar Comprobante
              </button>
            </div>
          </>
        )}

        <ProximosPasos />
      </div>
      <FooterComponent />
    </div>
    </div>
  );
};

export default ReservaConfirmada;
