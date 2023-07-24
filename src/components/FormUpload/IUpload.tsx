import { createFileBase64 } from '@/utils/tools';
import { Progress, Upload, UploadFile, UploadProps } from 'antd';
import { ItemRender } from 'antd/lib/upload/interface';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RcFile } from 'antd/lib/upload';

type RenderProps = (loadding: boolean) => React.ReactNode;

type LikeFile = {
  uid: string;
  url: string;
  name: string;
};

type IFile = Partial<LikeFile> & UploadFile;

type UploadInfo = {
  file: IFile;
  fileList: IFile[];
};

export type IUploadProps = {
  showProgress?: boolean;
  children: React.ReactNode | RenderProps;
  value?: IFile[];
  onChange?: (fileList: IFile[]) => void;
  uploadProps?: Omit<UploadProps, 'value' | 'onChange'>;
  beforeChange?: (info: UploadInfo, updateProgress: (uid: string, nextPercent: number) => void) => Promise<void>;
  templateRender?: ItemRender;
};

export function isRenderProps(children: any): children is RenderProps {
  return typeof children === 'function';
}

const IUpload: React.FC<IUploadProps> = props => {
  const { value, children, uploadProps = {}, onChange, beforeChange, showProgress, templateRender } = props;
  const [loadding, setLoadding] = useState(false);
  const [files, setFiles] = useState<IFile[]>();
  const filesData = useRef(files);
  /**
   * 更新文件上传进度
   * @param uid 文件uid
   * @param percent 进度百分比
   */
  const updateProgress = (uid: string, percent: number) => {
    if (showProgress && filesData.current) {
      filesData.current.forEach(file => {
        if (file.uid === uid) {
          file.percent = percent;
          file.status = percent === 100 ? 'success' : file.status;
        }
      });
      setupFileList([...filesData.current]);
      onChange?.(filesData.current);
    }
  };
  const setFileBase64 = async (uid: string, fileList: IFile[]) => {
    const targetFile = fileList.find(file => file.uid === uid);
    if (targetFile && targetFile.originFileObj) {
      const [url, err] = await createFileBase64(targetFile.originFileObj);
      if (err) {
        return console.error('base64生成失败');
      }
      targetFile.url = url;
      targetFile.thumbUrl = url;
    }
  };
  /**
   * 拦截上传
   * @description 可以在这里执行文件上传到服务器,上传进度更新等
   */
  const interceptorUpload = async ({ file, fileList }: UploadInfo) => {
    let hasErr = false;
    if (file.status !== 'removed') {
      await setFileBase64(file.uid, fileList);
    }
    if (beforeChange) {
      setLoadding(true);
      try {
        await beforeChange({ file, fileList }, updateProgress);
      } catch (error) {
        hasErr = true;
      } finally {
        setLoadding(false);
      }
    }
    setFileStatus(file.uid, fileList, hasErr ? 'error' : 'done');
    onChange?.(fileList);
  };
  /**
   * 设置文件状态
   * @param uid 文件uid
   * @param fileList
   * @param status
   */
  const setFileStatus = (uid: string, fileList: UploadFile[], status: UploadFile['status']) => {
    fileList.forEach(file => {
      if (file.uid === uid) {
        file.status = status;
      }
    });
  };
  /**
   * Upload onChange回调
   */
  const fileChangeHandle: UploadProps['onChange'] = async ({ file, fileList }) => {
    fileList.forEach(fileItem => {
      if (file.uid === fileItem.uid) {
        fileItem.status = 'uploading';
      }
    });
    setFileStatus(file.uid, fileList, 'uploading');
    setupFileList(fileList);
    filesData.current = fileList;
    await interceptorUpload({ file, fileList });
  };
  /**
   * 自定义上传
   */
  const beforUploadHandle: UploadProps['beforeUpload'] = file => {
    return false;
  };

  /**
   * 设置文件列表
   * @description 由于React任务调度机制不能及时获取最新状态, 使用filesData存放最新数据
   * @param fileList
   */
  const setupFileList = (fileList?: UploadFile[]) => {
    filesData.current = fileList;
    setFiles(fileList);
  };

  useEffect(() => {
    setupFileList(value);
  }, [value]);
  const renderChildren = useMemo(() => {
    if (isRenderProps(children)) {
      return children(loadding);
    }
    return children;
  }, [children, loadding]);
  return (
    <Upload
      fileList={files}
      beforeUpload={beforUploadHandle}
      disabled={loadding}
      onChange={fileChangeHandle}
      {...uploadProps}
      itemRender={
        templateRender
          ? templateRender
          : (dom, file) => {
              if (file.status === 'uploading' && showProgress) {
                return <Progress percent={file.percent} type="dashboard" />;
              }
              return dom;
            }
      }
    >
      {renderChildren}
    </Upload>
  );
};

export default IUpload;
