import { getDocumentTypes } from "@/app/lib/queries/clients/documentTypes";
import { Client, document_types } from "@/app/types/clients";
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from "antd";
import { useState, useEffect } from "react";

type NewClientDrawerProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (client: Client) => void;
};

const NewClientDrawer: React.FC<NewClientDrawerProps> = ({ open, onClose, onCreate }) => {
    const [documents, setDocuments] = useState<document_types[]>([]);
    const [error, setError] = useState<string | null>(null);


    const fetchDocumentTypes = async () => {
        try {
            const data = await getDocumentTypes();
            setDocuments(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error inesperado');
        } finally {
            setError(null);
        }
    };

    // Cargar los tipos de documentos al montar el componente

    useEffect(() => {
        if (open && documents.length === 0) {
            fetchDocumentTypes();
        }
    }, [open]);

    const onFinish = (values: Client) => {
        onCreate(values); // Llamar a la función para manejar el nuevo cliente
        onClose(); // Cerrar el drawer después de enviar
    }

    return (
        <>
            <Drawer
                title="Create a new client"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                <Form
                    id="new-client-form"
                    layout="vertical"
                    requiredMark={false}
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="full_name"
                                label="Nombre Completo"
                                rules={[{ required: true, message: 'Ingrese el nombre completo' }]}
                            >
                                <Input placeholder="Ej: Juan Pérez" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="id_doc_type"
                                label="Tipo de documento"
                                rules={[{ required: true, message: 'Seleccione un tipo de documento' }]}
                            >
                                <Select placeholder="Seleccione tipo">
                                    {documents.map(doc => (
                                        <Select.Option key={doc.id_doc_type} value={doc.id_doc_type}>
                                            {doc.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="document_number"
                                label="Número de documento"
                                rules={[{ required: true, message: 'Ingrese el número de documento' }]}
                            >
                                <Input placeholder="Ej: 12345678" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ type: 'email', message: 'Ingrese un email válido' }]}
                            >
                                <Input placeholder="Ej: ejemplo@email.com" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Teléfono"
                            >
                                <Input placeholder="Ej: +54 9 11 1234-5678" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="address"
                                label="Dirección"
                            >
                                <Input placeholder="Ej: Calle Falsa 123" />
                            </Form.Item>
                        </Col>  
                    </Row>
                </Form>
                <Space style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button htmlType="submit" type="primary" form="new-client-form">
                        Guardar
                    </Button>
                </Space>
            </Drawer>
        </>
    );
};

export default NewClientDrawer;