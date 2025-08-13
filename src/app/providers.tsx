'use client';
import '@ant-design/v5-patch-for-react-19'; // << DEBE ir antes de cualquier import de antd
import { ConfigProvider } from 'antd';
import esES from 'antd/es/locale/es_ES';
import 'dayjs/locale/es';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ConfigProvider locale={esES}>{children}</ConfigProvider>;
}
