import FallbackLoading from '@/components/FallbackLoading';
import LogoBox from '@/components/LogoBox';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { getMenuItems } from '@/helpers/Manu';
import { useAuth } from '@/hooks/useAuth';
import { Suspense } from 'react';
import AppMenu from './components/AppMenu';
import HoverMenuToggle from './components/HoverMenuToggle';
const VerticalNavigationBarPage = () => {
  const {
    role
  } = useAuth();
  const menuItems = getMenuItems(role);
  return <div className="main-nav">
    <LogoBox />
    <HoverMenuToggle />
    <SimplebarReactClient className="scrollbar" data-simplebar>
      <Suspense fallback={<FallbackLoading />}>
        <AppMenu menuItems={menuItems} />
      </Suspense>
    </SimplebarReactClient>
  </div>;
};
export default VerticalNavigationBarPage;