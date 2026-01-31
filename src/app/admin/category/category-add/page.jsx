import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddCategory from './components/AddCategory';

const CategoryAddPage = () => {
    return (
        <>
            <PageTItle title="Category Management" />
            <Row>
                <Col xl={12} lg={12}>
                    <AddCategory />
                </Col>
            </Row>
        </>
    );
};

export default CategoryAddPage;
