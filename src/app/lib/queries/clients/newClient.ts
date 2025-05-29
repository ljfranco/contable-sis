import { Client } from '@/app/types/clients';
import { supabase } from '@/app/lib/supabaseClient';

export async function newClient(client: Client): Promise<Client> {
    if (!client || typeof client !== 'object') {
        throw new Error('Cliente inválido');
    }

    // Evitar enviar id_client si es autogenerado
    const { id_client, ...clientData } = client;

    const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select('*, document_types(*)')
        .single();

    if (error) {
        throw new Error(`Error al crear el cliente: ${error.message}`);
    }

    return data as Client;
}
