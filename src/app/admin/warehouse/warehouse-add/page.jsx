import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import AddWareHouse from './components/AddWareHouse';
const ProductAddPage = () => {
  return <>
    <PageTItle title="Create WareHouse" />
    <Row>
      <AddWareHouse />
    </Row>
  </>;
};
export default ProductAddPage;