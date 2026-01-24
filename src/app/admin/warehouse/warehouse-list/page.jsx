import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import WareHouseList from './Components/WareHouseList';
const ProductListPage = () => {
  return <>
      <PageTItle title="WareHouse List" />
      <Row>
        <Col xl={12}>
          <WareHouseList />
        </Col>
      </Row>
    </>;
};
export default ProductListPage;