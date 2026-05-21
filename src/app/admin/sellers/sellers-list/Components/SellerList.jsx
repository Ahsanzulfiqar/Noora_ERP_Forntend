import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect } from 'react';
import { useGetAllUsersQuery } from '@/services/authenticateendpoint/users';
import { Badge, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const SellersCard = ({
  _id,
  address = 'Address not provided',
  category,
  email,
  itemStock = 0,
  phone,
  sells = 0,
  title,
  isActive
}) => {
  return <Card className="shadow-sm" style={{ boxShadow: '0 4px 15px rgba(255, 140, 0, 0.9)' }}>
    <CardBody>
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <div>
          <h4 className="mb-1 text-capitalize">
            {title}
            <br />
            <span className="text-muted fs-13 ">({category}) </span>
          </h4>
        </div>
        <div>
          <Badge bg={isActive ? 'success' : 'danger'} className="text-capitalize">
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
      <div>
        <p className="d-flex align-items-center gap-2 mb-1">
          <IconifyIcon icon="solar:point-on-map-bold-duotone" className="fs-18 text-primary" />
          {address}
        </p>
        <p className="d-flex align-items-center gap-2 mb-1">
          <IconifyIcon icon="solar:letter-bold-duotone" className="fs-18 text-primary" />
          {email}
        </p>
        <p className="d-flex align-items-center gap-2 mb-0">
          <IconifyIcon icon="solar:outgoing-call-rounded-bold-duotone" className="fs-20 text-primary" />
          {phone}
        </p>
      </div>
      <div className="p-2 pb-0 mx-n3 mt-2">
        <Row className="text-center g-2">
          <Col lg={4} xs={4} className=" border-end">
            <h5 className="mb-1">{itemStock}</h5>
            <p className="text-muted mb-0">Item Stock</p>
          </Col>
          <Col lg={4} xs={4} className=" border-end">
            <h5 className="mb-1">+{sells}k</h5>
            <p className="text-muted mb-0">Sells</p>
          </Col>
        </Row>
      </div>
    </CardBody>
    <CardFooter className="border-top gap-1 hstack justify-content-end">
      <Link to={`/sellers/sellers-detail/${_id}`} className="btn btn-primary btn-sm">
        <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
      </Link>
      <Link to={`/sellers/sellers-edit/${_id}`} className="btn btn-light btn-sm">
        <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
      </Link>
      <Link to={`/sellers/sellers-edit/${_id}`} className="btn btn-danger btn-sm">
        <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
      </Link>
    </CardFooter>
  </Card>;
};

const SellerList = () => {
  const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery();
  const sellersData = usersData?.filter(u => u.role === 'SELLER') || [];

  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return <>
    <Card className="shadow-sm" style={{ boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)' }}>
      <CardHeader>
        <CardTitle as="h4">All Sellers</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          {sellersData.map((item) => (
            <Col xl={4} md={6} key={item._id}>
              <SellersCard
                _id={item._id}
                title={item.name}
                email={item.email}
                isActive={item.isActive}
              />
            </Col>
          ))}
        </Row>
      </CardBody>
    </Card>
  </>;
};

export default SellerList;
