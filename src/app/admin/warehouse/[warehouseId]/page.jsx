import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import WarehouseDetails from './components/WarehouseDetails';

const ProductDetailsPage = () => {
  return (
    <>
      <PageTItle title="Ware House Details" />
      <WarehouseDetails />
    </>
  );
};

export default ProductDetailsPage;