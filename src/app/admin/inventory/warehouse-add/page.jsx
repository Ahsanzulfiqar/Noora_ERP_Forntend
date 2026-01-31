import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import ManualAddStock from '../warehouse/components/ManualAddStock';

const ManualAddStockPage = () => {
    return (
        <>
            <PageTItle title="Add Manual Inventory" />
            <Row>
                <ManualAddStock />
            </Row>
        </>
    );
};

export default ManualAddStockPage;
