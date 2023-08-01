import { useTableMergerer } from '@/utils/tableMergerer';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';

const arr = [
  {
    id: 'id-1',
    name: 'a',
    age: 18
  },
  {
    id: 'id-2',
    name: 'a',
    age: 19
  },
  {
    id: 'id-3',
    name: 'b',
    age: 19
  },
  {
    id: 'id-4',
    name: 'a',
    age: 18
  },
  {
    id: 'id-7',
    name: 'a',
    age: 18
  }
];

type DataType = typeof arr;
export default function Dashboard() {
  const [dataSource, setDataSource] = useState<DataType>([]);
  const tableMergerer = useTableMergerer<DataType[number]>();
  const columns: ColumnsType<DataType[number]> = [
    {
      title: 'mergeIdx',
      render(_, row, idx) {
        return tableMergerer.getCurRowMergeData(`name-${row.name}`, idx).mergeIndex;
      },
      onCell: (row, idx = 0) => {
        return tableMergerer.render(null, `name-${row.name}`, idx).props;
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: dom => {
        return <Tag>{dom}</Tag>;
      },
      onCell: (row, idx = 0) => {
        return tableMergerer.render(null, `name-${row.name}`, idx).props;
      }
    },
    {
      title: '年龄',
      dataIndex: 'age',
      onCell: (row, idx = 0) => {
        return tableMergerer.render(null, `age-${row.age}`, idx).props;
      }
    },
    {
      title: 'index',
      render(value, record, index) {
        return index + 1;
      }
    }
  ];
  useEffect(() => {
    setDataSource(arr);
    tableMergerer.setMergeData(arr, 'id', 'name', 'age');
  }, []);

  return (
    <div>
      Dashboard
      <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={false} />
    </div>
  );
}
