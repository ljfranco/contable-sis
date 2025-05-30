
export interface Client {
    id_client: string;
    full_name: string;
    document_number: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
    updated_at: string | null;
    document_types: {
        id_doc_type: string;
        name: string;
    } | null;
}

export interface document_types {
    id_doc_type: string;
    name: string;
}


