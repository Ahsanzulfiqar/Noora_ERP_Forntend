import FileUpload from '@/components/FileUpload';
import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import AddCategory from './components/AddCategory';
const CategoryAddPage = () => {
  return <>
      <PageTItle title="Create Category" />
      <Row>
        <Col xl={12} lg={12}>
          <AddCategory />
        </Col>
      </Row>
    </>;
};
export default CategoryAddPage;