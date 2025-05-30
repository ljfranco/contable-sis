
import { supabase } from '@/app/lib/supabaseClient';
import { document_types } from '@/app/types/clients';

export async function getDocumentTypes() {
    const { data, error } = await supabase
        .from('document_types')
        .select('id_doc_type, name');

    if (error) throw new Error('Error al cargar tipos de documento');

    return data as document_types[];
}
