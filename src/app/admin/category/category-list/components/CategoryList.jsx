import React, { useState, useEffect } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableNoData from '@/components/TableNoData';
import LoaderSpinner from '@/components/loaders/LoaderSpinner';
import CustomTablePaginations from '@/components/table/CustomTablePaginations';
import { useFilterCategoriesQuery, useDeleteCategoryMutation, useFilterSubCategoriesQuery } from '@/services/authenticateendpoint/category';
import StatusAlert from '@/components/StatusAlert';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import { FilterSelect, FilterSearch, FilterClearAll } from '@/components/Filters';

const CategoryList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isActive, setIsActive] = useState(''); // '' for All, 'true' for Active, 'false' for Inactive
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const { data, isLoading, error: categoriesError, refetch } = useFilterCategoriesQuery({
        page,
        limit,
        filter: {
            search: search,
            ...(isActive !== '' && { isActive: isActive === 'true' }),
            includeDeleted: false
        }
    });

    const [deleteCategory, { isSuccess: isDeleteSuccess, error: deleteError, isLoading: isDeleting }] = useDeleteCategoryMutation();

    const { data: subCategoriesData, error: subCategoriesError } = useFilterSubCategoriesQuery({ filter: { isActive: true }, page: 1, limit: 1000 });

    useEffect(() => {
        if (categoriesError) toast.error(extractApiErrorMessage(categoriesError));
    }, [categoriesError]);
    useEffect(() => {
        if (subCategoriesError) toast.error(extractApiErrorMessage(subCategoriesError));
    }, [subCategoriesError]);
    useEffect(() => {
        if (deleteError) toast.error(extractApiErrorMessage(deleteError));
    }, [deleteError]);

    const subCountByCategory = React.useMemo(() => {
        const map = {};
        (subCategoriesData?.data || []).forEach(sub => {
            const catId = sub.category;
            map[catId] = (map[catId] || 0) + 1;
        });
        return map;
    }, [subCategoriesData]);

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
                <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center">
                        <CardTitle as={'h4'}>Categories ({data?.total || 0})</CardTitle>
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
                                placeholder="Search categories..."
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
                                    <th>Sub Categories</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <LoaderSpinner show={isLoading} colSpan={8} />
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
                                            <td className='text-capitalize'>{item.description || '-'}</td>
                                            <td>{subCountByCategory[item._id] || 0}</td>
                                            <td>
                                                <span className={`badge ${item.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                            <td className="text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <Button variant="light" size="sm" onClick={() => navigate(`/admin/category/category-detail/${item._id}`)}>
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
                                    <TableNoData colSpan={8} />
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
