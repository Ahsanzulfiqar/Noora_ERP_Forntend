import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useLayoutContext } from '@/context/useLayoutContext';
import useViewPort from '@/hooks/useViewPort';
import { useEffect } from 'react';
const HoverMenuToggle = () => {
  const {
    menu: {
      size
    },
    changeMenu: {
      size: changeMenuSize
    }
  } = useLayoutContext();
  const {
    width
  } = useViewPort();
  useEffect(() => {
    if (width <= 1140) {
      if (size !== 'hidden') changeMenuSize('hidden');
    }
  }, [width]);
  const handleHoverMenu = () => {
    if (size === 'sm-hover-active') changeMenuSize('sm-hover');else changeMenuSize('sm-hover-active');
  };
  const icon = size === 'sm-hover-active'
    ? 'solar:alt-arrow-left-bold-duotone'
    : 'solar:alt-arrow-right-bold-duotone';
  return <button type="button" onClick={handleHoverMenu} className="button-sm-hover" aria-label="Toggle Sidebar">
      <IconifyIcon height={22} width={22} icon={icon} className="button-sm-hover-icon" />
    </button>;
};
export default HoverMenuToggle;