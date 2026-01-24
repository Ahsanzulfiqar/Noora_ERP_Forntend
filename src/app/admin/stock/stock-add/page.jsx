import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import AddStock from './components/AddStock';
const ProductAddPage = () => {
  return <>
    <PageTItle title="Create post to stock" />
    <Row>
      <AddStock />
    </Row>
  </>;
};
export default ProductAddPage;