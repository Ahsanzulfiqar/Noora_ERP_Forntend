import PageTItle from '@/components/PageTItle'
import { useState, useEffect } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import GlobalSpinner from '@/components/loaders/GlobalSpinner'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import StatusAlert from '@/components/StatusAlert'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import {
  useGetStockTransferByIdQuery,
  useConfirmStockTransferMutation,
  useCancelStockTransferMutation,
} from '@/services/authenticateendpoint/stockTransfer'
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse'
import { useGetAllProductsQuery } from '@/services/authenticateendpoint/product'

const statusBadgeClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'draft':
      return 'bg-warning text-dark px-2 py-1 rounded text-capitalize'
    case 'confirmed':
    case 'completed':
      return 'bg-success text-white px-2 py-1 rounded text-capitalize'
    case 'cancelled':
      return 'bg-danger text-white px-2 py-1 rounded text-capitalize'
    default:
      return 'bg-light text-dark px-2 py-1 rounded text-capitalize'
  }
}

const StockTransferDetailPage = () => {
  const { id } = useParams()

  const { data: transfer, isLoading, error: transferError, refetch: refetchTransfer } = useGetStockTransferByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  })

  const { data: warehouses, error: warehousesError } = useGetAllWarehousesQuery()
  const { data: products, error: productsError } = useGetAllProductsQuery()

  const warehouseMap = (warehouses || []).reduce((acc, w) => {
    acc[w._id] = w.name
    return acc
  }, {})
  const productMap = (products || []).reduce((acc, p) => {
    acc[p._id] = p.name
    return acc
  }, {})

  const [confirmStockTransfer, { isLoading: isConfirming, isSuccess: isConfirmSuccess, error: confirmError }] =
    useConfirmStockTransferMutation()
  const [cancelStockTransfer, { isLoading: isCancelling, isSuccess: isCancelSuccess, error: cancelError }] =
    useCancelStockTransferMutation()

  const [showConfirm, setShowConfirm] = useState(false)
  const [showCancel, setShowCancel] = useState(false)

  useEffect(() => {
    if (transferError) toast.error(extractApiErrorMessage(transferError));
  }, [transferError]);
  useEffect(() => {
    if (warehousesError) toast.error(extractApiErrorMessage(warehousesError));
  }, [warehousesError]);
  useEffect(() => {
    if (productsError) toast.error(extractApiErrorMessage(productsError));
  }, [productsError]);
  useEffect(() => {
    if (confirmError) toast.error(extractApiErrorMessage(confirmError));
  }, [confirmError]);
  useEffect(() => {
    if (cancelError) toast.error(extractApiErrorMessage(cancelError));
  }, [cancelError]);

  const handleConfirm = async () => {
    try {
      await confirmStockTransfer(id).unwrap()
      setShowConfirm(false)
    } catch (err) {
      console.error('Failed to confirm stock transfer:', err)
    }
  }

  const handleCancel = async () => {
    try {
      await cancelStockTransfer(id).unwrap()
      setShowCancel(false)
    } catch (err) {
      console.error('Failed to cancel stock transfer:', err)
    }
  }

  if (isLoading) {
    return (
      <Col lg={12}>
        <Card>
          <CardBody>
            <GlobalSpinner show={isLoading} />
          </CardBody>
        </Card>
      </Col>
    )
  }

  const isDraft = (transfer?.status || '').toLowerCase() === 'draft'

  return (
    <>
      <PageTItle title="Stock Transfer Detail" />

      <StatusAlert
        isSuccess={isConfirmSuccess}
        message="Stock transfer confirmed successfully"
        error={confirmError}
      />
      <StatusAlert
        isSuccess={isCancelSuccess}
        message="Stock transfer cancelled successfully"
        error={cancelError}
      />

      <DeleteConfirmModal
        show={showConfirm}
        title="Confirm Stock Transfer"
        message="Are you sure you want to confirm this stock transfer?"
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        confirmVariant="success"
        loading={isConfirming}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <DeleteConfirmModal
        show={showCancel}
        title="Cancel Stock Transfer"
        message="Are you sure you want to cancel this stock transfer?"
        confirmText="Yes, Cancel"
        cancelText="Back"
        confirmVariant="danger"
        loading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />

      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">Stock Transfer Details</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {isDraft && (
                      <>
                        <Button
                          variant="success"
                          className="btn btn-sm btn-success"
                          onClick={() => setShowConfirm(true)}
                          disabled={isConfirming}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="danger"
                          className="btn btn-sm btn-danger"
                          onClick={() => setShowCancel(true)}
                          disabled={isCancelling}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    <Link to="/inventory/transfer-stock" className="btn btn-sm btn-outline-secondary">
                      Back
                    </Link>
                    {!isDraft && (
                      <Typography variant="body2" className={statusBadgeClass(transfer?.status)}>
                        {transfer?.status || '-'}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardTitle>
            </CardHeader>

            <CardBody>
              <div className="d-flex flex-row gap-5 flex-wrap">
                <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">
                  <li>
                    <span className="fw-medium text-dark fw-bold">Transfer No:&nbsp;</span>
                    {transfer?.transferNo || '-'}
                  </li>
                  <li>
                    <span className="fw-medium text-dark fw-bold">From Warehouse:&nbsp;</span>
                    {warehouseMap[transfer?.fromWarehouse] || transfer?.fromWarehouse || '-'}
                  </li>
                  <li>
                    <span className="fw-medium text-dark fw-bold">To Warehouse:&nbsp;</span>
                    {warehouseMap[transfer?.toWarehouse] || transfer?.toWarehouse || '-'}
                  </li>
                </ul>

                <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">
                  <li>
                    <span className="fw-medium text-dark fw-bold">Status:&nbsp;</span>
                    {transfer?.status || '-'}
                  </li>
                  <li>
                    <span className="fw-medium text-dark fw-bold">Created At:&nbsp;</span>
                    {transfer?.createdAt ? new Date(transfer.createdAt).toLocaleString() : '-'}
                  </li>
                  <li>
                    <span className="fw-medium text-dark fw-bold">Confirmed At:&nbsp;</span>
                    {transfer?.confirmedAt ? new Date(transfer.confirmedAt).toLocaleString() : '-'}
                  </li>
                </ul>

                <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">
                  <li>
                    <span className="fw-medium text-dark fw-bold">Note:&nbsp;</span>
                    {transfer?.note || '-'}
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <h5 className="mb-3">Items</h5>
                <div className="table-responsive">
                  <table className="table table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Variant</th>
                        <th>Batch No</th>
                        <th>Expiry Date</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transfer?.items && transfer.items.length > 0 ? (
                        transfer.items.map((item, index) => (
                          <tr key={index}>
                            <td>{productMap[item.product] || item.product || '-'}</td>
                            <td>{item.variant || '-'}</td>
                            <td>{item.batchNo || '-'}</td>
                            <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}</td>
                            <td>{item.quantity}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No items found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default StockTransferDetailPage
