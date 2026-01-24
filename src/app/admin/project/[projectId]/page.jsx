import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import ProjectDetails from './components/ProjectDetails';

const ProjectDetailsPage = () => {
  return (
    <>
      <PageTItle title="Project Details" />
      <ProjectDetails />
    </>
  );
};

export default ProjectDetailsPage;