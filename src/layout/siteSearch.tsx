import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useState } from 'react';
const SiteSearch: React.FC<SimpleObject> = () => {
  const [searchHidden, setSearchHidden] = useState(true);
  const switchSearchHidden = () => {
    setSearchHidden(hidden => !hidden);
  };
  const styles: React.CSSProperties = {
    padding: searchHidden ? 0 : '',
    width: searchHidden ? 0 : 210
    // searchHidden &&
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} className="site-search-content">
      <Button onClick={switchSearchHidden} type="text" style={{ color: 'aliceblue', padding: '0 8px' }}>
        <SearchOutlined />
      </Button>
      <Input size="small" className="site-input" placeholder="react" style={styles} />
    </div>
  );
};
export default SiteSearch;
