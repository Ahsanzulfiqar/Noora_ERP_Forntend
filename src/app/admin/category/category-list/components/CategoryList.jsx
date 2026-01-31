import React, { useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import TableNoData from '@/components/TableNoData';
import CustomTablePaginations from '@/components/table/CustomTablePaginations';
import { useFilterCategoriesQuery, useDeleteCategoryMutation } from '@/services/authenticateendpoint/category';
import StatusAlert from '@/components/StatusAlert';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ViewDetailModal from '../../components/ViewDetailModal';

const CategoryList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isActive, setIsActive] = useState(''); // '' for All, 'true' for Active, 'false' for Inactive
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const { data, isLoading } = useFilterCategoriesQuery({
        page,
        limit,
        filter: {
            search: search,
            ...(isActive !== '' && { isActive: isActive === 'true' }),
            includeDeleted: false
        }
    });

    const [deleteCategory, { isSuccess: isDeleteSuccess, error: deleteError, isLoading: isDeleting }] = useDeleteCategoryMutation();

    const categories = data?.data || [];
    const totalPages = data?.totalPages || 1;

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e) => {
        setIsActive(e.target.value);
        setPage(1);
    };

    const handleViewClick = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCategory(selectedId).unwrap();
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    };

    const categoryFields = [
        { label: 'Category ID', key: '_id', col: 12 },
        { label: 'Name', key: 'name', className: 'text-capitalize' },
        { label: 'Slug', key: 'slug', className: 'text-capitalize' },
        { label: 'Description', key: 'description', col: 12, className: 'text-capitalize' },
        {
            label: 'Status',
            key: 'isActive',
            render: (data) => (
                <span className={`badge ${data.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {data.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
    ];

    return (
        <Row>
            <Col xl={12}>
                <StatusAlert isSuccess={isDeleteSuccess} message="Category deleted successfully" error={deleteError} />
                <DeleteConfirmModal
                    show={showDeleteModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    loading={isDeleting}
                />
                <ViewDetailModal
                    show={showViewModal}
                    onHide={() => setShowViewModal(false)}
                    title="Category Details"
                    data={selectedItem || {}}
                    fields={categoryFields}
                />
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <CardTitle as={'h4'}>Categories ({data?.total || 0})</CardTitle>
                        <div className="d-flex gap-2 align-items-center">
                            <Form.Select
                                size="sm"
                                value={isActive}
                                onChange={handleStatusChange}
                                style={{ width: '130px' }}
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Form.Select>
                            <Form.Control
                                type="text"
                                placeholder="Search categories..."
                                size="sm"
                                value={search}
                                onChange={handleSearchChange}
                                style={{ width: '200px' }}
                            />
                            <Link to="/admin/category/category-add" className="btn btn-sm btn-primary">
                                Add Category
                            </Link>
                        </div>
                    </CardHeader>

                    <div className="table-responsive">
                        <table className="table align-middle mb-0 table-hover table-centered">
                            <thead className="bg-light-subtle">
                                <tr>
                                    <th style={{ width: 20 }}>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" />
                                        </div>
                                    </th>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center">Loading...</td>
                                    </tr>
                                ) : categories.length > 0 ? (
                                    categories.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" />
                                                </div>
                                            </td>
                                            <td className='text-capitalize'>{item.name}</td>
                                            <td className='text-capitalize'>{item.slug}</td>
                                            <td className='text-capitalize'>{item.description || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <Button variant="light" size="sm" onClick={() => handleViewClick(item)}>
                                                        <IconifyIcon icon="solar:eye-broken" className="fs-18" />
                                                    </Button>
                                                    <Button variant="light" size="sm" onClick={() => navigate(`/admin/category/category-edit/${item._id}`)}>
                                                        <IconifyIcon icon="solar:pen-2-broken" className="fs-18" />
                                                    </Button>
                                                    <Button variant="soft-danger" size="sm" onClick={() => handleDeleteClick(item._id)}>
                                                        <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="fs-18" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <TableNoData colSpan={7} />
                                )}
                            </tbody>
                        </table>
                    </div>
                    <CustomTablePaginations
                        limit={limit}
                        setLimit={setLimit}
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default CategoryList;
