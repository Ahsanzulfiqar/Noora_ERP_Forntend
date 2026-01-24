import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import AddEditCourier from './components/AddEditCourier';
import { useParams, useSearchParams } from 'react-router-dom';

const CourierAddPage = () => {
    const [searchParams] = useSearchParams();
    const courierId = searchParams.get('courierId');

    return <>
        <PageTItle title={courierId ? "Edit Courier" : "Create Courier"} />
        <Row>
            <AddEditCourier />
        </Row>
    </>;
};
export default CourierAddPage;
