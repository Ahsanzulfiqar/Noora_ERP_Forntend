import { useEffect, useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const PostToStockModal = ({
  show,
  items = [],
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [rows, setRows] = useState([]);
  const [taxAmount, setTaxAmount] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setRows(
        (items || []).map((item) => ({
          product: item.product,
          productName: item.productName,
          variant: item.variant || null,
          variantName: item.variantName,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice ?? '',
          batchNo: item.batchNo ?? '',
          expiryDate: item.expiryDate
            ? new Date(item.expiryDate).toISOString().slice(0, 10)
            : '',
        }))
      );
      setTaxAmount(0);
      setErrors({});
    }
  }, [show, items]);

  const handleChange = (index, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const validate = () => {
    const newErrors = {};
    rows.forEach((row, index) => {
      const rowErrors = {};
      if (row.purchasePrice === '' || isNaN(Number(row.purchasePrice)) || Number(row.purchasePrice) < 0) {
        rowErrors.purchasePrice = 'Required';
      }
      if (!row.batchNo || !String(row.batchNo).trim()) {
        rowErrors.batchNo = 'Required';
      }
      if (!row.expiryDate) {
        rowErrors.expiryDate = 'Required';
      }
      if (Object.keys(rowErrors).length) {
        newErrors[index] = rowErrors;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payloadItems = rows.map((row) => ({
      product: row.product,
      variant: row.variant || null,
      purchasePrice: Number(row.purchasePrice),
      batchNo: String(row.batchNo).trim(),
      expiryDate: row.expiryDate,
    }));
    onConfirm({
      items: payloadItems,
      taxAmount: Number(taxAmount) || 0,
    });
  };

  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Post To Stock</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted mb-3">
          Please provide purchase price, batch no and expiry date for each item before posting to stock.
        </p>

        <div className="table-responsive">
          <Table bordered className="mb-3 align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th style={{ minWidth: 140 }}>Purchase Price</th>
                <th style={{ minWidth: 160 }}>Batch No</th>
                <th style={{ minWidth: 170 }}>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No items</td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <div className="fw-medium">{row.productName}</div>
                      {row.variantName && (
                        <small className="text-muted">{row.variantName}</small>
                      )}
                    </td>
                    <td>{row.quantity}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.purchasePrice}
                        onChange={(e) => handleChange(index, 'purchasePrice', e.target.value)}
                        isInvalid={!!errors[index]?.purchasePrice}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors[index]?.purchasePrice}
                      </Form.Control.Feedback>
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={row.batchNo}
                        onChange={(e) => handleChange(index, 'batchNo', e.target.value)}
                        isInvalid={!!errors[index]?.batchNo}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors[index]?.batchNo}
                      </Form.Control.Feedback>
                    </td>
                    <td>
                      <Form.Control
                        type="date"
                        value={row.expiryDate}
                        onChange={(e) => handleChange(index, 'expiryDate', e.target.value)}
                        isInvalid={!!errors[index]?.expiryDate}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors[index]?.expiryDate}
                      </Form.Control.Feedback>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <Form.Group className="d-flex align-items-center gap-2" style={{ maxWidth: 320 }}>
          <Form.Label className="mb-0 fw-medium">Tax Amount</Form.Label>
          <Form.Control
            type="number"
            min="0"
            step="0.01"
            value={taxAmount}
            onChange={(e) => setTaxAmount(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || rows.length === 0}
        >
          {loading ? 'Posting...' : 'Post To Stock'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostToStockModal;
