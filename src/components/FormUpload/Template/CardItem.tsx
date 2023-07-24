import React from 'react';
import { Image, UploadFile } from 'antd';
import {
  FileZipOutlined,
  FilePdfOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import './template.less';

export type ICardItemProps = {
  file: UploadFile;
  fileList: UploadFile[];
  actions: {
    download: () => void;
    preview: () => void;
    remove: () => void;
  };
  width?: number;
  className?: string;
};
export function getFileThumbUrl(fileType: string) {
  const iconStyle: React.CSSProperties = {
    fontSize: '56px'
  };
  const fileTypeThumbUrlMap = {
    'application/zip': <FileZipOutlined style={iconStyle} />,
    'application/pdf': <FilePdfOutlined style={iconStyle} />,
    'video/mp4': <VideoCameraOutlined style={iconStyle} />,
    'audio/mpeg': <AudioOutlined style={iconStyle} />
  };
  return fileTypeThumbUrlMap[fileType as keyof typeof fileTypeThumbUrlMap] || <FileTextOutlined style={iconStyle} />;
}
export default function CardTemplate(props: ICardItemProps) {
  const { file, actions, className = '' } = props;
  return (
    <div className={`upload-template-v1 ${className}`}>
      <div className={`upload-template-wrap  ${file.status === 'error' ? 'upload-error-wrap' : ''}`}>
        <div className="file-info-content">
          {file.url && file.type?.startsWith('image') ? <Image src={file.url} /> : getFileThumbUrl(file.type || '')}
          <div className="file-info-wrap">
            <p className="file-name" title={file.name}>
              {file.name}
            </p>
            <span className="file-size">{((file.size || 0) / 1000).toFixed(2)}K</span>
          </div>
        </div>
        <div className="file-action-content">
          <div>
            <DeleteOutlined style={{ fontSize: '18px', marginRight: 8 }} onClick={actions.remove} />
            <DownloadOutlined style={{ fontSize: '18px' }} onClick={actions.download} />
          </div>
        </div>
      </div>
      <div
        className="upload-template-progress-mask"
        style={{ display: file.status === 'uploading' ? 'block' : 'none' }}
      >
        <div className="progress-wrap">
          <div className="progress" style={{ width: `${file.percent}%` }} />
          <div className="progress-bar" />
        </div>
      </div>
    </div>
  );
}
