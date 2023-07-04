import { useTableMergerer } from '@/utils/tableMergerer';
import { Table } from 'antd';
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

export default function Dashboard() {
	const [dataSource, setDataSource] = useState<typeof arr>([]);
	const tableMergerer = useTableMergerer<typeof arr[number]>();
	const columns: ColumnsType<typeof arr[number]> = [
		{
			title: 'mergeIdx',
			render(dom, row, idx) {
				return tableMergerer.render('index', `name-${row.name}`, idx);
			}
		},
		{
			title: '姓名',
			dataIndex: 'name',
			render: (dom, row, idx) => {
				return tableMergerer.render(dom, `name-${row.name}`, idx);
			}
		},
		{
			title: '年龄',
			dataIndex: 'age',
			render: (dom, row, idx) => {
				return tableMergerer.render(dom, `age-${row.age}`, idx);
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
