'use client'
import { Button, Checkbox, Flex, Form, Input, App, notification, theme } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LoginFormValues {
    email: string;
    password: string;
    remember: boolean;
}


export default function LoginForm() {
    const router = useRouter();
    const { login, loading } = useAuth();
    const { message } = App.useApp();
    const [api, contextHolder] = notification.useNotification();


    const onFinish = async (values: LoginFormValues) => {
        const { email, password } = values;
        const { success, error } = await login(email, password);
        if (success) {
            message.success('Inicio de sesión exitoso');
            router.push('/dashboard')

        } else {
            message.error(error?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <>
            <div style={{
                boxShadow: '0 4px 12px rgba(58,173,215,0.8)',
                padding: '40px',
                borderRadius: '8px',
                
            }}>
                {contextHolder}
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Por favor ingresa tu correo electrónico' },
                            { type: 'email', message: 'El correo no es válido' }
                        ]}>
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                            aria-label="Correo electrónico"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Contraseña" />
                    </Form.Item>
                    <Form.Item>
                        <Flex justify="space-between" align="center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Recordarme</Checkbox>
                            </Form.Item>
                            <Link href="">Olvidé mi contraseña</Link>
                        </Flex>
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit" loading={loading}>
                            Iniciar sesión
                        </Button>
                        o <Link href="/register">¡Regístrate ahora!</Link>
                    </Form.Item>
                </Form>
            </div>
        </>
    );

};