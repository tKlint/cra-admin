import FormUpload, { FormUploadProps } from '@/components/FormUpload';
import { IUploadProps } from '@/components/FormUpload/IUpload';
import CardTemplate from '@/components/FormUpload/Template/CardItem';
import { request } from '@/utils/request';
import { Button, Form, FormItemProps, Input, message } from 'antd';
import { RcFile } from 'antd/lib/upload';

import './style.less';
import styles from './style.module.css';

export default function About() {
  const uploadFile = (file: RcFile, callback: (percent: number) => void) => {
    const data = new FormData();
    data.append('attachmentFile', file);
    return request({
      data,
      method: 'POST',
      onUploadProgress(event) {
        callback(Math.floor((event.loaded / event.total) * 100));
      },
      url: '/gateway/admin/collection/pd/dataUpload/uploadFileNotSaveAttachmentFile'
    });
  };
  const fileChangeHandle: IUploadProps['beforeChange'] = async ({ file, fileList }, updateProgress) => {
    if (file.status === 'removed') {
      return;
    }
    const data = new FormData();
    data.append('attachmentFile', file.originFileObj || (file as RcFile));
    const targetFile = fileList.find(curFile => curFile.uid === file.uid);
    if (targetFile) {
      try {
        await uploadFile(targetFile.originFileObj || (file as RcFile), percent => {
          updateProgress(file.uid, percent);
        });
        message.success('上传成功');
      } catch (er) {
        throw new Error('上传失败');
      }
    }
  };

  const formItemProps: FormItemProps = {
    rules: [{ required: true }]
    // templateRender: (params = {}) => <CardItem {...params}/>
  };
  const uploadProps: FormUploadProps['uploadProps'] = {
    showProgress: true,
    beforeChange: fileChangeHandle,
    templateRender: (_, file, files, action) => {
      return <CardTemplate file={file} fileList={files} actions={action} />;
    },
    uploadProps: {
      className: 'upload-list-wrap'
    }
  };
  return (
    <div style={{ padding: 16 }}>
      <Form>
        <Form.Item name="number" label="姓名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <FormUpload name="file" label="文件" formItemProps={formItemProps} uploadProps={uploadProps}>
          <Button type="primary" size="large">
            上传文件
          </Button>
        </FormUpload>
        <Form.Item>
          <Button htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
      <span className={`${styles.helloText} font-bold underline`}>hello every one</span>
      <div className="bg-blue-500 bg-red-500">click</div>
    </div>
  );
}
