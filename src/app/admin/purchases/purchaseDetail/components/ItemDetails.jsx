import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import GlobalSpinner from '../../../../../components/loaders/GlobalSpinner';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { usePostToStockMutation } from '@/services/endpoints/purchases';
import { useState } from 'react';
import DeleteConfirmModal from '../../../../../components/DeleteConfirmModal';
import StatusAlert from '@/components/StatusAlert';

const ItemDetails = ({ isLoadingPurchase, purchaseData }) => {
  const [postToStock, { isLoading: isPosting, isSuccess: isPostSuccess, error: postError }] = usePostToStockMutation();
  const [showPostConfirm, setShowPostConfirm] = useState(false);

  const handlePostToStockClick = () => {
    setShowPostConfirm(true);
  };

  const handleConfirmPostToStock = async () => {
    try {
      await postToStock(purchaseData?._id).unwrap();
      setShowPostConfirm(false);
    } catch (err) {
      console.error('Failed to post to stock:', err);
    }
  };

  const handleCancelPostToStock = () => {
    setShowPostConfirm(false);
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

  const {
    invoiceNo,
    purchaseDate,
    supplierName,
    warehouse,
    status,
    notes,
    totalAmount,
    items
  } = purchaseData || {};

  return (
    <Col lg={12}>
      <StatusAlert isSuccess={isPostSuccess} message="Purchase posted to stock successfully" error={postError} />
      <DeleteConfirmModal
        show={showPostConfirm}
        title="Post to Stock"
        message="Are you sure you want to post this purchase to stock?"
        confirmText="Yes, Post"
        cancelText="Cancel"
        confirmVariant="primary"
        loading={isPosting}
        onConfirm={handleConfirmPostToStock}
        onCancel={handleCancelPostToStock}
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
                <Link to={`/purchases/purchase-edit/${purchaseData?._id}`} className="btn btn-sm btn-primary">
                  Edit Purchase
                </Link>
                {status === 'confirmed' && !purchaseData?.postedToStock &&
                  <Button
                    variant='success'
                    className='btn btn-sm btn-success'
                    onClick={handlePostToStockClick}
                    disabled={isPosting}
                  >
                    Post To Stock
                  </Button>
                }
                {status === 'draft' &&
                  <Typography variant='success' className='bg-success text-white px-2 py-1 rounded'>
                    Draft
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
                {invoiceNo}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Purchase Date:&nbsp;</span>
                {purchaseDate ? new Date(purchaseDate).toLocaleDateString() : 'N/A'}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Supplier:&nbsp;</span>
                {supplierName}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Warehouse ID:&nbsp;</span>
                {warehouse}
              </li>
            </ul>
            <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">

              <li>
                <span className="fw-medium text-dark fw-bold">Status:&nbsp;</span>
                {status}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Total Amount:&nbsp;</span>
                {totalAmount}
              </li>
              <li>
                <span className="fw-medium text-dark fw-bold">Notes:&nbsp;</span>
                {notes || 'N/A'}
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
                  {items && items.length > 0 ? (
                    items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product}</td>
                        <td>{item.variant}</td>
                        <td>{item.batchNo}</td>
                        <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
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
              </table>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};
export default ItemDetails;