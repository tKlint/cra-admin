import { useEffect, useRef, useState } from 'react';

export default function useDomScroll() {
  const [domSize, setDomSize] = useState({
    width: 0,
    height: 0,
    clientHeight: 0,
    clientWidth: 0
  });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (targetRef.current) {
        const { clientHeight, clientWidth, scrollHeight, scrollWidth } = targetRef.current;
        setDomSize({ width: scrollWidth, height: scrollHeight, clientHeight, clientWidth });
      }
    };

    const handleScroll = () => {
      if (targetRef.current) {
        setScrollPosition({
          x: targetRef.current.scrollLeft,
          y: targetRef.current.scrollTop
        });
      }
    };

    if (targetRef.current) {
      targetRef.current.addEventListener('scroll', handleScroll);
    }

    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 初始获取DOM尺寸和滚动位置
    handleResize();
    handleScroll();

    // 在组件卸载时移除事件监听器
    return () => {
      if (targetRef.current) {
        targetRef.current.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { domSize, scrollPosition, targetRef };
}
