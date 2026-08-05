import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import GlobalSpinner from '../../../../../components/loaders/GlobalSpinner';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { usePostToStockMutation } from '@/services/authenticateendpoint/purchases';
import { useConfirmPurchaseMutation } from '@/services/authenticateendpoint/purchases';
import { useState, useEffect } from 'react';
import DeleteConfirmModal from '../../../../../components/DeleteConfirmModal';
import PostToStockModal from './PostToStockModal';
import StatusAlert from '@/components/StatusAlert';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const ItemDetails = ({ isLoadingPurchase, purchaseData }) => {
  const [postToStock, { isLoading: isPosting, isSuccess: isPostSuccess, error: postError }] = usePostToStockMutation();
  const [confirmPurchase, { isLoading: isConfirming, isSuccess: isConfirmSuccess, error: confirmError }] = useConfirmPurchaseMutation();
  const [showPostConfirm, setShowPostConfirm] = useState(false);
  const [showConfirmPurchase, setShowConfirmPurchase] = useState(false);
  const totalAmount = purchaseData?.totalAmount ?? purchaseData?.items?.reduce((sum, item) => sum + (Number(item?.lineTotal) || 0), 0) ?? 0;

  useEffect(() => {
    if (postError) toast.error(extractApiErrorMessage(postError));
  }, [postError]);
  useEffect(() => {
    if (confirmError) toast.error(extractApiErrorMessage(confirmError));
  }, [confirmError]);

  const handlePostToStockClick = () => {
    setShowPostConfirm(true);
  };

  const handleConfirmPostToStock = async ({ items, taxAmount }) => {
    try {
      await postToStock({
        purchaseId: purchaseData?._id,
        items,
        taxAmount,
      }).unwrap();
      setShowPostConfirm(false);
    } catch (err) {
      console.error('Failed to post to stock:', err);
    }
  };

  const handleCancelPostToStock = () => {
    setShowPostConfirm(false);
  };

  const handleConfirmPurchaseClick = () => {
    setShowConfirmPurchase(true);
  };

  const handleConfirmPurchaseAction = async () => {
    try {
      await confirmPurchase(purchaseData?._id).unwrap();
      setShowConfirmPurchase(false);
    } catch (err) {
      console.error('Failed to confirm purchase:', err);
    }
  };

  const handleCancelConfirmPurchase = () => {
    setShowConfirmPurchase(false);
  };
  if (isLoadingPurchase) {
    return (
      <Col lg={12}>
        <Card>
          <CardBody>
            <GlobalSpinner show={isLoadingPurchase} />
          </CardBody>
        </Card>
      </Col>
    );
  }

  return (
    <Col lg={12}>
      <StatusAlert isSuccess={isPostSuccess} message="Purchase posted to stock successfully" error={postError} />
      <StatusAlert isSuccess={isConfirmSuccess} message="Purchase confirmed successfully" error={confirmError} />
      <PostToStockModal
        show={showPostConfirm}
        items={purchaseData?.items || []}
        loading={isPosting}
        onConfirm={handleConfirmPostToStock}
        onCancel={handleCancelPostToStock}
      />
      <DeleteConfirmModal
        show={showConfirmPurchase}
        title="Confirm Purchase"
        message="Are you sure you want to confirm this purchase?"
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        confirmVariant="success"
        loading={isConfirming}
        onConfirm={handleConfirmPurchaseAction}
        onCancel={handleCancelConfirmPurchase}
      />
      <Card>
        {/* <CardHeader>
          <CardTitle as={'h4'}>Purchase Details</CardTitle>
        </CardHeader> */}
        <CardHeader >
          <CardTitle >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Typography variant='h6'>Purchase Details</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {purchaseData?.status === 'draft' &&
                  <Link to={`/purchases/purchase-edit/${purchaseData?._id}`} className="btn btn-sm btn-primary">
                    Edit Purchase
                  </Link>
                }

                {purchaseData?.status === 'draft' &&
                  <Button
                    variant='success'
                    className='btn btn-sm btn-success'
                    onClick={handleConfirmPurchaseClick}
                    disabled={isConfirming}
                  >
                    Confirm Purchase
                  </Button>
                }

                {purchaseData?.status === 'confirmed' && !purchaseData?.postedToStock &&
                  <Button
                    variant='success'
                    className='btn btn-sm btn-success'
                    onClick={handlePostToStockClick}
                    disabled={isPosting}
                  >
                    Post To Stock
                  </Button>
                }

                {purchaseData?.status === 'draft' &&
                  <Typography variant='body2' className='bg-secondary text-white px-2 py-1 rounded text-capitalize'>
                    Draft
                  </Typography>
                }
                {purchaseData?.status === 'confirmed' &&
                  <Typography variant='body2' className='bg-primary text-white px-2 py-1 rounded text-capitalize'>
                    Confirmed
                  </Typography>
                }
                {purchaseData?.status === 'received' &&
                  <Typography variant='body2' className='bg-success text-white px-2 py-1 rounded text-capitalize'>
                    Received
                  </Typography>
                }
                {purchaseData?.status === 'cancelled' &&
                  <Typography variant='body2' className='bg-danger text-white px-2 py-1 rounded text-capitalize'>
                    Cancelled
                  </Typography>
                }
              </Box>
            </Box>
          </CardTitle>

        </CardHeader>
        <CardBody>
          <div className='d-flex flex-row  gap-5'>
            <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">
              <li>
                <span className="fw-medium text-dark fw-bold">Invoice No:&nbsp;</span>
                {purchaseData?.invoiceNo}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Purchase Date:&nbsp;</span>
                {purchaseData?.purchaseDate ? new Date(purchaseData?.purchaseDate).toLocaleDateString() : '-'}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Supplier:&nbsp;</span>
                {purchaseData?.supplierName}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Warehouse:&nbsp;</span>
                {purchaseData?.warehouseName}
              </li>
            </ul>
            <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">

              <li>
                <span className="fw-medium text-dark fw-bold">Status:&nbsp;</span>
                {purchaseData?.status}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Total Amount:&nbsp;</span>
                {purchaseData?.totalAmount}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Notes:&nbsp;</span>
                {purchaseData?.notes || '-'}
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h5 className="mb-3">Items</h5>
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product ID</th>
                    <th>Variant ID</th>
                    <th>Batch No</th>
                    <th>Expiry Date</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseData?.items && purchaseData?.items.length > 0 ? (
                    purchaseData?.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.productName}</td>
                        <td>{item.variantName || '-'}</td>
                        <td>{item.batchNo}</td>
                        <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}</td>
                        <td>{item.quantity}</td>
                        <td>{item.purchasePrice}</td>
                        <td>{item.lineTotal}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No items found</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6" className="text-end fw-bold">Total Amount</td>
                    <td className="fw-bold">{totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};
export default ItemDetails;