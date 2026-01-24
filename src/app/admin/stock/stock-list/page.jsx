import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import StockList from './component/StockList';
const StockListPage = () => {
    return <>
        <PageTItle title="Stock List" />
        <Row>
            <Col xl={12}>
                <StockList />
            </Col>
        </Row>
    </>;
};
export default StockListPage;