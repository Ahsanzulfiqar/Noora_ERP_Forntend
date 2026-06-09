import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import ManualUpdateStock from '../warehouse/components/ManualUpdateStock';

const ManualUpdateStockPage = () => {
    return (
        <>
            <PageTItle title="Edit Manual Inventory" />
            <Row>
                <ManualUpdateStock />
            </Row>
        </>
    );
};

export default ManualUpdateStockPage;
