import { supabase } from '../config/supabaseClient.js';

// Crear un nuevo pago en la base de datos
export const createPayment = async ({ amount, description, mp_payment_id, status }) => {
  try {
    const { data, error } = await supabase
      .from('payments') // Nombre de la tabla en Supabase
      .insert([
        {
          amount,
          description,
          mp_payment_id,
          status
        }
      ])
      .select(); // Devuelve el registro insertado

    if (error) {
      throw new Error(`Error al crear el pago: ${error.message}`);
    }

    return data[0]; // Devuelve el primer registro insertado
  } catch (error) {
    console.error('Error en createPayment:', error);
    throw error;
  }
};

// Actualizar el estado de un pago en la base de datos
export const updatePaymentStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('mp_payment_id', id); // Filtra por el ID de Mercado Pago

    if (error) {
      throw new Error(`Error al actualizar el estado del pago: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error en updatePaymentStatus:', error);
    throw error;
  }
};