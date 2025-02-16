import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar el SDK de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// Crear un nuevo pago en Mercado Pago
export const createPayment = async (paymentData) => {
  try {
    const paymentResponse = await new Payment(client).create(paymentData);

    if (paymentResponse.status !== 201) {
      throw new Error(`Error al crear el pago en Mercado Pago: ${paymentResponse.body.message}`);
    }

    return paymentResponse;
  } catch (error) {
    console.error('Error en createPayment (Mercado Pago):', error);
    throw error;
  }
};