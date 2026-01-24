import React, { useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardFooter, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableNoData from '@/components/TableNoData';
import { useGetWarehouseStockQuery, useGetAllWarehousesQuery } from '@/services/endpoints/warehouse';
import { useGetAllProductsQuery } from '@/services/endpoints/product';
import { useGetVariantsByProductQuery } from '@/services/endpoints/productvariant';

const WarehouseList = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    warehouseId: '',
    productId: '',
    variantId: '',
  });
  const limit = 10;

  // Fetching Options
  const { data: warehousesData } = useGetAllWarehousesQuery();
  const { data: productsData } = useGetAllProductsQuery();
  const { data: variantsData } = useGetVariantsByProductQuery(filters.productId, {
    skip: !filters.productId,
  });

  const { data, isLoading } = useGetWarehouseStockQuery({
    page,
    limit,
    filter: {
      ...(filters.warehouseId && { warehouseId: filters.warehouseId }),
      ...(filters.productId && { productId: filters.productId }),
      ...(filters.variantId && { variantId: filters.variantId }),
    },
  });

  const warehouseStock = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'productId' ? { variantId: '' } : {}), // Reset variant if product changes
    }));
    setPage(1); // Reset to first page on filter change
  };

  return <Row>
    <Col xl={12}>
      <Card>
        <div className="d-flex card-header justify-content-between align-items-center">
          <div>
            <CardTitle as={'h4'}>Warehouse Inventory Stock</CardTitle>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <Form.Group className="mb-0">
              <Form.Select
                name="warehouseId"
                size="sm"
                value={filters.warehouseId}
                onChange={handleFilterChange}
              >
                <option value="">All Warehouses</option>
                {warehousesData?.map(w => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Select
                name="productId"
                size="sm"
                value={filters.productId}
                onChange={handleFilterChange}
              >
                <option value="">All Products</option>
                {productsData?.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Select
                name="variantId"
                size="sm"
                value={filters.variantId}
                onChange={handleFilterChange}
                disabled={!filters.productId}
              >
                <option value="">All Variants</option>
                {variantsData?.map(v => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Dropdown>
              <DropdownToggle as={'a'} className="dropdown-toggle btn btn-sm btn-outline-light rounded content-none icons-center" data-bs-toggle="dropdown" aria-expanded="false">
                <IconifyIcon className="me-1" width={16} height={16} icon="bx:dots-vertical-rounded" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download</DropdownItem>
                <DropdownItem>Export</DropdownItem>
                <DropdownItem>Import</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <div>
          <div className="table-responsive">
            <table className="table align-middle mb-0 table-hover table-centered">
              <thead className="bg-light-subtle">
                <tr>
                  <th style={{
                    width: 20
                  }}>
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="customCheck1" />
                      <label className="form-check-label" htmlFor="customCheck1" />
                    </div>
                  </th>
                  <th>Stock ID</th>
                  <th>Warehouse</th>
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Quantity</th>
                  <th>Reserved</th>
                  <th>Reorder Level</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="text-center">Loading...</td>
                  </tr>
                ) : warehouseStock && warehouseStock.length > 0 ? (
                  warehouseStock.map((item, idx) => (
                    <tr key={item._id || idx}>
                      <td>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id={`check-${item._id}`} />
                          <label className="form-check-label" htmlFor={`check-${item._id}`} />
                        </div>
                      </td>
                      <td>{item._id}</td>
                      <td>{item.warehouse}</td>
                      <td>{item.product}</td>
                      <td>{item.variant}</td>
                      <td>{item.quantity}</td>
                      <td>{item.reserved}</td>
                      <td>{item.reorderLevel}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to="" className="btn btn-light btn-sm">
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                          </Link>
                          <Link to="" className="btn btn-soft-primary btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </Link>
                          <Link to="" className="btn btn-soft-danger btn-sm">
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <TableNoData colSpan={10} />
                )}
              </tbody>
            </table>
          </div>
        </div>
        <CardFooter className="border-top">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end mb-0">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </CardFooter>
      </Card>
    </Col>
  </Row>;
};
export default WarehouseList;
