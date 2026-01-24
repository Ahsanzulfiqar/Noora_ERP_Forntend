import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardFooter } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteCourierMutation, useGetAllCouriersQuery } from '../../../../../services/authenticateendpoint/courier';
import { IconButton } from '@mui/material';
import LoaderSpinner from '../../../../../components/loaders/LoaderSpinner';
import { useState } from 'react';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const CourierList = () => {
    const { data, isLoading } = useGetAllCouriersQuery();
    const [deleteCourier] = useDeleteCourierMutation();
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courierIdToDelete, setCourierIdToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setCourierIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (courierIdToDelete) {
            await deleteCourier(courierIdToDelete);
            setShowDeleteModal(false);
            setCourierIdToDelete(null);
        }
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setCourierIdToDelete(null);
    };

    return (
        <Card>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">Courier List</h4>
                <Link to="/admin/courier/courier-add" className="btn btn-primary">
                    <i className="bx bx-plus me-1"></i>Add Courier
                </Link>
            </div>
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
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ textAlign: 'left' }}>
                            {isLoading && <LoaderSpinner show={isLoading} colSpan={4} />}
                            {!isLoading && data?.map((item) => (
                                <tr key={item?._id}>
                                    <td>
                                        <div className="form-check ms-1">
                                            <input type="checkbox" className="form-check-input" />
                                            <label className="form-check-label" />
                                        </div>
                                    </td>
                                    <td>{item?.name}</td>
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
                                            onClick={() => navigate(`/admin/courier/${item?._id}`)}
                                        >
                                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            className="btn btn-soft-primary btn-sm"
                                            aria-label="edit"
                                            onClick={() => navigate(`/admin/courier/courier-add?courierId=${item?._id}`)}
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
                title="Delete Courier"
                message="Are you sure you want to delete this courier?"
                confirmText="Yes, Delete"
            />
        </Card>
    );
};
export default CourierList;
