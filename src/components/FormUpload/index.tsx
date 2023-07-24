import { Form, FormItemProps } from 'antd';
import React from 'react';
import IUpload, { IUploadProps } from './IUpload';

export type FormUploadProps = {
  formItemProps?: FormItemProps;
  name?: string;
  label?: string;
  children: IUploadProps['children'];
  uploadProps?: Omit<IUploadProps, 'children'>;
};

const FormUpload: React.FC<FormUploadProps> = props => {
  const { formItemProps = {}, name, label, children, uploadProps = {} } = props;
  return (
    <Form.Item {...formItemProps} name={name} label={label}>
      <IUpload {...uploadProps}>{children}</IUpload>
    </Form.Item>
  );
};

export default FormUpload;
