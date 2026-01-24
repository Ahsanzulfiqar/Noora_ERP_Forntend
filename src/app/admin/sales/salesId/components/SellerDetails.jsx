import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Box } from '@mui/material';
import { Card, CardBody, CardTitle, Col, Row, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ConfirmSaleModal from './modals/ConfirmSaleModal';
import OutForDeliveryModal from './modals/OutForDeliveryModal';
import DeliveredModal from './modals/DeliveredModal';
import ReturnSaleModal from './modals/ReturnSaleModal';
import CancelSaleModal from './modals/CancelSaleModal';
import DraftSaleModal from './modals/DraftSaleModal';

const SalesDetail = ({ saleData, isLoadingSale }) => {
  const [activeModal, setActiveModal] = useState(null);

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft', modal: 'DRAFT' },
    { value: 'CONFIRMED', label: 'Confirmed', modal: 'CONFIRM' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', modal: 'OUT_FOR_DELIVERY' },
    { value: 'DELIVERED', label: 'Delivered', modal: 'DELIVERED' },
    { value: 'CANCELLED', label: 'Cancelled', modal: 'CANCEL' },
    { value: 'RETURNED', label: 'Returned', modal: 'RETURN' },
  ];

  const handleActionClick = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModals = () => {
    setActiveModal(null);
  };

  if (isLoadingSale) {
    return (
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <p>Loading...</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              <Row className="g-3 pb-4">
                <Col lg={6}>
                  {/* Left column empty or for other content */}
                </Col>
                <Col lg={6}>
                  <Box className="gap-1 hstack justify-content-end">
                    <Link to={`/sales/sales-edit/${saleData?._id}`} className="btn btn-light btn-sm">
                      <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                    </Link>
                    <Link to="" className="btn btn-danger btn-sm">
                      <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                    </Link>
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" id="dropdown-basic" className="d-flex align-items-center gap-1 arrow-none" style={{ borderRadius: '10px' }}>
                        Actions <IconifyIcon icon="solar:alt-arrow-down-bold" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {statusOptions.map((option) => (
                          <Dropdown.Item
                            key={option.value}
                            onClick={() => handleActionClick(option.modal)}
                          >
                            {option.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Box>
                </Col>
              </Row>
              <Row className="g-3">
                <Col lg={8} className="border-end">
                  <div>
                    <h4 className="mb-1">Invoice #{saleData?.invoiceNo}</h4>
                    <p className="mb-1">
                      Status: <span className={`badge bg-${saleData?.status === 'completed' ? 'success' : saleData?.status === 'pending' ? 'warning' : 'info'}`}>
                        {saleData?.status}
                      </span>
                    </p>
                    <div className="mt-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                          <IconifyIcon icon="solar:user-bold-duotone" className="fs-20 text-primary" />
                        </div>
                        <p className="mb-0 fs-15">Seller: {saleData?.seller}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                          <IconifyIcon icon="solar:box-bold-duotone" className="fs-20 text-primary" />
                        </div>
                        <p className="mb-0 fs-15">Warehouse: {saleData?.warehouse}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                          <IconifyIcon icon="solar:delivery-bold-duotone" className="fs-20 text-primary" />
                        </div>
                        <p className="mb-0 fs-15">Courier: {saleData?.courierName || 'N/A'}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                          <IconifyIcon icon="solar:map-point-bold-duotone" className="fs-20 text-primary" />
                        </div>
                        <p className="mb-0 fs-15">Tracking: {saleData?.trackingNo || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={4}>
                  <CardTitle as={'h4'}>Order Summary</CardTitle>
                  <Row className="text-center g-2 mt-2">
                    <Col lg={12} xs={12}>
                      <div className="bg-body p-2 rounded">
                        <h5 className="mb-1">${saleData?.totalAmount?.toFixed(2) || '0.00'}</h5>
                        <p className="text-muted mb-0">Total Amount</p>
                      </div>
                    </Col>
                    <Col lg={12} xs={12}>
                      <div className="bg-body p-2 rounded">
                        <h5 className="mb-1">{saleData?.items?.length || 0}</h5>
                        <p className="text-muted mb-0">Total Items</p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr className="my-4" />
              <CardTitle as={'h4'} className="mb-3">
                Order Items
              </CardTitle>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Variant</th>
                      <th>Quantity</th>
                      <th>Sale Price</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleData?.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.variant || 'N/A'}</td>
                        <td>{item.quantity}</td>
                        <td>${item.salePrice?.toFixed(2)}</td>
                        <td>${item.lineTotal?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {saleData?.statusHistory && saleData.statusHistory.length > 0 && (
                <>
                  <hr className="my-4" />
                  <CardTitle as={'h4'} className="mb-3">
                    Status History
                  </CardTitle>
                  <div className="timeline">
                    {saleData.statusHistory.map((history, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex gap-2">
                          <div className="avatar-sm bg-light d-flex align-items-center justify-content-center rounded">
                            <IconifyIcon icon="solar:history-bold-duotone" className="fs-20 text-primary" />
                          </div>
                          <div>
                            <p className="mb-0 fw-medium">{history.status}</p>
                            <small className="text-muted">{new Date(history.at).toLocaleString()}</small>
                            {history.note && <p className="mb-0 mt-1">{history.note}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      {saleData && (
        <>
          <ConfirmSaleModal
            show={activeModal === 'CONFIRM'}
            onHide={closeModals}
            saleId={saleData._id}
          />
          <OutForDeliveryModal
            show={activeModal === 'OUT_FOR_DELIVERY'}
            onHide={closeModals}
            saleId={saleData._id}
          />
          <DeliveredModal
            show={activeModal === 'DELIVERED'}
            onHide={closeModals}
            saleId={saleData._id}
          />
          <ReturnSaleModal
            show={activeModal === 'RETURN'}
            onHide={closeModals}
            saleId={saleData._id}
          />
          <CancelSaleModal
            show={activeModal === 'CANCEL'}
            onHide={closeModals}
            saleId={saleData._id}
          />
          <DraftSaleModal
            show={activeModal === 'DRAFT'}
            onHide={closeModals}
            saleId={saleData._id}
          />
        </>
      )}
    </>
  );
};
export default SalesDetail;