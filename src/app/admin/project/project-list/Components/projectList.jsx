import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardFooter, CardHeader, CardTitle } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteProjectMutation, useGetAllProjectsQuery } from '../../../../../services/authenticateendpoint/project';
import { IconButton } from '@mui/material';
import LoaderSpinner from '../../../../../components/loaders/LoaderSpinner';
import { useState } from 'react';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const ProjectList = () => {
  const { data, isLoading } = useGetAllProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const navigate = useNavigate();

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
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover table-centered">
            <thead className="bg-light-subtle">
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
              {!isLoading && data?.map((item) => (
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
                  <td>{item?.sellers?.length || 0}</td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CardFooter className="border-top">
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-end mb-0">
            <li className="page-item">
              <Link className="page-link" to="">
                Previous
              </Link>
            </li>
            <li className="page-item active">
              <Link className="page-link" to="">
                1
              </Link>
            </li>
            <li className="page-item">
              <Link className="page-link" to="">
                Next
              </Link>
            </li>
          </ul>
        </nav>
      </CardFooter>
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