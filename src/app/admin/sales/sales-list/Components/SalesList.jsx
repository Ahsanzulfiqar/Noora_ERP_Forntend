import PageTItle from '@/components/PageTItle';
import { useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useGetSalesQuery } from '@/services/endpoints/sales';
import { useGetSellersQuery } from '@/services/endpoints/sellers';
import { Badge, Card, CardBody, Col, Row, Spinner, Table, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'

import CustomTablePaginations from '@/components/table/CustomTablePaginations';

const SalesList = () => {
  const [filter, setFilter] = useState({
    sellerId: '',
    status: '',
    search: ''
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);



  const { data: salesResponse, isLoading, error } = useGetSalesQuery({ page, limit, filter }, { refetchOnMountOrArgChange: true });
  const { data: sellersResponse } = useGetSellersQuery({ limit: 1000 });
  const sellers = sellersResponse?.data || [];

  console.log('salesResponse', salesResponse);
  const salesData = salesResponse?.data || [];

  // Assuming the API returns totalDocs or similar for total items to calculate total pages.
  // If strict totalPages is returned, use that. 
  // Based on typical API response in this project, it might be in salesResponse.total or similar.
  // For now, I will use a safe fallback or calculation if total is available.
  const totalPages = salesResponse?.totalPages || Math.ceil((salesResponse?.total || 0) / limit) || 1;

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'secondary';
      case 'reserved': return 'info';
      case 'shipped': return 'success';
      case 'cancelled': return 'danger';
      default: return 'primary';
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="alert alert-danger" role="alert">
  //       Failed to load sales. Please try again later.
  //     </div>
  //   );
  // }

  return (
    <>
      <PageTItle title="Sales List" />
      <Row>
        <Col xs={12}>
          <Card className='mb-0'>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center gap-1 pb-1">
                <CardTitle as={'h4'} className="flex-grow-1">
                  All Sales Lists
                </CardTitle>
                <Link to="/sales/sales-add" className="btn btn-sm btn-primary">
                  Add Sales
                </Link>
                <Dropdown>
                  <DropdownToggle as={'a'} href="#" className="btn btn-sm btn-outline-light content-none" data-bs-toggle="dropdown" aria-expanded="false">
                    This Month
                    <IconifyIcon width={16} height={16} className="ms-1" icon="bx:chevron-down" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem>Download</DropdownItem>
                    <DropdownItem>Export</DropdownItem>
                    <DropdownItem>Import</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <Row className="g-2">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search by Invoice No, Tracking..."
                    value={filter.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={filter.sellerId}
                    onChange={(e) => handleFilterChange('sellerId', e.target.value)}
                  >
                    <option value="">All Sellers</option>
                    {sellers.map((seller) => (
                      <option key={seller._id} value={seller._id}>
                        {seller.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={filter.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Statutes</option>
                    <option value="draft">Draft</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out For Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </Form.Select>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-responsive" style={{ height: 'calc(100vh - 309px)', overflowY: 'auto' }}>
                <Table hover className="table-centered table-nowrap mb-0">
                  <thead className="bg-light text-muted" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th className="ps-3 uppercase font-weight-bold">Invoice No</th>
                      <th className="uppercase font-weight-bold">Date</th>
                      <th className="uppercase font-weight-bold">Courier Name</th>
                      <th className="uppercase font-weight-bold">Tracking No</th>
                      <th className="uppercase font-weight-bold">Status</th>
                      <th className="uppercase font-weight-bold">Total Amount</th>
                      <th className="text-center uppercase font-weight-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.length > 0 ? (
                      salesData.map((item) => (
                        <tr key={item._id}>
                          <td className="ps-3 fw-bold text-primary">
                            {item.invoiceNo || 'N/A'}
                          </td>
                          <td>
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="fw-semibold">
                            {item.courierName || 'Unknown Customer'}
                          </td>
                          <td>
                            {item.trackingNo || 'No Phone'}
                          </td>
                          <td>
                            <Badge bg={getStatusColor(item.status || 'draft')} className="text-capitalize px-2 py-1">
                              {item.status || 'Draft'}
                            </Badge>
                          </td>
                          <td className="fw-bold text-success">
                            ${(item.totalAmount || 0).toFixed(2)}
                          </td>
                          <td className="text-center">
                            <div className="hstack gap-2 justify-content-center">
                              <Link to={`/sales/sales-detail/${item._id}`} className="btn btn-outline-primary btn-sm rounded-circle p-1 border-0 shadow-none">
                                <IconifyIcon icon="solar:eye-broken" className="fs-18" />
                              </Link>
                              {(item.status === 'draft' || item.status === 'DRAFT') ? (
                                <Link to={`/sales/sales-edit/${item._id}`} className="btn btn-outline-info btn-sm rounded-circle p-1 border-0 shadow-none">
                                  <IconifyIcon icon="solar:pen-2-broken" className="fs-18" />
                                </Link>
                              ) : (
                                <button className="btn btn-outline-info btn-sm rounded-circle p-1 border-0 shadow-none" disabled style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                                  <IconifyIcon icon="solar:pen-2-broken" className="fs-18" />
                                </button>
                              )}

                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center p-5">
                          <div className="text-center">
                            <IconifyIcon icon="solar:bill-list-broken" className="fs-48 text-muted mb-3" />
                            <h4>No Sales Found</h4>
                            <p className="text-muted">Start by adding your first sale.</p>
                            <Link to="/sales/sales-add" className="btn btn-primary">
                              Add New Sale
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <CustomTablePaginations
                limit={limit}
                setLimit={setLimit}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>


      {/* Modals */}

    </>
  );
};

export default SalesList;