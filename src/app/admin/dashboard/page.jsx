import { Row } from 'react-bootstrap';
import Conversions from './components/Conversions';
import Orders from './components/Orders';
import Stats from './components/Stats';

//

const DashboardPage = () => {
  return <>
      <Row>
        <Stats />
        <Conversions />
        <Orders />
      </Row>
    </>;
};
export default DashboardPage;