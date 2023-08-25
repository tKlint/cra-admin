import { Avatar } from 'antd';
import React from 'react';
import { useAppSelector } from '@/store/hooks';

const UseAvatar: React.FC<SimpleObject> = () => {
  const user = useAppSelector(state => state.userReducer);
  return (
    <div>
      <Avatar src={user.avatarUrl} size="small" />
      <span>{user.userFullNameCn}</span>
    </div>
  );
};

export default UseAvatar;
