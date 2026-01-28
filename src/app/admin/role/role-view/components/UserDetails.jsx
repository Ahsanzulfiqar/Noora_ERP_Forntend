import { Card, CardBody, CardHeader, CardTitle, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useGetAllWarehousesQuery } from '@/services/endpoints/warehouse';
import { useGetAllProjectsQuery } from '@/services/authenticateendpoint/project';

const UserDetails = ({ user }) => {
    const { data: warehouses } = useGetAllWarehousesQuery();
    const { data: projects } = useGetAllProjectsQuery();

    // Helper function to get warehouse names from IDs
    const getWarehouseNames = (warehouseIds) => {
        if (!warehouseIds || warehouseIds.length === 0) return [];
        return warehouseIds
            .map(id => warehouses?.find(w => w._id === id))
            .filter(Boolean)
            .map(w => w.name);
    };

    // Helper function to get project names from IDs
    const getProjectNames = (projectIds) => {
        if (!projectIds || projectIds.length === 0) return [];
        return projectIds
            .map(id => projects?.find(p => p._id === id))
            .filter(Boolean)
            .map(p => p.name);
    };

    const warehouseNames = getWarehouseNames(user.assignedWarehouses);
    const projectNames = getProjectNames(user.assignedProjects);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Row>
                <Col lg={12}>
                    <Card>
                        <CardHeader className="d-flex justify-content-between align-items-center">
                            <CardTitle as={'h4'}>User Information</CardTitle>
                            <div className="d-flex gap-2">
                                <Link to={`/role/role-edit/${user._id}`} className="btn btn-primary btn-sm">
                                    <IconifyIcon icon="solar:pen-2-broken" className="align-middle me-1" />
                                    Edit User
                                </Link>
                                <Link to="/role/role-list" className="btn btn-outline-secondary btn-sm">
                                    <IconifyIcon icon="solar:arrow-left-broken" className="align-middle me-1" />
                                    Back to List
                                </Link>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Row className="mb-4">
                                <Col lg={12}>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="avatar-lg bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center me-3">
                                            <IconifyIcon icon="solar:user-bold" className="fs-1 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1">{user.name}</h3>
                                            <p className="text-muted mb-0">{user.email}</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={6}>
                                    <Card className="border mb-3">
                                        <CardBody>
                                            <h5 className="card-title mb-3">
                                                <IconifyIcon icon="solar:user-id-bold" className="me-2 text-primary" />
                                                Basic Information
                                            </h5>
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="fw-semibold" style={{ width: '40%' }}>Full Name:</td>
                                                        <td>{user.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-semibold">Email:</td>
                                                        <td>{user.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-semibold">Phone:</td>
                                                        <td>{user.phone || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-semibold">User ID:</td>
                                                        <td>
                                                            <code className="text-muted">{user._id}</code>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-semibold">Created At:</td>
                                                        <td>{formatDate(user.createdAt)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col lg={6}>
                                    <Card className="border mb-3">
                                        <CardBody>
                                            <h5 className="card-title mb-3">
                                                <IconifyIcon icon="solar:shield-user-bold" className="me-2 text-primary" />
                                                Role & Status
                                            </h5>
                                            <table className="table table-borderless mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td className="fw-semibold" style={{ width: '40%' }}>Role:</td>
                                                        <td>
                                                            <Badge bg="info" className="px-3 py-2">
                                                                {user.role}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-semibold">Status:</td>
                                                        <td>
                                                            <Badge bg={user.isActive ? 'success' : 'danger'} className="px-3 py-2">
                                                                {user.isActive ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={6}>
                                    <Card className="border mb-3">
                                        <CardBody>
                                            <h5 className="card-title mb-3">
                                                <IconifyIcon icon="solar:box-bold" className="me-2 text-primary" />
                                                Assigned Warehouses
                                            </h5>
                                            {warehouseNames.length > 0 ? (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {warehouseNames.map((name, idx) => (
                                                        <Badge key={idx} bg="light-subtle" text="muted" className="border py-2 px-3">
                                                            <IconifyIcon icon="solar:box-minimalistic-broken" className="me-1" />
                                                            {name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted mb-0">
                                                    <IconifyIcon icon="solar:info-circle-broken" className="me-1" />
                                                    No warehouses assigned
                                                </p>
                                            )}
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col lg={6}>
                                    <Card className="border mb-3">
                                        <CardBody>
                                            <h5 className="card-title mb-3">
                                                <IconifyIcon icon="solar:folder-bold" className="me-2 text-primary" />
                                                Assigned Projects
                                            </h5>
                                            {projectNames.length > 0 ? (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {projectNames.map((name, idx) => (
                                                        <Badge key={idx} bg="light-subtle" text="muted" className="border py-2 px-3">
                                                            <IconifyIcon icon="solar:folder-open-broken" className="me-1" />
                                                            {name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted mb-0">
                                                    <IconifyIcon icon="solar:info-circle-broken" className="me-1" />
                                                    No projects assigned
                                                </p>
                                            )}
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default UserDetails;
