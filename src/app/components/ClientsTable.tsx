// components/ClientsTable.tsx
import React, { useState, useEffect } from 'react';
import { Spin, Alert, Button, Collapse, Descriptions, Typography, Divider, Modal, message } from 'antd'; // Importa Modal y message
import { ReloadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'; // Importa iconos de edición y eliminación
import { supabase } from '../lib/supabaseClient'; // Asegúrate de que la ruta sea correcta

const { Text } = Typography;
const { confirm } = Modal; // Para el modal de confirmación de eliminación

// Define el tipo para un cliente con el campo anidado de document_types
interface Client {
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

const ClientsTable: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false); // Nuevo estado para indicar si se está eliminando

    const fetchClients = async () => {
        setLoading(true);
        setError(null);
        try {
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
                throw error;
            }
            setClients(data as Client[]);
        } catch (err: any) {
            console.error("Error fetching clients:", err.message);
            setError("Error al cargar los clientes: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleEditClient = (clientId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Evita que se colapse/despliegue el panel del Collapse
        message.info(`Editar cliente con ID: ${clientId}`);
        // Aquí puedes agregar la lógica para editar, por ejemplo:
        // - Abrir un modal con un formulario prellenado para editar el cliente.
        // - Redirigir a una página de edición: router.push(`/dashboard/clients/edit/${clientId}`);
    };

    const handleDeleteClient = (clientId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Evita que se colapse/despliegue el panel del Collapse
        confirm({
            title: '¿Estás seguro de que quieres eliminar este cliente?',
            icon: <ExclamationCircleOutlined />,
            content: 'Esta acción no se puede deshacer.',
            okText: 'Sí, Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                setDeleting(true);
                try {
                    const { error } = await supabase
                        .from('clients')
                        .delete()
                        .eq('id_client', clientId);

                    if (error) {
                        throw error;
                    }
                    message.success('Cliente eliminado correctamente.');
                    fetchClients(); // Refresca la lista de clientes después de eliminar
                } catch (err: any) {
                    console.error("Error deleting client:", err.message);
                    message.error("Error al eliminar el cliente: " + err.message);
                } finally {
                    setDeleting(false);
                }
            },
            onCancel() {
                console.log('Eliminación cancelada');
            },
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <Spin size="large" tip="Cargando clientes..." fullscreen />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                action={
                    <Button size="small" danger onClick={fetchClients}>
                        Reintentar
                    </Button>
                }
            />
        );
    }

    // Prepara los items para el Collapse
    const collapseItems = clients.map(client => ({
        key: client.id_client, // Cada item necesita una key única
        label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Text strong>{client.full_name}</Text>
                <div onClick={e => e.stopPropagation()}> {/* Importante: detener la propagación aquí también para los íconos */}
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => handleEditClient(client.id_client, e)}
                        style={{ marginRight: 8 }}
                        size="small"
                        title="Editar cliente"
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => handleDeleteClient(client.id_client, e)}
                        danger
                        size="small"
                        title="Eliminar cliente"
                        loading={deleting} // Deshabilitar el botón mientras se elimina
                    />
                </div>
            </div>
        ), // El "header" visible con el nombre y los botones
        children: ( // El contenido que se despliega
            <>
                <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
                    <Descriptions.Item label="Documento">{client.document_number}</Descriptions.Item>
                    <Descriptions.Item label="Tipo Doc.">
                        {client.document_types?.name || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {client.email || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Teléfono">
                        {client.phone || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dirección">
                        {client.address || 'N/A'}
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
            </>
        ),
    }));

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={fetchClients}
                    loading={loading}
                >
                    Refrescar Clientes
                </Button>
            </div>
            {/* Pasamos el array de items a la prop 'items' del Collapse */}
            <Collapse accordion items={collapseItems} />
        </div>
    );
};

export default ClientsTable;