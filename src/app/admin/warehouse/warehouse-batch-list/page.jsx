import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import WareHouseBatchList from './component/WareHouseBatchList';
const WareHouseBatchListPage = () => {
    return <>
        <PageTItle title="WareHouse Batch List" />
        <Row>
            <Col xl={12}>
                <WareHouseBatchList />
            </Col>
        </Row>
    </>;
};
export default WareHouseBatchListPage;