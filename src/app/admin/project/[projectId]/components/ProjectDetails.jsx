import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Badge, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProjectByIdQuery } from '../../../../../services/authenticateendpoint/project';
import { useGetAllWarehousesQuery } from '../../../../../services/authenticateendpoint/warehouse';
import { useGetAllUsersQuery } from '../../../../../services/authenticateendpoint/users';
import LoaderSpinner from '@/components/loaders/LoaderSpinner';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const ProjectDetails = () => {
  const { projectId } = useParams();

  const { data, isLoading, error, refetch } = useGetProjectByIdQuery(projectId, { skip: !projectId });
  const { data: warehousesData, error: warehousesError } = useGetAllWarehousesQuery();
  const { data: usersData, error: usersError } = useGetAllUsersQuery();

  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);
  useEffect(() => {
    if (warehousesError) toast.error(extractApiErrorMessage(warehousesError));
  }, [warehousesError]);
  useEffect(() => {
    if (usersError) toast.error(extractApiErrorMessage(usersError));
  }, [usersError]);

  if (isLoading) return <LoaderSpinner />;
  if (error) return null;

  const getWarehouseName = (id) => {
    const warehouse = warehousesData?.find(w => w._id === id);
    return warehouse ? warehouse.name : id;
  };

  const getSellerName = (id) => {
    const seller = usersData?.find(u => u._id === id);
    return seller ? seller.name : id;
  };

  return (
    <Row>
      <Col xs={12}>
        {/* Header Card */}
        <Card className="border-0 shadow-sm mb-4">
          <CardBody className="p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h2 className="mb-1 text-dark fw-bold">{data?.name}</h2>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg={data?.isActive ? 'success' : 'danger'} className="text-uppercase px-3 py-1 fs-12">
                    {data?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-muted fs-14">•</span>
                  <span className="text-muted fs-14">Channel: <span className="text-dark fw-medium">{data?.channel || 'N/A'}</span></span>
                </div>
              </div>
              <div>
                <Link to={`/projects/project-edit/${projectId}`} className="btn btn-soft-primary d-flex align-items-center gap-1">
                  <IconifyIcon icon="solar:pen-2-broken" className="fs-18" /> Edit Project
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col lg={8}>
        {/* Warehouses Section */}
        <Card className="border-0 shadow-sm mb-4">
          <CardHeader className="bg-transparent border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-sm bg-primary-subtle text-primary rounded d-flex align-items-center justify-content-center">
                <IconifyIcon icon="solar:buildings-2-bold-duotone" className="fs-20" />
              </div>
              <h5 className="mb-0 text-dark fw-bold">Associated Warehouses</h5>
            </div>
          </CardHeader>
          <CardBody>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="text-muted text-uppercase fs-12" style={{ width: '50px' }}>#</th>
                    <th className="text-muted text-uppercase fs-12">Warehouse Name</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.warehouses?.length > 0 ? (
                    data.warehouses.map((id, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td className="fw-medium text-dark">{getWarehouseName(id)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4 text-muted">No warehouses associated</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>

        {/* Sellers Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-transparent border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-sm bg-info-subtle text-info rounded d-flex align-items-center justify-content-center">
                <IconifyIcon icon="solar:users-group-two-rounded-bold-duotone" className="fs-20" />
              </div>
              <h5 className="mb-0 text-dark fw-bold">Assigned Sellers</h5>
            </div>
          </CardHeader>
          <CardBody>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="text-muted text-uppercase fs-12" style={{ width: '50px' }}>#</th>
                    <th className="text-muted text-uppercase fs-12">Seller Name</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.sellers?.length > 0 ? (
                    data.sellers.map((id, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td className="fw-medium text-dark">{getSellerName(id)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4 text-muted">No sellers assigned</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col lg={4}>
        {/* Quick Info Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-transparent border-bottom">
            <h5 className="mb-0 text-dark fw-bold">Project Summary</h5>
          </CardHeader>
          <CardBody>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <div className="avatar-sm flex-shrink-0 bg-light-subtle rounded d-flex align-items-center justify-content-center text-primary border">
                  <IconifyIcon icon="solar:info-square-bold-duotone" className="fs-24" />
                </div>
                <div>
                  <h6 className="mb-1 text-muted fs-13 text-uppercase">Project Name</h6>
                  <p className="mb-0 fw-bold text-dark">{data?.name}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="avatar-sm flex-shrink-0 bg-light-subtle rounded d-flex align-items-center justify-content-center text-primary border">
                  <IconifyIcon icon="solar:tv-bold-duotone" className="fs-24" />
                </div>
                <div>
                  <h6 className="mb-1 text-muted fs-13 text-uppercase">Channel</h6>
                  <Badge bg="secondary" className="fs-12">{data?.channel || 'Default'}</Badge>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="avatar-sm flex-shrink-0 bg-light-subtle rounded d-flex align-items-center justify-content-center text-primary border">
                  <IconifyIcon icon="solar:checklist-bold-duotone" className="fs-24" />
                </div>
                <div>
                  <h6 className="mb-1 text-muted fs-13 text-uppercase">Statistics</h6>
                  <p className="mb-0 fs-14 fw-medium text-dark">
                    <span className="text-primary">{data?.warehouses?.length || 0}</span> Warehouses
                  </p>
                  <p className="mb-0 fs-14 fw-medium text-dark">
                    <span className="text-primary">{data?.sellers?.length || 0}</span> Sellers
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="text-center">
              <p className="text-muted fs-13 mb-0">Project status is currently</p>
              <h4 className={`fw-bold ${data?.isActive ? 'text-success' : 'text-danger'}`}>
                {data?.isActive ? 'ACTIVE' : 'INACTIVE'}
              </h4>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProjectDetails;