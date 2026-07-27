import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'
import PageTItle from '@/components/PageTItle'

const SellerCommissionsPage = () => {
  return (
    <>
      <PageTItle title="My Commissions" />

      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">My Commissions</h3>
          <p className="text-muted mb-0">Earnings and payout history</p>
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={4}>
          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <h5 className="mb-0">Earned This Month</h5>
            </CardHeader>
            <CardBody>
              <div className="text-center text-muted py-4">No data</div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <h5 className="mb-0">Pending Payout</h5>
            </CardHeader>
            <CardBody>
              <div className="text-center text-muted py-4">No data</div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <h5 className="mb-0">Lifetime Earnings</h5>
            </CardHeader>
            <CardBody>
              <div className="text-center text-muted py-4">No data</div>
            </CardBody>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="mb-0">
            <CardHeader className="border-bottom">
              <h5 className="mb-0">Payout History</h5>
            </CardHeader>
            <CardBody>
              <div className="text-center text-muted py-5">No data</div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SellerCommissionsPage
