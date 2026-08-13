import React, { useState, useEffect } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableNoData from '@/components/TableNoData';
import CustomTablePaginations from '@/components/table/CustomTablePaginations';
import { useFilterSubCategoriesQuery, useDeleteSubCategoryMutation } from '@/services/authenticateendpoint/category';
import StatusAlert from '@/components/StatusAlert';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import { FilterSelect, FilterSearch, FilterClearAll } from '@/components/Filters';

const SubCategoryList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isActive, setIsActive] = useState(''); // '' for All, 'true' for Active, 'false' for Inactive
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const { data, isLoading, error: subCategoriesError, refetch } = useFilterSubCategoriesQuery({
        page,
        limit,
        filter: {
            search: search,
            ...(isActive !== '' && { isActive: isActive === 'true' }),
            includeDeleted: false
        }
    });

    const [deleteSubCategory, { isSuccess: isDeleteSuccess, error: deleteError, isLoading: isDeleting }] = useDeleteSubCategoryMutation();

    useEffect(() => {
        if (subCategoriesError) toast.error(extractApiErrorMessage(subCategoriesError));
    }, [subCategoriesError]);
    useEffect(() => {
        if (deleteError) toast.error(extractApiErrorMessage(deleteError));
    }, [deleteError]);

    const subcategories = data?.data || [];
    const totalPages = data?.totalPages || 1;

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e) => {
        setIsActive(e.target.value);
        setPage(1);
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteSubCategory(selectedId).unwrap();
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Failed to delete subcategory:', err);
        }
    };

    return (
        <Row>
            <Col xl={12}>
                <StatusAlert isSuccess={isDeleteSuccess} message="Sub-Category deleted successfully" error={deleteError} />
                <DeleteConfirmModal
                    show={showDeleteModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    loading={isDeleting}
                />
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <CardTitle as={'h4'}>Sub-Categories ({data?.total || 0})</CardTitle>
                        <div className="d-flex gap-2 align-items-center">
                            <FilterSelect
                                value={isActive}
                                onChange={(v) => handleStatusChange({ target: { value: v } })}
                                options={[
                                    { value: '', label: 'All Status' },
                                    { value: 'true', label: 'Active' },
                                    { value: 'false', label: 'Inactive' },
                                ]}
                                size="sm"
                                style={{ width: '130px' }}
                            />
                            <FilterSearch
                                value={search}
                                onChange={(v) => handleSearchChange({ target: { value: v } })}
                                placeholder="Search sub-categories..."
                                size="sm"
                                style={{ width: '200px' }}
                            />
                            <FilterClearAll
                                size="sm"
                                onClear={() => {
                                    setIsActive('')
                                    setSearch('')
                                    setPage(1)
                                }}
                            />
                            <Button size="sm" variant="primary" onClick={() => navigate('/admin/category/subcategory-add')}>
                                Add Sub-Category
                            </Button>
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
                                    <th>Parent Category</th>
                                    <th>Slug</th>
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
                                ) : subcategories.length > 0 ? (
                                    subcategories.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" />
                                                </div>
                                            </td>
                                            <td className='text-capitalize'>{item.name}</td>
                                            <td className='text-capitalize'>{item.categoryName}</td>
                                            <td className='text-capitalize'>{item.slug}</td>
                                            <td>
                                                <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <Button variant="light" size="sm" onClick={() => navigate(`/admin/category/subcategory-detail/${item._id}`)}>
                                                        <IconifyIcon icon="solar:eye-broken" className="fs-18" />
                                                    </Button>
                                                    <Button variant="light" size="sm" onClick={() => navigate(`/admin/category/subcategory-edit/${item._id}`)}>
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

export default SubCategoryList;
