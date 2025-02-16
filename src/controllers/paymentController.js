import { createPayment as mercadoPagoCreatePayment } from '../services/mercadoPagoServices.js';
import { createPayment, updatePaymentStatus } from '../models/paymentModel.js';

const initiatePayment = async (req, res) => {
  try {
    const { amount, description, splitPercentage, payerEmail } = req.body;

    // Validaciones
    if (!amount || !description || !splitPercentage || !payerEmail) {
      return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: "El monto debe ser un número positivo" });
    }
    if (splitPercentage < 0 || splitPercentage > 100) {
      return res.status(400).json({ error: "El porcentaje de split debe estar entre 0 y 100" });
    }

    // Calcular el split
    const primaryAmount = Math.round(amount * (1 - splitPercentage / 100) * 100) / 100;
    const secondaryAmount = amount - primaryAmount;

    // Configurar el pago con split
    const paymentData = {
      transaction_amount: amount,
      description: description,
      payment_method_id: 'visa', // Ajusta según el método de pago que quieras soportar
      payer: {
        email: payerEmail
      },
      split_rules: [
        {
          receiver_id: process.env.SUPABASE_PROVIDER_ID,
          amount: primaryAmount,
          percentage: 100 - splitPercentage
        },
        {
          receiver_id: process.env.SUPABASE_BUSINESS_ID,
          amount: secondaryAmount,
          percentage: splitPercentage
        }
      ]
    };

    // Crear el pago en Mercado Pago
    const mercadoPagoResponse = await mercadoPagoCreatePayment(paymentData);

    // Guardar los detalles del pago en la base de datos
    const savedPayment = await createPayment({
      amount: amount,
      description: description,
      mp_payment_id: mercadoPagoResponse.body.id,
      status: mercadoPagoResponse.body.status
    });

    // Enviar la URL de pago al frontend
    res.json({
      paymentUrl: mercadoPagoResponse.body.init_point,
      payment: savedPayment
    });
  } catch (error) {
    console.error('Error en el controlador de pagos:', error);
    res.status(500).json({ error: error.message || 'Error al procesar el pago' });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const { id, status } = req.body;

    // Validaciones
    if (!id || !status) {
      return res.status(400).json({ error: "Datos de webhook incompletos" });
    }

    // Actualizar el estado del pago en la base de datos
    await updatePaymentStatus(id, status);

    res.status(200).send('Webhook recibido y procesado');
  } catch (error) {
    console.error('Error al manejar webhook:', error);
    res.status(500).json({ error: error.message || 'Error al procesar webhook' });
  }
};

export { initiatePayment, handleWebhook };