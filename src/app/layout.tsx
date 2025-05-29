import '@ant-design/v5-patch-for-react-19';
import './globals.css';
import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AuthProvider } from './context/AuthContext';
import { AntdThemeProvider } from './components/AntdThemeProvider';
import { App } from 'antd';

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
          <AntdThemeProvider>
            <App>
              <AuthProvider>{children}</AuthProvider>
            </App>
          </AntdThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}