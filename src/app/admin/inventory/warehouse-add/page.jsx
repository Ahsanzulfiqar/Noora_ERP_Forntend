import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ManualAddStock from '../warehouse/components/ManualAddStock';

const ManualAddStockPage = () => {
    const { inventoryId } = useParams();
    return (
        <>
            <PageTItle title={inventoryId ? 'Update Inventory' : 'Add Manual Inventory'} />
            <Row>
                <ManualAddStock />
            </Row>
        </>
    );
};

export default ManualAddStockPage;
