import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import SellerList from './Components/SellerList'
const SellerListPage = () => {
  return (
    <>
      <PageTItle title="Sellers List" />
      <Row>
        <Col xl={12}>
          <SellerList />
        </Col>
      </Row>
    </>
  )
}
export default SellerListPage
