import express from "express";
import morgan from "morgan";
import paymentRoutes from "./routes/payment.routes.js";

// Crear la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware de registro de solicitudes HTTP
app.use(morgan("dev"));

// Rutas de la aplicación
app.use(paymentRoutes);

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.error('Error global:', err.message);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});