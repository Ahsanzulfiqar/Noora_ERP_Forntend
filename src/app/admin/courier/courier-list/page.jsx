import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import CourierList from './Components/courierList';

const CourierListPage = () => {
    return <>
        <PageTItle title="Courier List" />
        <Row>
            <Col xl={12}>
                <CourierList />
            </Col>
        </Row>
    </>;
};
export default CourierListPage;
