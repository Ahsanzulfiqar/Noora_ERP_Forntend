import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import CourierDetails from './components/CourierDetails';

const CourierDetailsPage = () => {
    return (
        <>
            <PageTItle title="Courier Details" />
            <CourierDetails />
        </>
    );
};

export default CourierDetailsPage;
