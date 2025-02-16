import { Router } from "express";
import {
  initiatePayment, handleWebhook 
} from "../controllers/paymentController.js";
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';

const router = Router();

/**
 * POST /create-order
 * Crea una nueva orden de pago en Mercado Pago.
 */
router.post(
  "/create-order",
  [
    body('amount').isNumeric().withMessage('El monto debe ser un número'),
    body('description').notEmpty().withMessage('La descripción es requerida'),
    body('payerEmail').isEmail().withMessage('El email del pagador no es válido'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  initiatePayment
);

/**
 * POST /webhook
 * Recibe notificaciones de Mercado Pago sobre el estado de los pagos.
 */
router.post("/webhook", (req, res) => {
  const { id, status } = req.body;
  const signature = req.headers['x-signature'];

  // Verificar la firma
  const expectedSignature = crypto
    .createHmac('sha256', process.env.MERCADO_PAGO_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: "Firma inválida" });
  }

  // Procesar el webhook
  handleWebhook(req, res);
});

/**
 * GET /success
 * Redirige al usuario después de un pago exitoso.
 */
router.get("/success", (req, res) => {
  res.send(`
    <h1>Pago exitoso</h1>
    <p>Gracias por tu compra. Pronto recibirás un correo con los detalles.</p>
  `);
});

export default router;