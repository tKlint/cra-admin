import api from '@/service';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import React from 'react';

export default function MenuMgmt() {
  const columns: ProColumns<RoutesAPI.routes>[] = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: 'name',
      dataIndex: 'name'
    },
    {
      title: 'pathname',
      dataIndex: 'path'
    },
    {
      title: '组件路径',
      dataIndex: 'component'
    },
    {
      title: '菜单图标',
      dataIndex: 'icon'
    },
    {
      title: '重定向',
      dataIndex: 'redirect'
    },
    {
      title: '所属父级',
      dataIndex: 'parentId'
    },
    {
      title: '在布局中显示',
      dataIndex: 'layout',
      renderText: layout => (layout ? '是' : '否')
    },
    {
      title: '在菜单中显示',
      dataIndex: 'isShown',
      renderText: layout => (layout ? '是' : '否')
    }
  ];
  const fetchRoutes = async () => {
    const { data, total } = await api.getRoutes();
    return { data, total };
  };
  return (
    <div>
      <ProTable
        headerTitle="路由菜单"
        request={fetchRoutes}
        columns={columns}
        rowKey="id"
        expandable={{
          expandedRowRender: () => {
            return <span>ok</span>;
          },
          defaultExpandAllRows: true
        }}
      />
    </div>
  );
}
