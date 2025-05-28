import { supabase } from '@/app/lib/supabaseClient';
import { Client } from '@/app/types/clients';

export async function updateClient(client: Client): Promise<Client> {
  if (!client.id_client) {
    throw new Error('ID de cliente no definido');
  }

  const { data, error } = await supabase
    .from('clients')
    .update({
      full_name: client.full_name,
      document_number: client.document_number,
      email: client.email,
      phone: client.phone,
      address: client.address,
    })
    .eq('id_client', client.id_client)
    .select('*, document_types(name)')
    .single();

  if (error) {
    throw new Error(`Error al actualizar el cliente: ${error.message}`);
  }

  return data as Client;
}