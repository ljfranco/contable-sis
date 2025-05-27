export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            clients: {
                Row: {
                    address: string | null
                    created_at: string | null
                    document_number: string
                    email: string | null
                    full_name: string
                    id_client: string
                    id_doc_type: string | null
                    phone: string | null
                    updated_at: string | null
                }
                Insert: {
                    address?: string | null
                    created_at?: string | null
                    document_number: string
                    email?: string | null
                    full_name: string
                    id_client?: string
                    id_doc_type?: string | null
                    phone?: string | null
                    updated_at?: string | null
                }
                Update: {
                    address?: string | null
                    created_at?: string | null
                    document_number?: string
                    email?: string | null
                    full_name?: string
                    id_client?: string
                    id_doc_type?: string | null
                    phone?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "clients_id_doc_type_fkey"
                        columns: ["id_doc_type"]
                        isOneToOne: false
                        referencedRelation: "document_types"
                        referencedColumns: ["id_doc_type"]
                    },
                ]
            }
            companies: {
                Row: {
                    bisnes_name: string
                    cert_BPS: string | null
                    cert_DGI: string | null
                    closing_date: string | null
                    doc_BPS: string
                    doc_DGI: string
                    id_client: string | null
                    id_companie: string
                    id_taxpayer_type: string | null
                    start_date: string | null
                    tax_address: string | null
                }
                Insert: {
                    bisnes_name: string
                    cert_BPS?: string | null
                    cert_DGI?: string | null
                    closing_date?: string | null
                    doc_BPS: string
                    doc_DGI: string
                    id_client?: string | null
                    id_companie?: string
                    id_taxpayer_type?: string | null
                    start_date?: string | null
                    tax_address?: string | null
                }
                Update: {
                    bisnes_name?: string
                    cert_BPS?: string | null
                    cert_DGI?: string | null
                    closing_date?: string | null
                    doc_BPS?: string
                    doc_DGI?: string
                    id_client?: string | null
                    id_companie?: string
                    id_taxpayer_type?: string | null
                    start_date?: string | null
                    tax_address?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "companies_id_client_fkey"
                        columns: ["id_client"]
                        isOneToOne: false
                        referencedRelation: "clients"
                        referencedColumns: ["id_client"]
                    },
                    {
                        foreignKeyName: "companies_id_taxpayer_type_fkey"
                        columns: ["id_taxpayer_type"]
                        isOneToOne: false
                        referencedRelation: "taxpayer_type"
                        referencedColumns: ["id_taxpayer_type"]
                    },
                ]
            }
            document_types: {
                Row: {
                    id_doc_type: string
                    name: string
                }
                Insert: {
                    id_doc_type?: string
                    name: string
                }
                Update: {
                    id_doc_type?: string
                    name?: string
                }
                Relationships: []
            }
            rate_value: {
                Row: {
                    content: Json
                    created_at: string
                    id_rate_value: string
                    name: string
                    updated_at: string | null
                    valid_from: string
                    valid_until: string | null
                }
                Insert: {
                    content: Json
                    created_at?: string
                    id_rate_value?: string
                    name: string
                    updated_at?: string | null
                    valid_from: string
                    valid_until?: string | null
                }
                Update: {
                    content?: Json
                    created_at?: string
                    id_rate_value?: string
                    name?: string
                    updated_at?: string | null
                    valid_from?: string
                    valid_until?: string | null
                }
                Relationships: []
            }
            taxes: {
                Row: {
                    created_at: string
                    description: string | null
                    id_tax: string
                    name: string
                    type: string | null
                }
                Insert: {
                    created_at?: string
                    description?: string | null
                    id_tax?: string
                    name: string
                    type?: string | null
                }
                Update: {
                    created_at?: string
                    description?: string | null
                    id_tax?: string
                    name?: string
                    type?: string | null
                }
                Relationships: []
            }
            taxes_rate_values: {
                Row: {
                    id: string
                    id_rate_value: string
                    id_tax: string
                }
                Insert: {
                    id?: string
                    id_rate_value: string
                    id_tax: string
                }
                Update: {
                    id?: string
                    id_rate_value?: string
                    id_tax?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "taxes_rate_values_id_rate_value_fkey"
                        columns: ["id_rate_value"]
                        isOneToOne: false
                        referencedRelation: "rate_value"
                        referencedColumns: ["id_rate_value"]
                    },
                    {
                        foreignKeyName: "taxes_rate_values_id_tax_fkey"
                        columns: ["id_tax"]
                        isOneToOne: false
                        referencedRelation: "taxes"
                        referencedColumns: ["id_tax"]
                    },
                ]
            }
            taxpayer_tax: {
                Row: {
                    id: string
                    id_tax: string
                    id_taxpayer_type: string
                }
                Insert: {
                    id?: string
                    id_tax: string
                    id_taxpayer_type: string
                }
                Update: {
                    id?: string
                    id_tax?: string
                    id_taxpayer_type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "taxpayer_tax_id_tax_fkey"
                        columns: ["id_tax"]
                        isOneToOne: false
                        referencedRelation: "taxes"
                        referencedColumns: ["id_tax"]
                    },
                    {
                        foreignKeyName: "taxpayer_tax_id_taxpayer_type_fkey"
                        columns: ["id_taxpayer_type"]
                        isOneToOne: false
                        referencedRelation: "taxpayer_type"
                        referencedColumns: ["id_taxpayer_type"]
                    },
                ]
            }
            taxpayer_type: {
                Row: {
                    id_taxpayer_type: string
                    name: string
                }
                Insert: {
                    id_taxpayer_type?: string
                    name: string
                }
                Update: {
                    id_taxpayer_type?: string
                    name?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
