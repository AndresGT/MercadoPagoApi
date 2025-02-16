import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración del cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL; // URL de tu proyecto Supabase
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Clave pública (anon key)

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno: SUPABASE_URL o SUPABASE_ANON_KEY');
}

// Crear el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Exportar el cliente para usarlo en otros archivos
export { supabase };