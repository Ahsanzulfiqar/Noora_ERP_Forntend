import PageTItle from '@/components/PageTItle';
import { Col, Row } from 'react-bootstrap';
import ProjectList from './Components/projectList';
const ProjectListPage = () => {
  return <>
    <PageTItle title="Project List" />
    <Row>
      <Col xl={12}>
        <ProjectList />
      </Col>
    </Row>
  </>;
};
export default ProjectListPage;