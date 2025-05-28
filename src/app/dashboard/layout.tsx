'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu, Button, theme, Dropdown, Space, Avatar, Spin } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    DollarCircleOutlined,
    TransactionOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta de importación si es necesario
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Footer } from 'antd/es/layout/layout';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const { logout, isAuthenticated, loading, user } = useAuth(); // Obtén user y loading
    const router = useRouter();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const pathname = usePathname();

    // Si no está autenticado y no está cargando, redirige al login
    useEffect(() => {
        const redirectIfNotAuthenticated = () => {
            if (!loading && !isAuthenticated) {
                router.push('/');
            }
        };
        redirectIfNotAuthenticated();
    }, [isAuthenticated, loading, router]);



    const menuItems = useMemo(() => [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
        },
        {
            key: '/dashboard/clients',
            icon: <DollarCircleOutlined />,
            label: <Link href="/dashboard/clients">Clientes</Link>,
        },
        {
            key: '/dashboard/companies',
            icon: <TransactionOutlined />,
            label: <Link href="/dashboard/companies">Empresas</Link>,
        },
        // Agrega más ítems de menú según tus funcionalidades
    ], [router]);

    const goTo = (path: string) => () => router.push(path);

    const profileMenuItems = useMemo(() => [
        {
            key: '1',
            label: 'Perfil',
            icon: <UserOutlined />,
            onClick: goTo('/dashboard/profile')
        },
        {
            key: '2',
            label: 'Configuración',
            icon: <SettingOutlined />,
            onClick: goTo('/dashboard/settings')
        },
        {
            key: '3',
            label: 'Cerrar Sesión',
            icon: <LogoutOutlined />,
            onClick: async () => {
                await logout(); // Llama a la función logout del contexto
                // La redirección es manejada por AuthContext
            }
        },
    ], [logout, router]);

    // Si está cargando o no autenticado, muestra un spinner o null
    if (loading || !isAuthenticated) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Spin size="large" tip="Verificando autenticación...">
                    <div style={{ minHeight: 100 }} />
                </Spin>
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" arrow>
                        <Button type="link" onClick={(e) => e.preventDefault()} style={{ marginRight: 24 }}>
                            <Space>
                                <Avatar icon={<UserOutlined />} />
                                <span>{user?.email || 'Usuario'}</span> {/* Muestra el email del usuario */}
                                {/* <Avatar style={{ backgroundColor: '#87d068' }}>
                                    {user?.email?.[0]?.toUpperCase() || 'U'}
                                </Avatar> */}
                            </Space>
                        </Button>
                    </Dropdown>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
                <Footer>
                    <div style={{ textAlign: 'center' }}>
                        © {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
                    </div>
                </Footer>
            </Layout>
        </Layout>
    );
}