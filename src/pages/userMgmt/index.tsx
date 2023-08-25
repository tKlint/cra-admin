import React, { useRef } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';

import './style.module.less';
import { Button } from 'antd';
import api from '@/service';

const UserMgmt: React.FC = () => {
  const ctlRef = useRef<AbortController | null>(null);
  const columns: ProColumns[] = [
    {
      title: '用户账号',
      dataIndex: 'loginId'
    }
  ];
  const sendRequestHandle = async () => {
    const [reqIns, ctl] = api.cancellation();
    ctlRef.current = ctl;
    await reqIns;
  };
  const abortRequestHandle = () => {
    if (ctlRef.current !== null) {
      ctlRef.current.abort();
    }
  };
  return (
    <div className="page-UserMgmt">
      <ProTable columns={columns} />
      <Button onClick={sendRequestHandle}>send a request</Button>
      <Button onClick={abortRequestHandle}>abort a request</Button>
    </div>
  );
};
export default UserMgmt;
