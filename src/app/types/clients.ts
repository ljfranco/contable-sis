
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
        name: string;
    } | null;
}