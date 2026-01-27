import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import SalesList from './Components/SalesList'
const SalesListPage = () => {
  return (
    <>
      <PageTItle title="Sales List" />
      <Row >
        <Col xl={12}>
          <SalesList />
        </Col>
      </Row>
    </>
  )
}
export default SalesListPage
