'use client';

import { ConfigProvider, App, theme } from 'antd';

export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <App>{children}</App>
        </ConfigProvider>
    );
}
