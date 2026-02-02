import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Box } from '@mui/material';
import { Card, CardBody, CardHeader, Col, Row, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SellerDetails = ({ sellerData, isLoadingSeller }) => {
  if (isLoadingSeller) return <div>Loading...</div>; // Simple loading state

  return (
    <Row>
      <Col xs={12}>
        {/* Profile Header Card */}
        <Card className="border-0 shadow-sm mb-4 overflow-hidden">
          <div className="bg-primary-subtle" style={{ height: '120px' }}></div>
          <CardBody className="pt-0">
            <Row className="align-items-end">
              <Col xs="auto">
                <div className="avatar-xl border-4 border-white rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center mt-n5 position-relative">
                  <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-32 fw-bold">
                    {sellerData?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                </div>
              </Col>
              <Col>
                <div className="pt-3 pb-3">
                  <h3 className="mb-1 fw-bold text-dark">{sellerData?.name}</h3>
                  <p className="text-muted mb-0 d-flex align-items-center gap-2">
                    <IconifyIcon icon="solar:buildings-2-broken" className="fs-16" />
                    {sellerData?.companyname || 'Company Name'}
                  </p>
                </div>
              </Col>
              <Col xs="auto" className="pb-3">
                <div className="d-flex gap-2">
                  <Link to={`/sellers/sellers-edit/${sellerData?._id}`} className="btn btn-primary d-flex align-items-center gap-1">
                    <IconifyIcon icon="solar:pen-2-broken" className="fs-18" /> Edit Profile
                  </Link>
                  <button className="btn btn-outline-danger d-flex align-items-center gap-1">
                    <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18" />
                  </button>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Row>
          {/* Detailed Info Column */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm mb-4">
              <CardHeader className="bg-transparent border-bottom">
                <h5 className="mb-0 text-dark fw-bold">Contact Information</h5>
              </CardHeader>
              <CardBody>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start gap-3">
                    <div className="avatar-sm flex-shrink-0 bg-light-subtle rounded d-flex align-items-center justify-content-center text-primary">
                      <IconifyIcon icon="solar:point-on-map-bold-duotone" className="fs-24" />
                    </div>
                    <div>
                      <h6 className="mb-1 text-muted fs-14">Address</h6>
                      <p className="mb-0 fw-medium text-dark">{sellerData?.address || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="avatar-sm flex-shrink-0 bg-light-subtle rounded d-flex align-items-center justify-content-center text-primary">
                      <IconifyIcon icon="solar:letter-bold-duotone" className="fs-24" />
                    </div>
                    <div>
                      <h6 className="mb-1 text-muted fs-14">Email Address</h6>
                      <p className="mb-0 fw-medium text-dark">{sellerData?.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="avatar-sm flex-shrink-0 bg-light-subtle rounded d-flex align-items-center justify-content-center text-primary">
                      <IconifyIcon icon="solar:outgoing-call-rounded-bold-duotone" className="fs-24" />
                    </div>
                    <div>
                      <h6 className="mb-1 text-muted fs-14">Phone Number</h6>
                      <p className="mb-0 fw-medium text-dark">{sellerData?.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3">
                    <div className="avatar-sm flex-shrink-0 bg-light-subtle rounded d-flex align-items-center justify-content-center text-primary">
                      <IconifyIcon icon="solar:user-id-bold-duotone" className="fs-24" />
                    </div>
                    <div>
                      <h6 className="mb-1 text-muted fs-14">Seller Type</h6>
                      <Badge bg="info" className="fs-13 px-3 py-1">{sellerData?.sellerType || 'General'}</Badge>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-transparent border-bottom">
                <h5 className="mb-0 text-dark fw-bold">Social Media</h5>
              </CardHeader>
              <CardBody>
                <div className="d-flex gap-3">
                  <Link to="" className="avatar-md bg-soft-primary rounded d-flex align-items-center justify-content-center text-primary transition-zoom">
                    <IconifyIcon icon="bxl:facebook" width={28} />
                  </Link>
                  <Link to="" className="avatar-md bg-soft-danger rounded d-flex align-items-center justify-content-center text-danger transition-zoom">
                    <IconifyIcon icon="bxl:instagram" width={28} />
                  </Link>
                  <Link to="" className="avatar-md bg-soft-info rounded d-flex align-items-center justify-content-center text-info transition-zoom">
                    <IconifyIcon icon="bxl:twitter" width={28} />
                  </Link>
                  <Link to="" className="avatar-md bg-soft-success rounded d-flex align-items-center justify-content-center text-success transition-zoom">
                    <IconifyIcon icon="bxl:whatsapp" width={28} />
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Stats / Commission Column */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm mb-4">
              <CardHeader className="bg-transparent border-bottom">
                <h5 className="mb-0 text-dark fw-bold">Financial Details</h5>
              </CardHeader>
              <CardBody>
                <Row className="g-3">
                  <Col xs={6}>
                    <div className="p-3 border rounded bg-light-subtle text-center">
                      <div className="avatar-sm mx-auto mb-2 bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center">
                        <IconifyIcon icon="solar:dollar-minimalistic-bold-duotone" className="fs-20" />
                      </div>
                      <h4 className="mb-1 fw-bold text-dark">{sellerData?.commissionValue || '0'}</h4>
                      <p className="mb-0 text-muted fs-13">Commission Value</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 border rounded bg-light-subtle text-center">
                      <div className="avatar-sm mx-auto mb-2 bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center">
                        <IconifyIcon icon="solar:pie-chart-2-bold-duotone" className="fs-20" />
                      </div>
                      <h4 className="mb-1 fw-bold text-dark text-uppercase">{sellerData?.commissionType || 'N/A'}</h4>
                      <p className="mb-0 text-muted fs-13">Commission Type</p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default SellerDetails;