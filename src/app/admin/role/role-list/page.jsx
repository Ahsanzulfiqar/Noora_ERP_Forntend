import PageTItle from '@/components/PageTItle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, CardTitle, CardHeader } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetAllUsersQuery, useDeactivateUserMutation, useActivateUserMutation } from '@/services/authenticateendpoint/users';
import { Badge, Col, Row, Spinner, Table, Button, Form, Modal } from 'react-bootstrap';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import CustomTablePaginations from '@/components/table/CustomTablePaginations';


const RoleListPage = () => {
  const { data: userData, isLoading, isError, error, refetch } = useGetAllUsersQuery();
  const [deactivateUser, { isLoading: isDeactivating, error: deactivateError }] = useDeactivateUserMutation();
  const [activateUser, { isLoading: isActivating, error: activateError }] = useActivateUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const totalItems = userData?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const pagedUsers = useMemo(
    () => (userData || []).slice((page - 1) * limit, page * limit),
    [userData, page, limit]
  );

  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);
  useEffect(() => {
    if (deactivateError) toast.error(extractApiErrorMessage(deactivateError));
  }, [deactivateError]);
  useEffect(() => {
    if (activateError) toast.error(extractApiErrorMessage(activateError));
  }, [activateError]);

  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;

    try {
      if (selectedUser.isActive) {
        // Deactivate user
        await deactivateUser(selectedUser._id).unwrap();
      } else {
        // Activate user
        await activateUser(selectedUser._id).unwrap();
      }
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error toggling user status:', error);
      // You can add toast notification here if needed
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return null;
  }

  return <>
    <PageTItle title="Roles List" />
    <Card className="overflow-hiddenCoupons">
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center gap-1 mb-3">
          <CardTitle as={'h4'} className="flex-grow-1">
            All Roles Lists
          </CardTitle>
          <Link to="/role/role-add" className="btn btn-sm btn-primary">
            Add Role
          </Link>

        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {/* <th>Projects</th>
                <th>Warehouses</th> */}
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((item, idx) => <tr key={item._id || idx}>
                <td className='text-capitalize'>{item.name}</td>
                <td>{item.email}</td>
                <td className='text-capitalize'>{item.role}</td>
                {/* <td>
                  {item.assignedProjects?.length > 0 ? (
                    item.assignedProjects.map((project, pIdx) => (
                      <span key={pIdx} className="badge bg-light-subtle text-muted border py-1 px-2 me-1">
                        {project}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">No projects</span>
                  )}
                </td>
                <td>
                  {item.assignedWarehouses?.length > 0 ? (
                    item.assignedWarehouses.map((warehouse, wIdx) => (
                      <span key={wIdx} className="badge bg-light-subtle text-muted border py-1 px-2 me-1">
                        {warehouse}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">No warehouses</span>
                  )}
                </td> */}
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id={`flexSwitchCheckChecked-${item._id}`}
                      checked={item.isActive}
                      onChange={() => handleToggleClick(item)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </td>
                <td className="text-center d-flex justify-content-center align-items-center"> 
                  <div className="d-flex gap-2">
                    <Link to={`/role/role-view/${item._id}`} className="btn btn-light btn-sm">
                      <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                    </Link>
                    <Link to={`/role/role-edit/${item._id}`} className="btn btn-soft-primary btn-sm">
                      <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                    </Link>
                    <Link to="#!" className="btn btn-soft-danger btn-sm">
                      <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                    </Link>
                  </div>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </CardBody>
      <CustomTablePaginations
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </Card>

    {/* Confirmation Modal */}
    <Modal show={showModal} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <p>
            Are you sure you want to {selectedUser.isActive ? 'deactivate' : 'activate'} user{' '}
            <strong>{selectedUser.name}</strong>?
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel} disabled={isDeactivating || isActivating}>
          Cancel
        </Button>
        <Button
          variant={selectedUser?.isActive ? 'danger' : 'success'}
          onClick={handleConfirm}
          disabled={isDeactivating || isActivating}
        >
          {isDeactivating || isActivating ? 'Processing...' : 'Confirm'}
        </Button>
      </Modal.Footer>
    </Modal>
  </>;
};

export default RoleListPage;