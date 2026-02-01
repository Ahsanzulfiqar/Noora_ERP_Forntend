import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProjectByIdQuery } from '../../../../../services/authenticateendpoint/project';
import { useGetAllWarehousesQuery } from '../../../../../services/authenticateendpoint/warehouse';
import { useGetAllUsersQuery } from '../../../../../services/authenticateendpoint/users';
import LoaderSpinner from '@/components/loaders/LoaderSpinner';

const ProjectDetails = () => {
  const { projectId } = useParams();

  const { data, isLoading, error } = useGetProjectByIdQuery(projectId, { skip: !projectId })
  const { data: warehousesData } = useGetAllWarehousesQuery();
  const { data: usersData } = useGetAllUsersQuery();

  if (isLoading) return <LoaderSpinner />
  if (error) return <div>Error loading project details</div>

  const getWarehouseName = (id) => {
    const warehouse = warehousesData?.find(w => w._id === id);
    return warehouse ? warehouse.name : id;
  };

  const getSellerName = (id) => {
    const seller = usersData?.find(u => u._id === id);
    return seller ? seller.name : id;
  };

  return <Col lg={12}>
    <Card>
      <CardHeader>
        <CardTitle as={'h4'}>Project Details</CardTitle>
      </CardHeader>
      <CardBody>
        <div>
          <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">
            <li>
              <span className="fw-medium text-dark">Name</span>
              <span className="mx-2">:</span>{data?.name}
            </li>
            <li>
              <span className="fw-medium text-dark">Channel</span>
              <span className="mx-2">:</span>{data?.channel}
            </li>
            <li>
              <span className="fw-medium text-dark">Warehouses</span>
              <span className="mx-2">:</span>
              {data?.warehouses?.length > 0 ? (
                <ul>
                  {data.warehouses.map((id, idx) => (
                    <li key={idx}>{getWarehouseName(id)}</li>
                  ))}
                </ul>
              ) : 'None'}
            </li>
            <li>
              <span className="fw-medium text-dark">Sellers</span>
              <span className="mx-2">:</span>
              {data?.sellers?.length > 0 ? (
                <ul>
                  {data.sellers.map((id, idx) => (
                    <li key={idx}>{getSellerName(id)}</li>
                  ))}
                </ul>
              ) : 'None'}
            </li>
            <li>
              <span className="fw-medium text-dark">Status</span>
              <span className="mx-2">:</span>
              {data?.isActive ? (
                <span className="badge bg-success">Active</span>
              ) : (
                <span className="badge bg-danger">Inactive</span>
              )}
            </li>
          </ul>
        </div>
      </CardBody>
    </Card>
  </Col>;
};
export default ProjectDetails;