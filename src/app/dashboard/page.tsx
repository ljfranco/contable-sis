// dashboard page
// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Table } from 'antd';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cotizaciones')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener cotizaciones:', err);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      sorter: (a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    },
    {
      title: 'Compra',
      dataIndex: 'compra',
      key: 'compra',
    },
    {
      title: 'Venta',
      dataIndex: 'venta',
      key: 'venta',
    },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="fecha"
        loading={loading}
        pagination={false}
        rowHoverable={true}
        showSorterTooltip={true}
      />
    </div>
  );
}
