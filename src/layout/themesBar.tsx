import { Button, ConfigProvider, Popover } from 'antd';
import { FormattedMessage } from 'react-intl';
import { BgColorsOutlined } from '@ant-design/icons';
import { SimpleObject } from '../types/global';
import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { getThemesConfig } from '@/utils/getUserConfig';
import storage from '../utils/Storage';
const ThemesBar: React.FC<SimpleObject> = () => {
  const { primaryColor } = getThemesConfig();
  const [color, setColor] = useState(primaryColor || '');
  const [hovered, setHovered] = useState(false);
  const setThemePrimaryColor = () => {
    storage.set('theme_primaryColor', color);
    ConfigProvider.config({
      theme: {
        primaryColor: color
      }
    });
    setHovered(false);
  };
  const handleHoverChange = (open: boolean) => {
    setHovered(open);
  };
  const content = (
    <div style={{ position: 'relative' }}>
      <SketchPicker
        color={color}
        presetColors={color === primaryColor ? [primaryColor] : [primaryColor, color]}
        onChange={({ hex }) => {
          setColor(hex);
        }}
      />
      <Button
        type="primary"
        size="small"
        style={{ position: 'absolute', bottom: 8, right: 8 }}
        onClick={setThemePrimaryColor}
      >
        <FormattedMessage id="modal.confirm" />
      </Button>
    </div>
  );

  return (
    <Popover
      open={hovered}
      onOpenChange={handleHoverChange}
      trigger="click"
      content={content}
      placement="bottomRight"
      title={<FormattedMessage id="layout.change-theme-color" />}
    >
      <BgColorsOutlined />
    </Popover>
  );
};
export default ThemesBar;
