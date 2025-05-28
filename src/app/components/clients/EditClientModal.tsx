import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Client } from '@/app/types/clients';
import { updateClient } from '@/app/lib/queries/clients/updateClient';


interface EditClientModalProps {
    open: boolean;
    onClose: () => void;
    client: Client | null;
    onUpdate: () => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ open, onClose, client, onUpdate }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (client) {
            form.setFieldsValue(client);
        } else {
            form.resetFields();
        }
    }, [client, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (!client?.id_client) {
                throw new Error('ID de cliente no definido');
            }

            const updatedClient: Client = {
                ...client,
                ...values,
            };

            await updateClient(updatedClient);

            message.success('Cliente actualizado correctamente');
            onUpdate(); // Refrescar lista
            onClose();  // Cerrar modal
        } catch (err: any) {
            message.error(err.message || 'Error al actualizar el cliente');
        }
    };

    return (
        <Modal
            open={open}
            title="Editar Cliente"
            onCancel={onClose}
            onOk={handleSave}
            okText="Guardar"
            cancelText="Cancelar"
        >
            <Form layout="vertical" form={form}>
                <Form.Item name="full_name" label="Nombre completo" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="document_number" label="Número de documento" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Correo electrónico">
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="Teléfono">
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Dirección">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditClientModal;
