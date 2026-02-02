import { Suspense } from 'react';
import { Col, Row } from 'react-bootstrap';
import WarehouseInventoryDetails from './components/WarehouseInventoryDetails';

const WarehouseInventoryDetail = () => {
    return (
        <Row>
            <Col xs={12}>
                <div className="page-title-box">
                    <h4 className="mb-0">Inventory Details</h4>
                </div>
            </Col>
            <Col xs={12}>
                <Suspense fallback={<div>Loading...</div>}>
                    <WarehouseInventoryDetails />
                </Suspense>
            </Col>
        </Row>
    );
};

export default WarehouseInventoryDetail;
