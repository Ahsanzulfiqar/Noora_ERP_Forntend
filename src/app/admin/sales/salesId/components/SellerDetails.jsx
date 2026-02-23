import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ROLES } from '@/assets/data/roles';
import useUserRole from '@/hooks/useUserRole';
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

  const role = useUserRole();

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
        <Col xs={12}>
          {/* Header Card */}
          <Card className="border-0 shadow-sm mb-4">
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h4 className="mb-1 text-dark fw-bold">Invoice #{saleData?.invoiceNo}</h4>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted fs-14">Status:</span>
                    <span className={`badge py-1 px-3 text-uppercase fs-12 bg-${saleData?.status === 'completed' ? 'success' : saleData?.status === 'pending' ? 'warning' : 'info'}`}>
                      {saleData?.status}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="hstack gap-2">
                    {(saleData?.status === 'draft' || saleData?.status === 'DRAFT') ? (
                      <Link to={`/sales/sales-edit/${saleData?._id}`} className="btn btn-soft-primary btn-sm d-flex align-items-center gap-1">
                        <IconifyIcon icon="solar:pen-2-broken" className="fs-16" /> Edit Order
                      </Link>
                    ) : (
                      <button className="btn btn-light btn-sm d-flex align-items-center gap-1" disabled style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                        <IconifyIcon icon="solar:pen-2-broken" className="fs-16" /> Edit
                      </button>
                    )}

                    {(role === ROLES.ADMIN || role === ROLES.MANAGER) && (
                      <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn-sm d-flex align-items-center gap-1 arrow-none">
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
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={8}>
          {/* Order Items */}
          <Card className="border-0 shadow-sm mb-4">
            <CardBody className="p-0 overflow-hidden">
              <div className="p-3 bg-light-subtle border-bottom">
                <h5 className="mb-0 text-dark fw-bold">Order Items</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-hover table-nowrap align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-muted text-uppercase fs-12">Product</th>
                      <th className="text-muted text-uppercase fs-12">Variant</th>
                      <th className="text-muted text-uppercase fs-12 text-center">Qty</th>
                      <th className="text-muted text-uppercase fs-12">Price</th>
                      <th className="text-muted text-uppercase fs-12 text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleData?.items?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar-sm bg-light rounded d-flex align-items-center justify-content-center">
                              <IconifyIcon icon="solar:box-minimalistic-bold-duotone" className="fs-20 text-dark" />
                            </div>
                            <span className="text-dark fw-medium">{item.productName}</span>
                          </div>
                        </td>
                        <td>{item.variant || 'N/A'}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td>${item.salePrice?.toFixed(2)}</td>
                        <td className="text-end fw-bold text-dark">${item.lineTotal?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {/* Status History */}
          {saleData?.statusHistory && saleData.statusHistory.length > 0 && (
            <Card className="border-0 shadow-sm mt-4">
              <CardBody className="p-4">
                <h5 className="mb-4 text-dark fw-bold">Status History</h5>
                <div className="position-relative">
                  {saleData.statusHistory.map((history, index) => (
                    <div key={index} className="d-flex gap-4 mb-4 position-relative">
                      <div className="flex-shrink-0">
                        <div className="avatar-md bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center border border-white shadow-sm">
                          <IconifyIcon icon="solar:history-broken" className="fs-24" />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-dark fw-bold text-capitalize fs-15">{history.status.replace(/_/g, ' ')}</h6>
                        <p className="mb-2 text-muted fs-13">{new Date(history.at).toLocaleString()}</p>
                        {history.note && (
                          <div className="p-3 bg-light-subtle rounded-3 text-dark fs-14 border-0 lh-base">
                            {history.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </Col>

        <Col lg={4}>
          {/* Order Summary */}
          <Card className="border-0 shadow-sm mb-4">
            <CardBody>
              <h5 className="mb-3 text-dark fw-bold">Order Summary</h5>
              <div className="table-responsive">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted">Total Items</td>
                      <td className="text-end fw-medium text-dark">{saleData?.items?.length || 0}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Subtotal</td>
                      <td className="text-end fw-medium text-dark">${saleData?.totalAmount?.toFixed(2) || '0.00'}</td>
                    </tr>
                    <tr className="border-top">
                      <td className="pt-3 fw-bold text-dark fs-16">Total Amount</td>
                      <td className="pt-3 text-end fw-bold text-primary fs-16">${saleData?.totalAmount?.toFixed(2) || '0.00'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {/* Logistics Info */}
          <Card className="border-0 shadow-sm mb-4">
            <CardBody>
              <h5 className="mb-3 text-dark fw-bold">Delivery Info</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-sm bg-light-subtle text-primary rounded d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:delivery-bold-duotone" className="fs-24" />
                  </div>
                  <div>
                    <p className="mb-0 text-muted fs-13">Courier Service</p>
                    <h6 className="mb-0 text-dark fw-medium">{saleData?.courier?.courierName || 'N/A'}</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-sm bg-light-subtle text-primary rounded d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:map-point-bold-duotone" className="fs-24" />
                  </div>
                  <div>
                    <p className="mb-0 text-muted fs-13">Tracking Number</p>
                    <h6 className="mb-0 text-dark fw-medium">{saleData?.courier?.trackingNo || 'N/A'}</h6>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Source Info */}
          <Card className="border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-3 text-dark fw-bold">Source Details</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-sm bg-light-subtle text-info rounded d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:shop-bold-duotone" className="fs-24" />
                  </div>
                  <div>
                    <p className="mb-0 text-muted fs-13">Seller</p>
                    <h6 className="mb-0 text-dark fw-medium">{saleData?.seller || 'N/A'}</h6>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-sm bg-light-subtle text-info rounded d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:box-bold-duotone" className="fs-24" />
                  </div>
                  <div>
                    <p className="mb-0 text-muted fs-13">Warehouse</p>
                    <h6 className="mb-0 text-dark fw-medium">{saleData?.warehouse || 'N/A'}</h6>
                  </div>
                </div>
              </div>
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