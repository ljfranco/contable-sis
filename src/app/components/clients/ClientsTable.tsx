import React, { useState, useEffect } from 'react';
import {
    Spin, Alert, Button, Collapse, Descriptions, Typography, Divider, Modal, message, FloatButton,
    App
} from 'antd';
import {
    ReloadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UserAddOutlined
} from '@ant-design/icons';
import { supabase } from '../../lib/supabaseClient';
import { Client } from '@/app/types/clients';
import { getClients } from '@/app/lib/queries/clients/getClients';
import EditClientModal from './EditClientModal';
import NewClientDrawer from './NewClientDrawer';
import { newClient } from '@/app/lib/queries/clients/newClient';

const { Text } = Typography; // Desestructuración de Typography

const ClientsTable: React.FC = () => {
    // --- Estados del componente ---
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isNewClientDrawerOpen, setIsNewClientDrawerOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);
    const { message } = App.useApp();

    // --- Funciones de Fetching y Manejo de Datos ---
    const fetchClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClients();
            setClients(data);
        } catch (err: any) {
            console.error("Error al cargar clientes:", err); // Mensaje más específico
            setError(err.message || 'Error inesperado al cargar clientes.');
        } finally {
            setLoading(false);
        }
    };

    // --- Efecto de Carga Inicial ---
    useEffect(() => {
        fetchClients();
    }, []); // Se ejecuta solo una vez al montar el componente

    // --- Manejadores de Eventos ---
    const handleEditClient = (clientId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Previene que el panel del Collapse se cierre/abra
        const client = clients.find(c => c.id_client === clientId);
        if (client) {
            setSelectedClient(client);
            setIsEditModalOpen(true);
        }
    };

    const handleNewClient = () => {
        setIsNewClientDrawerOpen(true);
    };

    const handleDeleteClient = (clientId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Previene que el panel del Collapse se cierre/abra
        setClientToDelete(clientId);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!clientToDelete) {
            message.error("No se ha seleccionado ningún cliente para eliminar."); // Mensaje si no hay ID
            return;
        }

        setDeleting(true);
        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id_client', clientToDelete);

            if (error) {
                throw error;
            }
            message.success('Cliente eliminado correctamente.');
            fetchClients(); // Refresca la lista de clientes
            setIsDeleteConfirmModalOpen(false); // Cierra el modal
            setClientToDelete(null); // Limpia el ID del cliente a eliminar
        } catch (err: any) {
            console.error("Error al eliminar cliente:", err.message);
            message.error("Error al eliminar el cliente: " + err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteConfirmModalOpen(false); // Cierra el modal
        setClientToDelete(null); // Limpia el ID del cliente a eliminar
        console.log('Eliminación de cliente cancelada.'); // Mensaje más descriptivo
    };

    // --- Renderizado Condicional de Estados de Carga/Error ---
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

    // --- Preparación de Items para Collapse ---
    const collapseItems = clients.map(client => ({
        key: client.id_client, // Cada item necesita una key única
        label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Text strong>{client.full_name}</Text>
                <div onClick={e => e.stopPropagation()}> {/* Importante: detener la propagación aquí */}
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
                        loading={deleting && clientToDelete === client.id_client} // Solo carga el botón del cliente que se está eliminando
                    />
                </div>
            </div>
        ),
        children: (
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

    // --- Renderizado Principal del Componente ---
    return (
        <div>
            {/* Botón de Refrescar Clientes */}
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

            {/* Modal para Editar Cliente */}
            <EditClientModal
                open={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedClient(null);
                }}
                client={selectedClient}
                onUpdate={fetchClients}
            />

            {/* Componente Collapse para mostrar la lista de clientes */}
            <Collapse accordion items={collapseItems} />

            {/* Botón Flotante para Nuevo Cliente */}
            <FloatButton
                icon={<UserAddOutlined />}
                type="primary"
                style={{ insetBlockEnd: 108 }}
                onClick={handleNewClient} // Llamada directa a la función
                tooltip={{
                    title: 'Nuevo Cliente',
                    color: 'blue',
                    placement: 'top',
                }}
            />

            {/* Drawer para Crear Nuevo Cliente */}
            <NewClientDrawer
                open={isNewClientDrawerOpen}
                onClose={() => setIsNewClientDrawerOpen(false)}
                onCreate={async (newClientData: Client) => {
                    try {
                        await newClient(newClientData);
                        message.success("Cliente creado correctamente");
                        fetchClients();
                        setIsNewClientDrawerOpen(false);
                    } catch (err: any) {
                        message.error("Error al crear cliente: " + err.message);
                    }
                }}
            />

            {/* Modal de Confirmación de Eliminación Personalizado */}
            <Modal
                title={
                    <span style={{ color: '#faad14' }}>
                        <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                        ¿Estás seguro de que quieres eliminar este cliente?
                    </span>
                }
                open={isDeleteConfirmModalOpen}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okText="Sí, Eliminar"
                okType="danger"
                cancelText="Cancelar"
                confirmLoading={deleting} // Muestra el loading en el botón OK mientras se elimina
            >
                <p>Esta acción no se puede deshacer.</p>
                {clientToDelete && (
                    <p>
                        Estás a punto de eliminar al cliente con ID: <strong>{clientToDelete}</strong>.
                    </p>
                )}
            </Modal>
        </div>
    );
};

export default ClientsTable;