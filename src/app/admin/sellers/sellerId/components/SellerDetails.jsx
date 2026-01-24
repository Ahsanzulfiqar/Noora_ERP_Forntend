import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Box } from '@mui/material';
import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SellerDetails = ({ sellerData, isLoadingSeller }) => {
  return <Row>
    <Col lg={12}>
      <Card>
        <CardBody>
          <Row className="g-3 pb-4 d-flex justify-content-end">
            <Col lg={4}>
              <Box className="gap-1 hstack justify-content-end">
                <Link to={`/sellers/sellers-edit/${sellerData?._id}`} className="btn btn-light btn-sm">
                  <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                </Link>
                <Link to="" className="btn btn-danger btn-sm">
                  <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                </Link>

              </Box>
            </Col>
          </Row>
          <Row className="g-3">

            <Col lg={8} className="border-end">
              <div>
                <h4 className="mb-1"> {sellerData?.name}</h4>
                <p className="mb-1">{sellerData?.companyname}</p>
                <Link to="" className="link-primary fs-16 fw-medium">
                  {sellerData?.sellerType}
                </Link>
                <div className="mt-2">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                      <IconifyIcon icon="solar:point-on-map-bold-duotone" className="fs-20 text-primary" />
                    </div>
                    <p className="mb-0 fs-15">{sellerData?.address}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                      <IconifyIcon icon="solar:letter-bold-duotone" className="fs-20 text-primary" />
                    </div>
                    <p className="mb-0 fs-15">{sellerData?.email}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                      <IconifyIcon icon="solar:outgoing-call-rounded-bold-duotone" className="fs-20 text-primary" />
                    </div>
                    <p className="mb-0 fs-15">{sellerData?.phone}</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={4}>
              <CardTitle as={'h4'}>Commission Details</CardTitle>
              <Row className="text-center g-2 mt-2">
                <Col lg={12} xs={12}>
                  <div className="bg-body p-2 rounded">
                    <h5 className="mb-1">{sellerData?.commissionValue}</h5>
                    <p className="text-muted mb-0">Commission Value</p>
                  </div>
                </Col>
                <Col lg={12} xs={12}>
                  <div className="bg-body p-2 rounded">
                    <h5 className="mb-1">{sellerData?.commissionType}</h5>
                    <p className="text-muted mb-0">Commission Type</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr className="my-4" />
          <CardTitle as={'h4'} className="mb-2">
            Social Media :
          </CardTitle>
          <ul className="list-inline d-flex gap-1 mb-0 mt-3  align-items-center">
            <li className="list-inline-item">
              <Link to="" className="btn btn-soft-primary avatar-sm d-flex align-items-center justify-content-center fs-20">
                <span>
                  {' '}
                  <IconifyIcon width={20} height={20} icon="bxl:facebook" />{' '}
                </span>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="" className="btn btn-soft-danger avatar-sm d-flex align-items-center justify-content-center fs-20">
                <span>
                  {' '}
                  <IconifyIcon width={20} height={20} icon="bxl:instagram" />{' '}
                </span>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="" className="btn btn-soft-info avatar-sm d-flex align-items-center justify-content-center  fs-20">
                <span>
                  {' '}
                  <IconifyIcon width={20} height={20} icon="bxl:twitter" />{' '}
                </span>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="" className="btn btn-soft-success avatar-sm d-flex align-items-center justify-content-center fs-20">
                <span>
                  {' '}
                  <IconifyIcon width={20} height={20} icon="bxl:whatsapp" />{' '}
                </span>
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="" className="btn btn-soft-warning avatar-sm d-flex align-items-center justify-content-center fs-20">
                <span>
                  {' '}
                  <IconifyIcon width={20} height={20} icon="bx:envelope" />{' '}
                </span>
              </Link>
            </li>
          </ul>
        </CardBody>
      </Card>
    </Col>
  </Row>;
};
export default SellerDetails;