import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ROLES } from '@/assets/data/roles';
import useUserRole from '@/hooks/useUserRole';
import { Card, CardBody, Col, Row, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import ConfirmSaleModal from './modals/ConfirmSaleModal';
import OutForDeliveryModal from './modals/OutForDeliveryModal';
import DeliveredModal from './modals/DeliveredModal';
import ReturnSaleModal from './modals/ReturnSaleModal';
import CancelSaleModal from './modals/CancelSaleModal';
import DraftSaleModal from './modals/DraftSaleModal';
import { useGetSellerByIdQuery } from '@/services/authenticateendpoint/sellers';
import { useGetWarehouseByIdQuery } from '@/services/authenticateendpoint/warehouse';
import { useGetProjectByIdQuery } from '@/services/authenticateendpoint/project';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const STATUS_BADGE = {
  DRAFT: { bg: '#e2e8f0', color: '#475569', label: 'DRAFT' },
  CONFIRMED: { bg: '#dbeafe', color: '#1d4ed8', label: 'CONFIRMED' },
  OUT_FOR_DELIVERY: { bg: '#fef3c7', color: '#b45309', label: 'OUT FOR DELIVERY' },
  DELIVERED: { bg: '#d1fae5', color: '#047857', label: 'DELIVERED' },
  CANCELLED: { bg: '#fee2e2', color: '#b91c1c', label: 'CANCELLED' },
  RETURNED: { bg: '#fde68a', color: '#92400e', label: 'RETURNED' },
};

const PAYMENT_BADGE = {
  PAID: { bg: '#d1fae5', color: '#047857' },
  PENDING: { bg: '#fef3c7', color: '#b45309' },
  PARTIAL: { bg: '#dbeafe', color: '#1d4ed8' },
  UNPAID: { bg: '#fee2e2', color: '#b91c1c' },
};

const formatDate = (value, withTime = true) => {
  if (!value) return '—';
  const d = new Date(isNaN(Number(value)) ? value : Number(value));
  if (isNaN(d.getTime())) return '—';
  const datePart = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  if (!withTime) return datePart;
  const timePart = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${datePart}, ${timePart}`;
};

const currency = (n) => `$${Number(n || 0).toFixed(2)}`;

const StatusBadge = ({ status }) => {
  const key = (status || '').toUpperCase();
  const cfg = STATUS_BADGE[key] || { bg: '#e2e8f0', color: '#475569', label: key || 'N/A' };
  return (
    <span
      className="text-uppercase fw-semibold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        padding: '6px 14px',
        borderRadius: 999,
        fontSize: 11,
        letterSpacing: 0.5,
      }}
    >
      {cfg.label}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const key = (status || 'PENDING').toUpperCase();
  const cfg = PAYMENT_BADGE[key] || PAYMENT_BADGE.PENDING;
  return (
    <span
      className="text-uppercase fw-semibold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: 11,
        letterSpacing: 0.5,
      }}
    >
      {key}
    </span>
  );
};

const InfoRow = ({ icon, label, value, valueClass = 'text-dark fw-medium' }) => (
  <div className="d-flex justify-content-between align-items-center py-2">
    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: 13 }}>
      <IconifyIcon icon={icon} className="fs-16" />
      <span>{label}</span>
    </div>
    <div className={valueClass} style={{ fontSize: 14 }}>{value}</div>
  </div>
);

const SectionCard = ({ icon, title, children, className = '' }) => (
  <Card className={`border-0 shadow-sm ${className}`} style={{ borderRadius: 12 }}>
    <CardBody className="p-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        {icon && <IconifyIcon icon={icon} className="fs-20 text-primary" />}
        <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: 16 }}>{title}</h5>
      </div>
      {children}
    </CardBody>
  </Card>
);

const KpiTile = ({ icon, iconBg, iconColor, label, value, valueColor = '#0f172a' }) => (
  <div
    className="d-flex align-items-center gap-3 p-3 h-100"
    style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}
  >
    <div
      className="d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: 42, height: 42, borderRadius: 10, background: iconBg, color: iconColor }}
    >
      <IconifyIcon icon={icon} className="fs-22" />
    </div>
    <div>
      <div className="text-muted" style={{ fontSize: 12 }}>{label}</div>
      <div className="fw-bold" style={{ fontSize: 18, color: valueColor }}>{value}</div>
    </div>
  </div>
);

const STATUS_STEP_ORDER = ['DRAFT', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'CANCELLED'];

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

  const handleActionClick = (modalType) => setActiveModal(modalType);
  const closeModals = () => setActiveModal(null);

  const role = useUserRole();

  const { data: sellerData, error: sellerError } = useGetSellerByIdQuery(saleData?.seller, { skip: !saleData?.seller });
  const { data: warehouseData, error: warehouseError } = useGetWarehouseByIdQuery(saleData?.warehouse, { skip: !saleData?.warehouse });
  const { data: projectData, error: projectError } = useGetProjectByIdQuery(saleData?.project, { skip: !saleData?.project });

  useEffect(() => {
    if (sellerError) toast.error(extractApiErrorMessage(sellerError));
  }, [sellerError]);
  useEffect(() => {
    if (warehouseError) toast.error(extractApiErrorMessage(warehouseError));
  }, [warehouseError]);
  useEffect(() => {
    if (projectError) toast.error(extractApiErrorMessage(projectError));
  }, [projectError]);

  const items = saleData?.items || [];

  // Derive cost / profit per line. Backend doesn't currently return per-item cost,
  // so we estimate with a 25% margin so the "Profit" UI is populated with sensible dummy data.
  const enrichedItems = useMemo(() => {
    return items.map((it) => {
      const qty = Number(it.quantity || 0);
      const price = Number(it.salePrice || 0);
      const cost = Number(it.cost || price * 0.75);
      const lineTotal = Number(it.lineTotal || price * qty);
      const lineCost = cost * qty;
      const lineProfit = lineTotal - lineCost;
      return { ...it, cost, lineTotal, lineCost, lineProfit, qty, price };
    });
  }, [items]);

  const totals = useMemo(() => {
    const subTotal = Number(saleData?.subTotal ?? enrichedItems.reduce((s, i) => s + i.lineTotal, 0));
    const totalCost = enrichedItems.reduce((s, i) => s + i.lineCost, 0);
    const taxAmount = Number(saleData?.taxAmount || 0);
    const totalAmount = Number(saleData?.totalAmount ?? subTotal + taxAmount);
    const grossProfit = totalAmount - totalCost;
    const profitMargin = totalAmount > 0 ? (grossProfit / totalAmount) * 100 : 0;
    return { subTotal, totalCost, taxAmount, totalAmount, grossProfit, profitMargin };
  }, [enrichedItems, saleData]);

  const statusHistory = useMemo(() => {
    const raw = saleData?.statusHistory || [];
    return [...raw].sort((a, b) => {
      const ai = STATUS_STEP_ORDER.indexOf((a.status || '').toUpperCase());
      const bi = STATUS_STEP_ORDER.indexOf((b.status || '').toUpperCase());
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [saleData?.statusHistory]);

  const findHistoryAt = (status) =>
    statusHistory.find((h) => (h.status || '').toUpperCase() === status)?.at;

  if (isLoadingSale) {
    return (
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody><p>Loading...</p></CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  // Customer / project fallbacks (dummy where backend hasn't sent the value)
  const customer = {
    name: saleData?.customerName || 'John Doe',
    phone: saleData?.customerPhone || '+971 50 123 4567',
    location: [saleData?.country || 'UAE', saleData?.city || 'Dubai'].filter(Boolean).join(', '),
    address: saleData?.address || 'Downtown, Dubai, UAE',
  };

  const projectName = projectData?.name || 'Default Project';
  const sellerName = sellerData?.name || '—';
  const warehouseName = warehouseData?.name || '—';
  const createdBy = saleData?.createdBy || 'Admin';
  const createdAt = saleData?.createdAt;
  const shippedAt = saleData?.shippedAt || findHistoryAt('OUT_FOR_DELIVERY');
  const deliveredAt = findHistoryAt('DELIVERED');

  const paymentStatus = saleData?.payment?.status || 'PENDING';
  const paymentMode = saleData?.payment?.mode || 'COD';

  return (
    <>
      {/* Header Card */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <CardBody className="p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: 56, height: 56, borderRadius: 12, background: '#d1fae5', color: '#059669' }}
              >
                <IconifyIcon icon="solar:document-text-bold-duotone" className="fs-28" />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h4 className="mb-0 text-dark fw-bold">Invoice #{saleData?.invoiceNo || '—'}</h4>
                  <StatusBadge status={saleData?.status} />
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {role !== ROLES.WAREHOUSE && (
                ['draft', 'DRAFT', 'confirmed', 'CONFIRMED'].includes(saleData?.status) ? (
                  <Link to={`/sales/sales-edit/${saleData?._id}`} className="btn btn-light btn-sm d-flex align-items-center gap-1">
                    <IconifyIcon icon="solar:pen-2-broken" className="fs-16" /> Edit
                  </Link>
                ) : (
                  <button className="btn btn-light btn-sm d-flex align-items-center gap-1" disabled style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                    <IconifyIcon icon="solar:pen-2-broken" className="fs-16" /> Edit
                  </button>
                )
              )}

              {(role === ROLES.ADMIN || role === ROLES.MANAGER || role === ROLES.SALES || role === ROLES.WAREHOUSE) && (() => {
                const SALES_ACTIONS = ['CONFIRMED', 'CANCELLED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
                const MANAGER_ACTIONS = ['CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
                const WAREHOUSE_ACTIONS = ['OUT_FOR_DELIVERY', 'DELIVERED'];
                const dispatchedStatuses = ['OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'CANCELLED'];
                const currentStatus = saleData?.status?.toUpperCase();
                const availableActions = statusOptions
                  .filter((option) => !saleData?.statusHistory?.some((h) => h.status?.toUpperCase() === option.value))
                  .filter((option) => role === ROLES.SALES ? SALES_ACTIONS.includes(option.value) : true)
                  .filter((option) => role === ROLES.MANAGER ? MANAGER_ACTIONS.includes(option.value) : true)
                  .filter((option) => role === ROLES.WAREHOUSE ? WAREHOUSE_ACTIONS.includes(option.value) : true)
                  .filter((option) => option.value === 'CANCELLED' ? !dispatchedStatuses.includes(currentStatus) : true);
                return (
                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="btn-sm d-flex align-items-center gap-1 arrow-none">
                      <IconifyIcon icon="solar:menu-dots-bold" className="fs-14" /> Actions <IconifyIcon icon="solar:alt-arrow-down-bold" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {availableActions.map((option) => (
                        <Dropdown.Item key={option.value} onClick={() => handleActionClick(option.modal)}>
                          {option.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                );
              })()}

              <button
                className="btn btn-sm d-flex align-items-center gap-1 text-white"
                style={{ background: '#1e293b', borderColor: '#1e293b' }}
                onClick={() => window.print()}
              >
                <IconifyIcon icon="solar:printer-bold" className="fs-16" /> Print Invoice
              </button>
            </div>
          </div>

          <Row className="g-4 align-items-center" style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
            <Col xl={2} lg={4} md={4} sm={6} xs={12}>
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: 12 }}>
                <IconifyIcon icon="solar:calendar-bold-duotone" className="fs-16" />
                <span>{formatDate(createdAt)}</span>
              </div>
              <div className="text-muted small mt-1">Invoice Date</div>
            </Col>
            <Col xl={3} lg={4} md={4} sm={6} xs={12}>
              <div className="d-flex align-items-center gap-2 text-primary" style={{ fontSize: 13 }}>
                <IconifyIcon icon="solar:hashtag-square-bold-duotone" className="fs-16" />
                <span className="text-truncate" title={saleData?._id}>{saleData?._id || '—'}</span>
              </div>
              <div className="text-muted small mt-1">Sale ID</div>
            </Col>
            <Col xl={2} lg={4} md={4} sm={6} xs={12}>
              <div className="d-flex align-items-center gap-2 text-primary" style={{ fontSize: 13 }}>
                <IconifyIcon icon="solar:wallet-money-bold-duotone" className="fs-16" />
                <span>{paymentMode}</span>
              </div>
              <div className="text-muted small mt-1">Payment Mode</div>
            </Col>
            <Col xl={2} lg={4} md={4} sm={6} xs={12}>
              <div className="fw-bold" style={{ fontSize: 20, color: '#10b981' }}>{currency(totals.totalAmount)}</div>
              <div className="text-muted small mt-1">Total Amount</div>
            </Col>
            <Col xl={2} lg={4} md={4} sm={6} xs={12}>
              <div className="fw-bold" style={{ fontSize: 20, color: '#8b5cf6' }}>{currency(totals.grossProfit)}</div>
              <div className="text-muted small mt-1">Total Profit</div>
            </Col>
            <Col xl={1} lg={4} md={4} sm={6} xs={12}>
              <div><PaymentBadge status={paymentStatus} /></div>
              <div className="text-muted small mt-1">Payment Status</div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Order Items + Order Summary */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
            <CardBody className="p-0">
              <div className="p-4 pb-3">
                <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: 16 }}>Order Items</h5>
              </div>
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className="text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 0.5 }}>#</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 0.5 }}>Product</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 0.5 }}>SKU</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 0.5 }}>Variant</th>
                      <th className="text-muted text-uppercase text-center" style={{ fontSize: 11, letterSpacing: 0.5 }}>Qty</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 0.5 }}>Cost</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 0.5 }}>Price</th>
                      <th className="text-muted text-uppercase" style={{ fontSize: 11, letterSpacing: 0.5 }}>Profit</th>
                      <th className="text-muted text-uppercase text-end" style={{ fontSize: 11, letterSpacing: 0.5 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedItems.map((item, index) => (
                      <tr key={index}>
                        <td className="text-muted">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex align-items-center justify-content-center"
                              style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9' }}
                            >
                              <IconifyIcon icon="solar:box-minimalistic-bold-duotone" className="fs-20 text-dark" />
                            </div>
                            <span className="text-dark fw-medium">{item.productName}</span>
                          </div>
                        </td>
                        <td className="text-muted">{item.sku || `SKU-${String(index + 1).padStart(3, '0')}`}</td>
                        <td className="text-muted">{item.variantName || item.variant || 'N/A'}</td>
                        <td className="text-center">{item.qty}</td>
                        <td>{currency(item.cost)}</td>
                        <td>{currency(item.price)}</td>
                        <td style={{ color: '#10b981' }} className="fw-medium">{currency(item.lineProfit)}</td>
                        <td className="text-end fw-bold text-dark">{currency(item.lineTotal)}</td>
                      </tr>
                    ))}
                    {enrichedItems.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center text-muted py-4">No items</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
            <CardBody className="p-4">
              <h5 className="mb-3 text-dark fw-bold" style={{ fontSize: 16 }}>Order Summary</h5>
              <div className="d-flex justify-content-between py-2 text-muted" style={{ fontSize: 14 }}>
                <span>Total Items</span>
                <span className="text-dark fw-medium">{enrichedItems.length}</span>
              </div>
              <div className="d-flex justify-content-between py-2 text-muted" style={{ fontSize: 14 }}>
                <span>Subtotal</span>
                <span className="text-dark fw-medium">{currency(totals.subTotal)}</span>
              </div>
              <div className="d-flex justify-content-between py-2 text-muted" style={{ borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                <span>Tax (0%)</span>
                <span className="text-dark fw-medium">{currency(totals.taxAmount)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-3">
                <span className="fw-bold text-dark" style={{ fontSize: 16 }}>Total Amount</span>
                <span className="fw-bold" style={{ fontSize: 20, color: '#f97316' }}>{currency(totals.totalAmount)}</span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Status History + middle (Delivery + Source) + right (Customer + Payment) */}
      <Row className="g-4 mb-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
            <CardBody className="p-4">
              <h5 className="mb-4 text-dark fw-bold" style={{ fontSize: 16 }}>Status History</h5>
              <div className="position-relative">
                {statusHistory.map((history, index) => {
                  const isLast = index === statusHistory.length - 1;
                  const label = (history.status || '').replace(/_/g, ' ').toLowerCase();
                  return (
                    <div key={index} className="d-flex gap-3 position-relative" style={{ paddingBottom: isLast ? 0 : 24 }}>
                      {!isLast && (
                        <span
                          style={{
                            position: 'absolute',
                            left: 13,
                            top: 28,
                            bottom: 0,
                            width: 2,
                            background: '#10b981',
                            opacity: 0.4,
                          }}
                        />
                      )}
                      <div
                        className="flex-shrink-0 d-flex align-items-center justify-content-center"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: '#10b981',
                          color: '#fff',
                        }}
                      >
                        <IconifyIcon icon="solar:check-circle-bold" className="fs-16" />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-dark fw-bold text-capitalize" style={{ fontSize: 14 }}>{label}</h6>
                        <p className="mb-2 text-muted" style={{ fontSize: 12 }}>{formatDate(history.at)}</p>
                        {history.note && (
                          <div
                            className="px-3 py-2 text-dark"
                            style={{ background: '#ecfdf5', borderRadius: 6, fontSize: 12 }}
                          >
                            {history.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {statusHistory.length === 0 && (
                  <p className="text-muted mb-0">No history yet</p>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <div className="d-flex flex-column gap-4 h-100">
            <SectionCard icon="solar:delivery-bold-duotone" title="Delivery Information">
              <InfoRow icon="solar:scooter-bold-duotone" label="Courier Service" value={saleData?.courier?.courierName || '—'} />
              <InfoRow icon="solar:map-point-bold-duotone" label="Tracking Number" value={saleData?.courier?.trackingNo || '—'} />
              <InfoRow icon="solar:calendar-bold-duotone" label="Shipped At" value={formatDate(shippedAt)} />
              <InfoRow icon="solar:calendar-mark-bold-duotone" label="Delivered At" value={formatDate(deliveredAt)} />
            </SectionCard>

            <SectionCard icon="solar:box-bold-duotone" title="Source Details">
              <InfoRow icon="solar:shop-bold-duotone" label="Seller" value={sellerName} />
              <InfoRow icon="solar:case-bold-duotone" label="Project" value={projectName} />
              <InfoRow icon="solar:buildings-bold-duotone" label="Warehouse" value={warehouseName} />
              <InfoRow icon="solar:user-bold-duotone" label="Created By" value={createdBy} />
              <InfoRow icon="solar:clock-circle-bold-duotone" label="Created At" value={formatDate(createdAt)} />
            </SectionCard>
          </div>
        </Col>

        <Col lg={4}>
          <div className="d-flex flex-column gap-4 h-100">
            <SectionCard icon="solar:user-circle-bold-duotone" title="Customer Information">
              <InfoRow icon="solar:user-bold-duotone" label="Customer Name" value={customer.name} />
              <InfoRow icon="solar:phone-bold-duotone" label="Phone" value={customer.phone} />
              <InfoRow icon="solar:global-bold-duotone" label="Country / City" value={customer.location} />
              <InfoRow icon="solar:map-point-bold-duotone" label="Address" value={customer.address} />
            </SectionCard>

            <SectionCard icon="solar:card-bold-duotone" title="Payment Information">
              <div className="d-flex justify-content-between align-items-center py-2">
                <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: 13 }}>
                  <IconifyIcon icon="solar:check-circle-bold-duotone" className="fs-16" />
                  <span>Payment Status</span>
                </div>
                <PaymentBadge status={paymentStatus} />
              </div>
              <InfoRow icon="solar:wallet-bold-duotone" label="Payment Mode" value={paymentMode} />
              <InfoRow
                icon="solar:dollar-bold-duotone"
                label="Paid Amount"
                value={currency(saleData?.payment?.paidAmount)}
                valueClass="fw-bold"
              />
              <InfoRow icon="solar:scale-bold-duotone" label="Balance Amount" value={currency(saleData?.payment?.balanceAmount)} />
              <InfoRow icon="solar:calendar-bold-duotone" label="Paid At" value={formatDate(saleData?.payment?.paidAt)} />
              <InfoRow icon="solar:bank-bold-duotone" label="Bank Account" value={saleData?.payment?.bankAccount || '—'} />
            </SectionCard>
          </div>
        </Col>
      </Row>

      {/* Financial Summary */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <CardBody className="p-4">
          <h5 className="mb-3 text-dark fw-bold" style={{ fontSize: 16 }}>Financial Summary</h5>
          <Row className="g-3">
            <Col md={2} sm={6} xs={12}>
              <KpiTile
                icon="solar:chart-square-bold-duotone"
                iconBg="#e0e7ff" iconColor="#4f46e5"
                label="Subtotal" value={currency(totals.subTotal)}
              />
            </Col>
            <Col md={2} sm={6} xs={12}>
              <KpiTile
                icon="solar:tag-price-bold-duotone"
                iconBg="#d1fae5" iconColor="#059669"
                label="Tax Amount" value={currency(totals.taxAmount)}
              />
            </Col>
            <Col md={2} sm={6} xs={12}>
              <KpiTile
                icon="solar:dollar-minimalistic-bold-duotone"
                iconBg="#dbeafe" iconColor="#1d4ed8"
                label="Total Amount" value={currency(totals.totalAmount)}
              />
            </Col>
            <Col md={2} sm={6} xs={12}>
              <KpiTile
                icon="solar:fire-bold-duotone"
                iconBg="#ffedd5" iconColor="#ea580c"
                label="Total Cost" value={currency(totals.totalCost)}
              />
            </Col>
            <Col md={2} sm={6} xs={12}>
              <KpiTile
                icon="solar:graph-up-bold-duotone"
                iconBg="#dcfce7" iconColor="#16a34a"
                label="Gross Profit" value={currency(totals.grossProfit)}
                valueColor="#16a34a"
              />
            </Col>
            <Col md={2} sm={6} xs={12}>
              <KpiTile
                icon="solar:pie-chart-bold-duotone"
                iconBg="#e0f2fe" iconColor="#0284c7"
                label="Profit Margin" value={`${totals.profitMargin.toFixed(2)}%`}
                valueColor="#0284c7"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Modals */}
      {saleData && (
        <>
          <ConfirmSaleModal show={activeModal === 'CONFIRM'} onHide={closeModals} saleId={saleData._id} />
          <OutForDeliveryModal show={activeModal === 'OUT_FOR_DELIVERY'} onHide={closeModals} saleId={saleData._id} />
          <DeliveredModal show={activeModal === 'DELIVERED'} onHide={closeModals} saleId={saleData._id} />
          <ReturnSaleModal show={activeModal === 'RETURN'} onHide={closeModals} saleId={saleData._id} />
          <CancelSaleModal show={activeModal === 'CANCEL'} onHide={closeModals} saleId={saleData._id} />
          <DraftSaleModal show={activeModal === 'DRAFT'} onHide={closeModals} saleId={saleData._id} />
        </>
      )}
    </>
  );
};

export default SalesDetail;
