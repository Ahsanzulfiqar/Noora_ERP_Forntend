import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddSubCategory from './components/AddSubCategory';

const SubCategoryAddPage = () => {
    return (
        <>
            <PageTItle title="Sub-Category Management" />
            <Row>
                <Col xl={12} lg={12}>
                    <AddSubCategory />
                </Col>
            </Row>
        </>
    );
};

export default SubCategoryAddPage;
