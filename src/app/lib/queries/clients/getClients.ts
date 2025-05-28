import { supabase } from '@/app/lib/supabaseClient';
import { Client } from '@/app/types/clients';

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id_client,
      full_name,
      document_number,
      email,
      phone,
      address,
      created_at,
      updated_at,
      document_types (name)
    `);

  if (error) {
    throw new Error(`Error al cargar los clientes: ${error.message}`);
  }

  return data as Client[];
}
