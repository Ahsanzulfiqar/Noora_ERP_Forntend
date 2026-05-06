import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardFooter, CardHeader, CardTitle } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteProjectMutation, useGetAllProjectsQuery, useGetProjectsBySellerQuery } from '../../../../../services/authenticateendpoint/project';
import { useGetAllUsersQuery } from '../../../../../services/authenticateendpoint/users';
import { IconButton } from '@mui/material';
import LoaderSpinner from '../../../../../components/loaders/LoaderSpinner';
import { useState } from 'react';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import CustomTablePaginations from '@/components/table/CustomTablePaginations';
import { useAuth } from '../../../../../hooks/useAuth';
import { ROLES } from '@/assets/data/roles';

const ProjectList = () => {
  const { role, id: currentUserId, name: currentUserName } = useAuth();
  const isSeller = role === 'SELLER';
  const isAdmin = role === ROLES.ADMIN;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: allProjects, isLoading: loadingAll } = useGetAllProjectsQuery(undefined, { skip: isSeller });
  const { data: sellerProjects, isLoading: loadingSeller } = useGetProjectsBySellerQuery(currentUserId, { skip: !isSeller || !currentUserId });

  const data = isSeller ? sellerProjects : allProjects;
  const isLoading = isSeller ? loadingSeller : loadingAll;
  const { data: usersData } = useGetAllUsersQuery();
  const sellerMap = Object.fromEntries((usersData || []).filter((u) => u.role === 'SELLER').map((s) => [s._id, s.name]));

  const [deleteProject] = useDeleteProjectMutation();
  const navigate = useNavigate();

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const currentData = data?.slice((page - 1) * limit, page * limit) || [];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setProjectIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (projectIdToDelete) {
      await deleteProject(projectIdToDelete);
      setShowDeleteModal(false);
      setProjectIdToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setProjectIdToDelete(null);
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center gap-1">
        <CardTitle as={'h4'} className="flex-grow-1">
          All Projects
        </CardTitle>
        <Link to="/projects/project-add" className="btn btn-sm btn-primary">
          Add Project
        </Link>
      </CardHeader>
      <div>
        <div className="table-responsive" style={{ height: 'calc(100vh - 265px)', overflowY: 'auto' }}>
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ width: 20 }}>
                  <div className="form-check ms-1">
                    <input type="checkbox" className="form-check-input" id="customCheck1" />
                    <label className="form-check-label" htmlFor="customCheck1" />
                  </div>
                </th>
                <th>Name</th>
                <th>Channel</th>
                <th>Warehouses</th>
                <th>Sellers</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'left' }}>
              {isLoading && <LoaderSpinner show={isLoading} colSpan={8} />}
              {!isLoading && currentData?.map((item) => (
                <tr key={item?._id}>
                  <td>
                    <div className="form-check ms-1">
                      <input type="checkbox" className="form-check-input" />
                      <label className="form-check-label" />
                    </div>
                  </td>
                  <td>{item?.name}</td>
                  <td>{item?.channel}</td>
                  <td>{item?.warehouses?.length || 0}</td>
                  <td>{sellerMap[item?.seller] || (item?.seller === currentUserId ? currentUserName : item?.seller) || '-'}</td>
                  <td>
                    {item?.isActive ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', gap: '10px', display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      className="btn btn-light btn-sm"
                      aria-label="view"
                      onClick={() => navigate(`/projects/project-details/${item?._id}`)}
                    >
                      <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                    </IconButton>
                    <IconButton
                      size="small"
                      className="btn btn-soft-primary btn-sm"
                      aria-label="edit"
                      onClick={() => navigate(`/projects/project-edit/${item?._id}`)}
                    >
                      <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                    </IconButton>
                    {isAdmin && (
                      <IconButton
                        size="small"
                        className="btn btn-soft-danger btn-sm"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(item._id)}
                      >
                        <IconifyIcon
                          icon="solar:trash-bin-minimalistic-2-broken"
                          className="align-middle fs-18"
                        />
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CustomTablePaginations
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
      <DeleteConfirmModal
        show={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseModal}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        confirmText="Yes, Delete"
      />
    </Card>
  );
};
export default ProjectList;