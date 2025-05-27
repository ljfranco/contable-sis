'use client'
import { Button, Checkbox, Flex, Form, Input, App, notification } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface LoginFormValues {
    email: string;
    password: string;
    remember: boolean;
}


export default function LoginForm() {
    const { login, loading } = useAuth();
    const { message } = App.useApp();
    const [api, contextHolder] = notification.useNotification();

    const onFinish = async (values: LoginFormValues) => {
        const { email, password } = values;
        const { success, error } = await login(email, password);
        if (success) {
            message.success('Inicio de sesión exitoso');
            // La redirección se maneja en AuthContext
        } else {
            message.error(error || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

return (
    <>
        {contextHolder}
        <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={onFinish}
        >
            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <a href="">Forgot password</a>
                </Flex>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Log in
                </Button>
                or <a href="">Register now!</a>
            </Form.Item>
        </Form>
    </>
);

};