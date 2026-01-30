import FallbackLoading from '@/components/FallbackLoading';
// import Footer from '@/components/layout/Footer';
import Preloader from '@/components/Preloader';
import Box from '@mui/material/Box';
import { Col, Row } from 'react-bootstrap';
import { lazy, Suspense } from 'react';
const VerticalNavigationBar = lazy(() => import('@/components/layout/VerticalNavigationBar/page'));
const TopNavigationBar = lazy(() => import('@/components/layout/TopNavigationBar/page'));
const AdminLayout = ({
  children
}) => {
  return <div className="wrapper">
    <Suspense fallback={<FallbackLoading />}>
      <TopNavigationBar />
    </Suspense>

    <Suspense fallback={<FallbackLoading />}>
      <VerticalNavigationBar />
    </Suspense>

    <div className="page-content">
      <div className="container-fluid">
        <Suspense fallback={<Preloader />}>{children}</Suspense>
      </div>

      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0,  padding: '0rem 1rem 0.5rem 1rem', textAlign: 'center'  }}>

        © NooraERP.

      </Box>
    </div>
  </div>;
};
export default AdminLayout;