import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import AddEditproject from './components/AddEditproject';
const ProductAddPage = () => {
  return <>
    <PageTItle title="Create project" />
    <Row>
      <AddEditproject />
    </Row>
  </>;
};
export default ProductAddPage;