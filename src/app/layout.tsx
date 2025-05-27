import '@ant-design/v5-patch-for-react-19';
import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { AuthProvider } from './context/AuthContext';

export const metadata: Metadata = {
  title: 'ContableSis',
  description: 'Sistema Contable',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AntdRegistry>
          <ConfigProvider>
            <App>
              <AuthProvider>{children}</AuthProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}